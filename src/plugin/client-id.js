// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 09/05/2026

"use strict";

const { ua } = require('./user-agent');

const cheerio = require("cheerio");

const getFreshClientID = async (userAgent) => {
    try {
        const response = await fetch('https://soundcloud.com', {
            headers: {
                'User-Agent': userAgent || ua,
            }
        });

        const html = await response.text();
        const $ = cheerio.load(html);

        // Find all script tags with src attributes that contain 'sndcdn.com/assets/'
        const scriptUrls = [];
        $('script[src]').each((i, el) => {
            const src = $(el).attr('src');
            // Search for the client_id pattern in the script content
            if (src && src.includes('sndcdn.com/assets/')) {
                scriptUrls.push(src);
            }
        });

        // Iterate through the script URLs in reverse order to find the latest one
        for (const url of scriptUrls.reverse()) {
            const jsRes = await fetch(url, {
                headers: {
                    'User-Agent': userAgent || ua,
                    // intentionally not forcing Content-Type to match original behavior
                }
            });
            const jsContent = await jsRes.text();

            // Yeps! We found the client_id in the script content
            const match = jsContent.match(/client_id[:=]\s*["']([a-zA-Z0-9]{32})["']/);
            if (match && match[1]) {
                // FINALLY! Return the client_id if found or else skip it
                return match[1];
            }
        }
    } catch (e) {
        // Well, SoundCloud might have changed their structure or something went wrong, so we throw an error or have blocked the request. 
        // Either way, we can't get the client_id now :(
        throw new Error(`Cannot fetch clientID from SoundCloud: ${e.message ? e.message : e}`);
    }
}


module.exports = {
    getFreshClientID
}