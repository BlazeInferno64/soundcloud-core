// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 19/09/2026

const { ua } = require('./user-agent');
const { getFreshClientID } = require('./client-id');
const { validateIp } = require("./ip");

const CHUNK_SIZE = 50; // SoundCloud's batch tracks endpoint caps out around here - stay safely under it

// `limit` accepts a positive integer (how many tracks to include) or the string "max" (every track in the playlist).
// Returns Infinity for "max" so the slice() below just takes everything.
const resolveLimit = (limit) => {
    if (limit === 'max') return Infinity;
    if (typeof limit === 'number' && Number.isInteger(limit) && limit > 0) return limit;
    throw new Error(`Invalid limit provided! Expected a positive integer or "max", got: ${JSON.stringify(limit)}`);
};

// Turn a raw track (whether it came inline or from a batch fetch) into the same reduced shape.
// track === null covers the case where a stub id couldn't be resolved (deleted/private/geo-blocked).
const reduceTrack = (id, track) => {
    if (!track) {
        return { id, title: null, permalinkUrl: null, duration: null, genre: null, artworkUrl: null, artist: null };
    }

    return {
        id: track.id,
        title: track.title,
        permalinkUrl: track.permalink_url,
        duration: track.duration,
        genre: track.genre,
        artworkUrl: track.artwork_url
            ? track.artwork_url.replace("-large.jpg", "-t500x500.jpg")
            : (track.user?.avatar_url?.replace("-large.jpg", "-t500x500.jpg") || null),
        artist: track.user ? {
            id: track.user.id,
            username: track.user.username,
            profileUrl: track.user.permalink_url
        } : null
    };
};

// Fetches full track data for a batch of stub ids, chunked to stay under SoundCloud's per-request limit.
// Returns a Map of id -> raw track so failed/missing ids can just fall back to null downstream.
const resolveStubTracks = async (ids, userAgent, clientID, forwardedIp) => {
    const resolved = new Map();

    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
        const chunk = ids.slice(i, i + CHUNK_SIZE);
        const idsUrl = `https://api-v2.soundcloud.com/tracks?ids=${chunk.join(',')}&client_id=${clientID}`;

        const response = await fetch(idsUrl, {
            headers: {
                'User-Agent': userAgent || ua,
                ...(forwardedIp && { 'X-Forwarded-For': forwardedIp }),
            }
        });

        if (!response.ok) continue; // Skip a bad chunk rather than failing the whole playlist over a few tracks

        const chunkTracks = await response.json();
        for (const track of chunkTracks) {
            resolved.set(track.id, track);
        }
    }

    return resolved;
};

const fetchPlaylist = async (playlistUrl, userAgent, clientID, limit = 10, forwardedIp) => {
    // Validate up-front (outside the try/catch) so an invalid IP surfaces as its own IP_Validation_Error
    // instead of the generic error below - and before any request is made.
    if (forwardedIp !== undefined && forwardedIp !== null) validateIp(forwardedIp); // throws on an invalid IP

    try {
        if (!playlistUrl || typeof playlistUrl !== "string") {
            throw new Error("Invalid playlist URL provided!");
        }

        const maxTracks = resolveLimit(limit);

        if (!clientID) clientID = await getFreshClientID(userAgent, forwardedIp);

        const resolveUrl = `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(playlistUrl)}&client_id=${clientID}`;

        const response = await fetch(resolveUrl, {
            headers: {
                'User-Agent': userAgent || ua,
                ...(forwardedIp && { 'X-Forwarded-For': forwardedIp }),
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to resolve playlist URL. Status: ${response.status}`);
        }

        const playlist = await response.json();

        // The resolve endpoint can also return tracks/users - playlists and "sets" both come back as kind "playlist".
        if (!playlist || playlist.kind !== "playlist") {
            throw new Error(`Provided URL did not resolve to a playlist (kind: ${playlist?.kind || "unknown"}).`);
        }

        const rawTracks = (playlist.tracks || []).slice(0, maxTracks === Infinity ? undefined : maxTracks);

        // SoundCloud only inlines full data for roughly the first 5 tracks - the rest come back as stubs (id only).
        // Batch-fetch the missing ones so the playlist comes back fully populated, same as the web app does.
        const stubIds = rawTracks.filter(t => !t.title).map(t => t.id);
        const resolvedStubs = stubIds.length
            ? await resolveStubTracks(stubIds, userAgent, clientID, forwardedIp)
            : new Map();

        const tracks = rawTracks.map(t =>
            reduceTrack(t.id, t.title ? t : resolvedStubs.get(t.id))
        );

        const playlistData = {
            id: playlist.id,
            title: playlist.title,
            description: playlist.description,
            permalinkUrl: playlist.permalink_url,
            trackCount: playlist.track_count, // total tracks in the playlist - not affected by `limit`, see `tracks.length` for how many actually came back
            duration: playlist.duration, // total duration in milliseconds
            genre: playlist.genre,
            createdAt: playlist.created_at,

            // Curator metadata (the user who made the playlist)
            curator: {
                id: playlist.user.id,
                username: playlist.user.username,
                profileUrl: playlist.user.permalink_url,
                avatarUrl: playlist.user.avatar_url?.replace("-large.jpg", "-t500x500.jpg")
            },

            artworkUrl: playlist.artwork_url
                ? playlist.artwork_url.replace("-large.jpg", "-t500x500.jpg")
                : playlist.user.avatar_url?.replace("-large.jpg", "-t500x500.jpg"),

            // Engagement stats
            stats: {
                likes: playlist.likes_count,
                reposts: playlist.reposts_count
            },

            tracks
        };

        return playlistData;
    } catch (e) {
        throw new Error("Failed to fetch playlist!");
    }
}

module.exports = {
    fetchPlaylist
}