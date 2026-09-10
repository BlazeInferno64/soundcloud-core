// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 09/05/2026

const { ua } = require('./user-agent');
const { getFreshClientID } = require('./client-id');

const search = async (query, userAgent, clientID, options = {}) => {
    try {
        if (!query || typeof query !== "string") {
            throw new Error("Invalid search query provided!");
        }

        if (!clientID) clientID = await getFreshClientID(userAgent);

        const limit = options.limit || 10; // How many results to return - defaults to 10, same as the web app's initial batch

        const searchUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientID}&limit=${limit}`;

        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': userAgent || ua,
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to search tracks. Status: ${response.status}`);
        }

        const data = await response.json();

        // The search endpoint wraps results in a "collection" array - bail out early if it's missing/empty
        if (!data || !Array.isArray(data.collection)) {
            return [];
        }

        // Trim each track down to what you'd actually want from a search result (not the full track.js payload -
        // no streamUrl/trackAuthorization here since these are just candidates, not a resolved track yet)
        const results = data.collection.map(track => ({
            id: track.id,
            title: track.title,
            permalinkUrl: track.permalink_url,
            duration: track.duration, // in milliseconds
            genre: track.genre,

            artworkUrl: track.artwork_url
                ? track.artwork_url.replace("-large.jpg", "-t500x500.jpg")
                : track.user?.avatar_url?.replace("-large.jpg", "-t500x500.jpg"),

            artist: {
                id: track.user?.id,
                username: track.user?.username,
                profileUrl: track.user?.permalink_url
            },

            stats: {
                plays: track.playback_count,
                likes: track.likes_count,
                comments: track.comment_count,
                reposts: track.reposts_count
            }
        }));

        return results;
    } catch (e) {
        throw new Error("Failed to search tracks!");
    }
}

module.exports = {
    search
}