// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 19/09/2026

const { ua } = require('./user-agent');
const { getFreshClientID } = require('./client-id');
const { validateIp } = require("./ip");

const search = async (query, userAgent, clientID, options = {}, forwardedIp) => {
    // Validate up-front (outside the try/catch) so an invalid IP surfaces as its own IP_Validation_Error
    // instead of the generic error below - and before any request is made.
    if (forwardedIp !== undefined && forwardedIp !== null) validateIp(forwardedIp); // throws on an invalid IP

    try {
        if (!query || typeof query !== "string") {
            throw new Error("Invalid search query provided!");
        }

        if (!clientID) clientID = await getFreshClientID(userAgent, forwardedIp);

        const limit = options.limit || 10; // How many results to return - defaults to 10, same as the web app's initial batch

        const searchUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientID}&limit=${limit}`;

        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': userAgent || ua,
                ...(forwardedIp && { 'X-Forwarded-For': forwardedIp }),
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