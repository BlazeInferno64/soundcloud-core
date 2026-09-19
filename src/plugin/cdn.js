// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 19/09/2026

const { ua } = require('./user-agent');
const { getFreshClientID } = require('./client-id');
const { validateIp } = require("./ip");

//const cheerio = require("cheerio");

const getCDNUrl = async (track, clientID, userAgent, forwardedIp) => {
    // Validate up-front (outside the try/catch) so an invalid IP surfaces as its own IP_Validation_Error
    // instead of the generic error below - and before any request is made.
    if (forwardedIp !== undefined && forwardedIp !== null) validateIp(forwardedIp); // throws on an invalid IP

    try {
        if (!track) throw new Error("Track ID is required to fetch the CDN URL.");
        if (!clientID) clientID = await getFreshClientID(userAgent, forwardedIp);

        if (!track.media?.transcodings?.length) return null;

        const transcodings = track.media.transcodings;

        // TOP PRIORITY: High Quality AAC (HLS)
        let transcoding = transcodings.find(t =>
            t.format.protocol === 'hls' &&
            t.preset.includes('aac')
        );

        // SECOND PRIORITY: Standard Progressive MP3
        if (!transcoding) {
            transcoding = transcodings.find(t =>
                t.format.protocol === 'progressive' &&
                t.format.mime_type.includes('audio/mpeg')
            );
        }

        // LAST RESORT: Anything that isn't Opus
        if (!transcoding) {
            transcoding = transcodings.find(t => !t.preset.includes('opus'));
        }

        if (!transcoding) return null;

        // Construct the final URL with the client_id and optional track_authorization
        let url = `${transcoding.url}?client_id=${clientID}`;
        if (track.track_authorization) {
            // Append the track_authorization parameter if it exists
            url += `&track_authorization=${track.track_authorization}`;
        }

        // Here we make the request to get the actual CDN URL to stream the track. We use the provided userAgent or default to the one from user-agent.js.
        const response = await fetch(url, {
            headers: {
                'User-Agent': userAgent || ua,
                ...(forwardedIp && { 'X-Forwarded-For': forwardedIp }),
                'Accept': 'application/json' // Requesting JSON response
            }
        })

        const data = await response.json();
        return data.url; // Return the actual CDN URL for streaming! If HLS, this will be a .m3u8 playlist URL; if progressive, it will be a direct .mp3 URL.

    } catch (e) {
        // If any error occurs during the process, we throw an error with a descriptive message.
        throw new Error(`Cannot fetch CDN URL for track ${track}: ${e.message ? e.message : e}`);
    }
}

// Export the functions
module.exports = {
    getCDNUrl
}