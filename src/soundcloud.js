// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 07/09/2026
"use strict";

const { ua } = require('./plugin/user-agent');
const { getFreshClientID } = require('./plugin/client-id');
const { fetchSong } = require('./plugin/track');
const { search } = require('./plugin/search');
const { fetchPlaylist } = require('./plugin/playlist');
const { fetchProfile } = require('./plugin/profile');

//const cheerio = require("cheerio");

class SoundCloudClient {
    constructor(options = {}) {
        this._useragent = options ? options.userAgent : ua; // Use the provided user agent or default to the one from user-agent.js
        this._clientId = options ? options.clientId : getFreshClientID(this._useragent); // Fetch one if not provided!
    }

    async getClientId() {
        if (!this._clientId) {
            this._clientId = await getFreshClientID(this._useragent);
        }
        return this._clientId;
    }

    async getMetaData(songOptions) {
        const { url, userAgent } = songOptions;
        const clientId = await this._clientId || await this.getClientId(this._useragent);
        const finalUserAgent = userAgent || this._useragent;
        
        // Validate inputs
        if (!url) throw new Error("No song URL provided!");
        if (!clientId) throw new Error("No client ID available! Please provide one or allow the client to fetch it.");
        
        // Fetch the song metadata using the provided URL, user agent, and client ID
        return await fetchSong(url, finalUserAgent, clientId);
    }

    async getPlaylist(playlistOptions) {
        const { url, userAgent, limit = 10 } = playlistOptions;
        const clientId = await this._clientId || await this.getClientId(this._useragent);
        const finalUserAgent = userAgent || this._useragent;

        // Validate inputs
        if (!url) throw new Error("No playlist URL provided!");
        if (!clientId) throw new Error("No client ID available! Please provide one or allow the client to fetch it.");

        // Fetch the playlist metadata using the provided URL, user agent, and client ID.
        // `limit` caps how many tracks come back - a positive integer, or "max" for the whole playlist.
        return await fetchPlaylist(url, finalUserAgent, clientId, limit);
    }

    async getProfile(profileOptions) {
        const { username, userAgent } = profileOptions;
        const clientId = await this._clientId || await this.getClientId(this._useragent);
        const finalUserAgent = userAgent || this._useragent;

        // Validate inputs
        if (!username) throw new Error("No username or profile URL provided!");
        if (!clientId) throw new Error("No client ID available! Please provide one or allow the client to fetch it.");

        // `username` accepts either a bare username ("BlazeInferno64") or a full profile URL
        return await fetchProfile(username, finalUserAgent, clientId);
    }

    async search(searchOptions = {}) {
        const { query, userAgent, ...options } = searchOptions;
        const clientId = await this._clientId || await this.getClientId(this._useragent);
        const finalUserAgent = userAgent || this._useragent;

        // Validate inputs
        if (!query) throw new Error("No search query provided!");
        if (!clientId) throw new Error("No client ID available! Please provide one or allow the client to fetch it.");

        // Search for tracks matching the query, using the provided user agent and client ID
        return await search(query, finalUserAgent, clientId, options);
    }
}


module.exports = {
    SoundCloudClient
}