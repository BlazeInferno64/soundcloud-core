// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 19/09/2026
"use strict";

const { ua } = require('./plugin/user-agent');
const { getFreshClientID } = require('./plugin/client-id');
const { fetchSong } = require('./plugin/track');
const { search } = require('./plugin/search');
const { fetchPlaylist } = require('./plugin/playlist');
const { fetchProfile } = require('./plugin/profile');
const { validateIp } = require('./plugin/ip');

//const cheerio = require("cheerio");

// DISCLAIMER: the `xForwardedFor` request option sets the request IP in the X-Forwarded-For header.
// It's best-effort only and may not always be successful - SoundCloud (or a CDN/proxy in front of it) is free
// to ignore or override the header and use the real connecting IP instead.
const XFF_DISCLAIMER =
    "The `xForwardedFor` option sets the request IP in the X-Forwarded-For header. " +
    "This is best-effort only and may not always be successful - SoundCloud (or a CDN/proxy in front of it) " +
    "is free to ignore or override the header and use the real connecting IP instead.";

let xffDisclaimerShown = false;

// Validates the optional `xForwardedFor` request option (throws IP_Validation_Error on an invalid IP, before any
// request goes out) and shows the disclaimer once per process the first time a valid IP is used.
// Goes through process.emitWarning, so it lands on stderr and can be silenced with --no-warnings / NODE_NO_WARNINGS=1.
const checkXForwardedFor = (xForwardedFor) => {
    if (xForwardedFor === undefined || xForwardedFor === null) return;

    validateIp(xForwardedFor);

    if (!xffDisclaimerShown) {
        xffDisclaimerShown = true;
        process.emitWarning(XFF_DISCLAIMER, { type: 'Disclaimer', code: 'SC_X_FORWARDED_FOR' });
    }
};

class SoundCloudClient {
    constructor(options = {}) {
        this._useragent = options ? options.userAgent : ua; // Use the provided user agent or default to the one from user-agent.js
        this._clientId = options ? options.clientId : getFreshClientID(this._useragent); // Fetch one if not provided!
    }

    async getClientId(clientIdOptions = {}) {
        const { xForwardedFor } = clientIdOptions;

        if (!this._clientId) {
            checkXForwardedFor(xForwardedFor);
            this._clientId = await getFreshClientID(this._useragent, xForwardedFor);
        }
        return this._clientId;
    }

    async getMetaData(songOptions) {
        const { url, userAgent, xForwardedFor } = songOptions;
        checkXForwardedFor(xForwardedFor);
        const clientId = await this._clientId || await this.getClientId({ xForwardedFor });
        const finalUserAgent = userAgent || this._useragent;
        
        // Validate inputs
        if (!url) throw new Error("No song URL provided!");
        if (!clientId) throw new Error("No client ID available! Please provide one or allow the client to fetch it.");
        
        // Fetch the song metadata using the provided URL, user agent, and client ID
        return await fetchSong(url, finalUserAgent, clientId, xForwardedFor);
    }

    async getPlaylist(playlistOptions) {
        const { url, userAgent, limit = 10, xForwardedFor } = playlistOptions;
        checkXForwardedFor(xForwardedFor);
        const clientId = await this._clientId || await this.getClientId({ xForwardedFor });
        const finalUserAgent = userAgent || this._useragent;

        // Validate inputs
        if (!url) throw new Error("No playlist URL provided!");
        if (!clientId) throw new Error("No client ID available! Please provide one or allow the client to fetch it.");

        // Fetch the playlist metadata using the provided URL, user agent, and client ID.
        // `limit` caps how many tracks come back - a positive integer, or "max" for the whole playlist.
        return await fetchPlaylist(url, finalUserAgent, clientId, limit, xForwardedFor);
    }

    async getProfile(profileOptions) {
        const { username, userAgent, xForwardedFor } = profileOptions;
        checkXForwardedFor(xForwardedFor);
        const clientId = await this._clientId || await this.getClientId({ xForwardedFor });
        const finalUserAgent = userAgent || this._useragent;

        // Validate inputs
        if (!username) throw new Error("No username or profile URL provided!");
        if (!clientId) throw new Error("No client ID available! Please provide one or allow the client to fetch it.");

        // `username` accepts either a bare username ("BlazeInferno64") or a full profile URL
        return await fetchProfile(username, finalUserAgent, clientId, xForwardedFor);
    }

    async search(searchOptions = {}) {
        const { query, userAgent, xForwardedFor, ...options } = searchOptions;
        checkXForwardedFor(xForwardedFor);
        const clientId = await this._clientId || await this.getClientId({ xForwardedFor });
        const finalUserAgent = userAgent || this._useragent;

        // Validate inputs
        if (!query) throw new Error("No search query provided!");
        if (!clientId) throw new Error("No client ID available! Please provide one or allow the client to fetch it.");

        // Search for tracks matching the query, using the provided user agent and client ID
        return await search(query, finalUserAgent, clientId, options, xForwardedFor);
    }
}


module.exports = {
    SoundCloudClient
}