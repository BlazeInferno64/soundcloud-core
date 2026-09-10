// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 09/05/2026

const { ua } = require('./user-agent');
const { getFreshClientID } = require('./client-id');
const { getCDNUrl } = require('./cdn');

const cheerio = require("cheerio");

const fetchSong = async (songUrl, userAgent, clientID) => {
    try {
        if (!songUrl || typeof songUrl !== "string") {
            throw new Error("Invalid song URL provided!");
        }

        const resolveUrl = `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(songUrl)}&client_id=${clientID}`;

        const response = await fetch(resolveUrl, {
            headers: {
                'User-Agent': userAgent || ua,
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to resolve song URL. Status: ${response.status}`);
        }

        let track = await response.json();

        // The resolve endpoint can also return sets/users/playlists - we only want single tracks here.
        if (!track || track.kind !== "track") {
            throw new Error(`Provided URL did not resolve to a single track (kind: ${track?.kind || "unknown"}).`);
        }

        // Some resolved tracks omit media/track_authorization - fetch the full track record.
        if (!track.media || !track.track_authorization) {
            const trackRes = await fetch(`https://api-v2.soundcloud.com/tracks/${track.id}?client_id=${clientID}`, {
                headers: {
                    'User-Agent': userAgent || ua,
                }
            });
            track = await trackRes.json();
        }

        const cdnUrl = await getCDNUrl(track, clientID, userAgent || ua);

        if (!cdnUrl) {
            throw new Error(`No playable stream found for track: ${track.title}`);
        }

        const songData = {
            id: track.id,
            title: track.title,
            description: track.description,
            duration: track.duration, // in milliseconds
            genre: track.genre,
            createdAt: track.created_at,

            // Artist Metadata
            artist: {
                id: track.user.id,
                username: track.user.username,
                profileUrl: track.user.permalink_url,
                avatarUrl: track.user.avatar_url?.replace("-large.jpg", "-t500x500.jpg")
            },

            // Visual Assets (Upgraded to high-res, falling back to avatar)
            artworkUrl: track.artwork_url
                ? track.artwork_url.replace("-large.jpg", "-t500x500.jpg")
                : track.user.avatar_url?.replace("-large.jpg", "-t500x500.jpg"),

            // Album / Publisher Info
            album: track.publisher_metadata?.album_title || null,
            label: track.publisher_metadata?.label_name || null,

            // Playback & CDN (The crucial part for your client)
            streamUrl: cdnUrl, // The final resolved HLS or progressive MP3 link
            trackAuthorization: track.track_authorization || null,

            // Engagement Stats (What you see on the web page)
            stats: {
                plays: track.playback_count,
                likes: track.likes_count,
                reposts: track.reposts_count,
                comments: track.comment_count
            }
        }

        return songData;
    } catch (e) {
        throw new Error("Failed to fetch song!");
    }
}


module.exports = {
    fetchSong
}

