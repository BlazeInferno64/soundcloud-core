// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 19/09/2026

// Type definitions for 'soundcloud-core'

/// <reference types="node" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

/**
 * Basic artist/uploader information attached to a track.
 */
interface Artist {
    /**
     * The unique identifier for the artist.
     */
    id: number;
    /**
     * The username of the artist on SoundCloud.
     */
    username: string;
    /**
     * The URL of the artist's profile on SoundCloud.
     */
    profileUrl: string;
    /**
     * The URL of the artist's avatar image on SoundCloud.
     */
    avatarUrl: string;
}

/**
 * Engagement statistics for a single track.
 */
interface Stats {
    /**
     * The number of times the track has been played on SoundCloud.
     */
    plays: number;
    /**
     * The number of likes the track has received on SoundCloud.
     */
    likes: number;
    /**
     * The number of times the track has been reposted on SoundCloud.
     */
    reposts: number;
    /**
     * The number of comments the track has received on SoundCloud.
     */
    comments: number;
}

/**
 * Fully resolved metadata for a single SoundCloud track, including a
 * playable (though short-lived) stream URL.
 */
interface MetaData {
    /**
     * The unique identifier for the track.
     */
    id: number;
    /**
     * The title of the track.
     */
    title: string;
    /**
     * The description of the track.
     */
    description: string;
    /**
     * The duration of the track in milliseconds (ms).
     */
    duration: number;
    /**
     * The genre of the track.
     */
    genre: string;
    /**
     * The date and time when the track was created, in ISO 8601 format.
     */
    createdAt: string;
    /**
     * The artist information associated with the track.
     */
    artist: Artist;
    /**
     * The URL of the artwork image for the track.
     */
    artworkUrl: string;
    /**
     * The album associated with the track, if any.
     */
    album: string | null;
    /**
     * The label associated with the track, if any. If the track is not associated with a label, this property will be null.
     */
    label: string | null;
    /**
     * The URL of the track's streamable audio file. This URL can be used to stream the track's audio.
     *
     * **Please note that the stream URLs are short-lived and may expire after a certain period of time**
     */
    streamUrl: string;
    /**
     * The authorization token required to access the track's streamable audio file. This token is used in conjunction with the stream URL to authenticate the request for streaming the track.
     */
    trackAuthorization: string;
    /**
     * Stats associated with the track, including plays, likes, reposts, and comments.
     */
    stats: Stats;
}

/**
 * Geographic location information for a user, as set on their profile.
 */
interface LocationInfo {
    /**
     * The city where the user is located, if specified.
     */
    city: string | null;
    /**
     * The country where the user is located, if specified.
     */
    country: string | null;
}

/**
 * Verification and subscription-tier badges shown next to a username.
 */
interface Badges {
    /**
     * Indicates whether the user account is verified by SoundCloud.
     */
    verified: boolean;
    /**
     * Indicates whether the user holds a Pro subscription tier.
     */
    pro: boolean;
    /**
     * Indicates whether the user holds a Pro Unlimited subscription tier.
     */
    proUnlimited: boolean;
}

/**
 * Subscription information tied to a user's account.
 */
interface Subscriptions {
    /**
     * A list of active creator-specific subscriptions.
     */
    creatorSubscriptions: any[];
    /**
     * The current creator subscription tier level (e.g., 'free').
     */
    creatorSubscription: string;
}

/**
 * A user's "station" is what SoundCloud autoplays after their tracks
 * finish (their own auto-generated radio mix).
 */
interface Station {
    /**
     * The Uniform Resource Name for the artist's automated station playlist.
     */
    urn: string | null;
    /**
     * The permalink identifier for the artist station.
     */
    permalink: string | null;
}

/**
 * A single external link listed in a profile's "Links" section
 * (personal site, Instagram, Twitter/X, etc.).
 */
interface WebProfile {
    /**
     * The network/platform the link belongs to (e.g. "instagram", "personal").
     */
    network: string;
    /**
     * The display title of the link, if the user set a custom one.
     */
    title: string | null;
    /**
     * The full URL of the linked resource.
     */
    url: string;
}

/**
 * Aggregate activity and engagement metrics shown on a user's profile page.
 */
interface UserStats {
    /**
     * The total count of users following this profile.
     */
    followers: number;
    /**
     * The total count of users this profile follows.
     */
    following: number;
    /**
     * The total number of audio tracks uploaded by the user.
     */
    tracks: number;
    /**
     * The total number of playlists created by the user.
     */
    playlists: number;
    /**
     * The number of playlists liked by the user.
     */
    playlistLikes: number;
    /**
     * The number of tracks liked by the user.
     */
    likes: number;
    /**
     * The number of reposts made by the user, if available.
     */
    reposts: number | null;
    /**
     * The number of comments posted by the user.
     */
    comments: number;
    /**
     * The number of community groups the user has joined.
     */
    groups: number;
    /**
     * The user's birth date, if provided.
     */
    dateOfBirth: string | null;
}

/**
 * Fully resolved profile data for a SoundCloud user.
 */
interface Profile {
    /**
     * The unique numerical identifier for the user account.
     */
    id: number;
    /**
     * The SoundCloud Uniform Resource Name for the user entity (e.g. "soundcloud:users:1197971329").
     * Useful if you're caching/de-duping across requests.
     */
    urn: string | null;
    /**
     * The unique display username of the user.
     */
    username: string;
    /**
     * The first name associated with the account.
     */
    firstName: string | null;
    /**
     * The last name associated with the account, if any.
     */
    lastName: string | null;
    /**
     * The combined full name of the user.
     */
    fullName: string | null;
    /**
     * The URL-friendly path slug for the user profile (e.g. "blazeinferno64"), as opposed to the full `permalinkUrl` below.
     */
    permalink: string | null;
    /**
     * The full public web URL to the user's SoundCloud profile.
     */
    permalinkUrl: string;
    /**
     * The user bio or profile description text.
     */
    description: string | null;
    /**
     * The entity classification type. Should always be "user" for a resolved profile, but included for completeness.
     */
    kind: string | null;
    /**
     * Geographic location information for the user.
     */
    location: LocationInfo;
    /**
     * The direct image URL for the user's profile avatar.
     */
    avatarUrl: string | undefined;
    /**
     * The direct image URL for the user's profile header banner, taken from the profile's `visuals` data. `null` if the user hasn't set one.
     */
    headerUrl: string | null;
    /**
     * Verification and pro status badge flags.
     */
    badges: Badges;
    /**
     * Detailed information on active account subscriptions.
     */
    subscriptions: Subscriptions;
    /**
     * An array of linked external social or web link objects, from the profile's "Links" section.
     */
    webProfiles: WebProfile[];
    /**
     * The automated radio station stream configuration for the artist.
     */
    station: Station;
    /**
     * Quantitative metrics tracking activity, engagement, and library size for the user.
     */
    stats: UserStats;
    /**
     * The ISO timestamp indicating when the user account was created, if available.
     */
    createdAt: string | null;
    /**
     * The ISO timestamp of the most recent profile modification, if available.
     */
    lastModified: string | null;
}

/**
 * A single track result returned from a search query. A lighter-weight
 * shape than {@link MetaData} - it's a search candidate, not a fully
 * resolved track, so it has no `streamUrl` or `trackAuthorization`.
 */
interface Search {
    /**
     * The unique identifier for the track.
     */
    id: number;
    /**
     * The title of the track.
     */
    title: string;
    /**
     * The permalink URL of the track on SoundCloud.
     */
    permalinkUrl: string;
    /**
     * The duration of the track in milliseconds (ms).
     */
    duration: number;
    /**
     * The genre of the track.
     */
    genre: string;
    /**
     * The URL of the artwork image for the track. This can be used to display the track's cover art in applications or websites.
     */
    artworkUrl: string | undefined;
    /**
     * The artist information associated with the track, including the artist's ID, username, profile URL, and avatar URL.
     */
    artist: Artist;
    /**
     * The stats associated with the track, including the number of plays, likes, reposts, and comments. This information can be used to display the track's popularity and engagement metrics.
     */
    stats: Stats;
}

/**
 * Minimal artist information attached to a track inside a playlist.
 * Unlike {@link Artist}, this shape has no `avatarUrl` since playlist
 * track data doesn't inline it.
 */
interface PlaylistTrackArtist {
    /**
     * The unique identifier for the artist.
     */
    id: number;
    /**
     * The username of the artist on SoundCloud.
     */
    username: string;
    /**
     * The URL of the artist's profile on SoundCloud.
     */
    profileUrl: string;
}

/**
 * A single track entry within a resolved playlist. Fields are nullable
 * because a track stub that couldn't be resolved (deleted, private, or
 * geo-blocked) still needs to appear in the list, just with empty data.
 */
interface PlaylistTrack {
    /**
     * The unique identifier for the track. Always present, even for an unresolved/stub track.
     */
    id: number;
    /**
     * The title of the track. `null` if the track could not be resolved.
     */
    title: string | null;
    /**
     * The permalink URL of the track on SoundCloud. `null` if the track could not be resolved.
     */
    permalinkUrl: string | null;
    /**
     * The duration of the track in milliseconds (ms). `null` if the track could not be resolved.
     */
    duration: number | null;
    /**
     * The genre of the track. `null` if the track could not be resolved.
     */
    genre: string | null;
    /**
     * The URL of the artwork image for the track, falling back to the artist's avatar. `null` if the track could not be resolved.
     */
    artworkUrl: string | null;
    /**
     * The artist information associated with the track. `null` if the track could not be resolved.
     */
    artist: PlaylistTrackArtist | null;
}

/**
 * Information about the user who curated (created) a playlist.
 */
interface PlaylistCurator {
    /**
     * The unique identifier for the curator.
     */
    id: number;
    /**
     * The username of the curator on SoundCloud.
     */
    username: string;
    /**
     * The URL of the curator's profile on SoundCloud.
     */
    profileUrl: string;
    /**
     * The URL of the curator's avatar image on SoundCloud.
     */
    avatarUrl: string | undefined;
}

/**
 * Engagement statistics for a playlist.
 */
interface PlaylistStats {
    /**
     * The number of likes the playlist has received on SoundCloud.
     */
    likes: number;
    /**
     * The number of times the playlist has been reposted on SoundCloud.
     */
    reposts: number;
}

/**
 * Fully resolved metadata for a SoundCloud playlist (or "set"), including
 * its populated track list.
 */
interface Playlist {
    /**
     * The unique identifier for the playlist.
     */
    id: number;
    /**
     * The title of the playlist.
     */
    title: string;
    /**
     * The description of the playlist, if any.
     */
    description: string | null;
    /**
     * The permalink URL of the playlist on SoundCloud.
     */
    permalinkUrl: string;
    /**
     * The total number of tracks in the playlist on SoundCloud. Not affected by the `limit` option passed to {@link SoundCloudClient.getPlaylist} - see `tracks.length` for how many actually came back.
     */
    trackCount: number;
    /**
     * The total duration of the playlist in milliseconds (ms).
     */
    duration: number;
    /**
     * The genre of the playlist.
     */
    genre: string;
    /**
     * The date and time when the playlist was created, in ISO 8601 format.
     */
    createdAt: string;
    /**
     * The user who created/curated the playlist.
     */
    curator: PlaylistCurator;
    /**
     * The URL of the artwork image for the playlist, falling back to the curator's avatar.
     */
    artworkUrl: string | undefined;
    /**
     * Engagement stats for the playlist, including likes and reposts.
     */
    stats: PlaylistStats;
    /**
     * The resolved list of tracks in the playlist, up to the requested `limit`.
     */
    tracks: PlaylistTrack[];
}

/**
 * Options accepted by the {@link SoundCloudClient} constructor.
 */
interface SoundCloudClientOptions {
    /**
     * A custom `User-Agent` header to use for all outgoing requests. Falls back to a built-in default user agent when omitted.
     */
    userAgent?: string;
    /**
     * A pre-fetched SoundCloud `client_id` to use for all requests. When omitted, one is fetched automatically the first time it's needed.
     */
    clientId?: string;
}

/**
 * Options accepted by {@link SoundCloudClient.getClientId}.
 */
interface ClientIdOptions {
    /**
     * An optional IPv4 or IPv6 address to send in the `X-Forwarded-For` header for this request only.
     *
     * **Disclaimer:** this is best-effort only and may not always be successful - SoundCloud (or a CDN/proxy in front of it) is free to ignore or override the header and use the real connecting IP instead.
     *
     * Must be a valid IP address, otherwise an `IP_Validation_Error` is thrown before any request is made.
     */
    xForwardedFor?: string;
}

/**
 * Options accepted by {@link SoundCloudClient.getMetaData}.
 */
interface SongOptions {
    /**
     * The full SoundCloud URL of the track to resolve.
     */
    url: string;
    /**
     * A custom `User-Agent` header to use for this request only. Falls back to the client's configured user agent when omitted.
     */
    userAgent?: string;
    /**
     * An optional IPv4 or IPv6 address to send in the `X-Forwarded-For` header for this request only.
     *
     * **Disclaimer:** this is best-effort only and may not always be successful - SoundCloud (or a CDN/proxy in front of it) is free to ignore or override the header and use the real connecting IP instead.
     *
     * Must be a valid IP address, otherwise an `IP_Validation_Error` is thrown before any request is made.
     */
    xForwardedFor?: string;
}

/**
 * How many tracks to include when resolving a playlist: a positive
 * integer, or the string `"max"` to return every track in the playlist.
 */
type PlaylistLimit = number | "max";

/**
 * Options accepted by {@link SoundCloudClient.getPlaylist}.
 */
interface PlaylistOptions {
    /**
     * The full SoundCloud URL of the playlist (or "set") to resolve.
     */
    url: string;
    /**
     * A custom `User-Agent` header to use for this request only. Falls back to the client's configured user agent when omitted.
     */
    userAgent?: string;
    /**
     * An optional IPv4 or IPv6 address to send in the `X-Forwarded-For` header for this request only.
     *
     * **Disclaimer:** this is best-effort only and may not always be successful - SoundCloud (or a CDN/proxy in front of it) is free to ignore or override the header and use the real connecting IP instead.
     *
     * Must be a valid IP address, otherwise an `IP_Validation_Error` is thrown before any request is made.
     */
    xForwardedFor?: string;
    /**
     * How many tracks to include in the resolved playlist - a positive integer, or `"max"` for the entire playlist. Defaults to `10`.
     */
    limit?: PlaylistLimit;
}

/**
 * Options accepted by {@link SoundCloudClient.getProfile}.
 */
interface ProfileOptions {
    /**
     * Either a bare username (e.g. `"BlazeInferno64"`) or a full SoundCloud profile URL.
     */
    username: string;
    /**
     * A custom `User-Agent` header to use for this request only. Falls back to the client's configured user agent when omitted.
     */
    userAgent?: string;
    /**
     * An optional IPv4 or IPv6 address to send in the `X-Forwarded-For` header for this request only.
     *
     * **Disclaimer:** this is best-effort only and may not always be successful - SoundCloud (or a CDN/proxy in front of it) is free to ignore or override the header and use the real connecting IP instead.
     *
     * Must be a valid IP address, otherwise an `IP_Validation_Error` is thrown before any request is made.
     */
    xForwardedFor?: string;
}

/**
 * Options accepted by {@link SoundCloudClient.search}. Any additional
 * search-tuning properties beyond `query`, `userAgent` and `xForwardedFor` are passed
 * through to the underlying search request.
 */
interface SearchOptions {
    /**
     * The search query text to look up tracks for.
     */
    query: string;
    /**
     * A custom `User-Agent` header to use for this request only. Falls back to the client's configured user agent when omitted.
     */
    userAgent?: string;
    /**
     * An optional IPv4 or IPv6 address to send in the `X-Forwarded-For` header for this request only.
     *
     * **Disclaimer:** this is best-effort only and may not always be successful - SoundCloud (or a CDN/proxy in front of it) is free to ignore or override the header and use the real connecting IP instead.
     *
     * Must be a valid IP address, otherwise an `IP_Validation_Error` is thrown before any request is made.
     */
    xForwardedFor?: string;
    /**
     * The maximum number of results to return. Defaults to `10`, matching the web app's initial batch size.
     */
    limit?: number;
    /**
     * Additional, forward-compatible search options passed through to the underlying SoundCloud search request.
     */
    [key: string]: any;
}

/**
 * A lightweight, dependency-driven client for interacting with SoundCloud's
 * unofficial `api-v2` endpoints - resolving tracks, playlists, and user
 * profiles, and searching for tracks, without requiring an official API key.
 *
 * @example
 * ```js
 * const { SoundCloudClient } = require('soundcloud-core');
 *
 * const client = new SoundCloudClient();
 *
 * const track = await client.getMetaData({ url: 'https://soundcloud.com/martingarrix/martin-garrix-animals-original' });
 * // Logs the streammable cdn url of the track, which is short-lived and expires after a few minutes.
 * console.log(track.streamUrl);
 * ```
 */
declare class SoundCloudClient {
    /**
     * Creates a new SoundCloud client instance.
     *
     * @param options - Optional configuration for the client.
     * @param options.userAgent - A custom `User-Agent` header to use for all requests made by this client. Defaults to a built-in user agent when omitted.
     * @param options.clientId - A pre-fetched SoundCloud `client_id` to reuse. When omitted, a fresh one is fetched automatically the first time it's needed.
     *
     * @example
     * ```js
     * // Use built-in defaults, fetching a client_id lazily on first use
     * const client = new SoundCloudClient();
     *
     * // Or provide your own user agent and/or client_id up front
     * const client2 = new SoundCloudClient({ clientId: 'your_client_id' });
     * ```
     */
    constructor(options?: SoundCloudClientOptions);

    /**
     * Returns the client's current SoundCloud `client_id`, fetching a fresh
     * one automatically if none has been set yet.
     *
     * @param clientIdOptions - Optional per-call options.
     * @param clientIdOptions.xForwardedFor - An optional IPv4/IPv6 address to send in the `X-Forwarded-For` header if a fresh `client_id` has to be fetched. Best-effort only - may not always be successful.
     *
     * @returns A promise that resolves with the client's `client_id`.
     *
     * @example
     * ```js
     * const clientId = await client.getClientId();
     * // Returns a string type value
     * ```
     */
    getClientId(clientIdOptions?: ClientIdOptions): Promise<string>;

    /**
     * Resolves a SoundCloud track URL into fully populated metadata,
     * including a playable stream URL.
     *
     * @param songOptions - Options describing which track to fetch.
     * @param songOptions.url - The full SoundCloud URL of the track to resolve.
     * @param songOptions.userAgent - A custom `User-Agent` header for this request only.
     * @param songOptions.xForwardedFor - An optional IPv4/IPv6 address to send in the `X-Forwarded-For` header for this request only - best-effort, may not always be successful (SoundCloud can ignore or override it). Must be a valid IPv4/IPv6 address.
     *
     * @returns A promise that resolves with the track's {@link MetaData}.
     *
     * @throws If no URL is provided, an invalid `xForwardedFor` IP is given, no client ID is available, the URL doesn't resolve to a track, or no playable stream could be found.
     *
     * @example
     * ```js
     * const track = await client.getMetaData({ url: 'https://soundcloud.com/martingarrix/martin-garrix-animals-original' });
     * console.log(track.title, track.streamUrl);
     * ```
     */
    getMetaData(songOptions: SongOptions): Promise<MetaData>;

    /**
     * Resolves a SoundCloud playlist (or "set") URL into fully populated
     * metadata, including its track list.
     *
     * @param playlistOptions - Options describing which playlist to fetch.
     * @param playlistOptions.url - The full SoundCloud URL of the playlist to resolve.
     * @param playlistOptions.userAgent - A custom `User-Agent` header for this request only.
     * @param playlistOptions.xForwardedFor - An optional IPv4/IPv6 address to send in the `X-Forwarded-For` header for this request only - best-effort, may not always be successful (SoundCloud can ignore or override it). Must be a valid IPv4/IPv6 address.
     * @param playlistOptions.limit - How many tracks to include - a positive integer, or `"max"` for every track. Defaults to `10`.
     *
     * @returns A promise that resolves with the {@link Playlist}.
     *
     * @throws If no URL is provided, an invalid `xForwardedFor` IP is given, no client ID is available, the URL doesn't resolve to a playlist, or an invalid `limit` is given.
     *
     * @example
     * ```js
     * // Only the first 5 tracks
     * const playlist = await client.getPlaylist({ url: 'https://soundcloud.com/blazeinferno64/sets/only-house', limit: 5 });
     *
     * // The entire playlist
     * const fullPlaylist = await client.getPlaylist({ url: 'https://soundcloud.com/blazeinferno64/sets/only-house', limit: 'max' });
     * ```
     */
    getPlaylist(playlistOptions: PlaylistOptions): Promise<Playlist[]>;

    /**
     * Resolves a SoundCloud username or profile URL into fully populated
     * profile data.
     *
     * @param profileOptions - Options describing which profile to fetch.
     * @param profileOptions.username - Either a bare username (e.g. `"BlazeInferno64"`) or a full profile URL.
     * @param profileOptions.userAgent - A custom `User-Agent` header for this request only.
     * @param profileOptions.xForwardedFor - An optional IPv4/IPv6 address to send in the `X-Forwarded-For` header for this request only - best-effort, may not always be successful (SoundCloud can ignore or override it). Must be a valid IPv4/IPv6 address.
     *
     * @returns A promise that resolves with the {@link Profile}.
     *
     * @throws If no username/URL is provided, an invalid `xForwardedFor` IP is given, no client ID is available, or the URL doesn't resolve to a user profile.
     *
     * @example
     * ```js
     * // Attaching my profile for example purposes :)
     * const profile = await client.getProfile({ username: 'BlazeInferno64' });
     * console.log(profile.stats.followers);
     * ```
     */
    getProfile(profileOptions: ProfileOptions): Promise<Profile>;

    /**
     * Searches SoundCloud for tracks matching a query.
     *
     * @param searchOptions - Options describing the search.
     * @param searchOptions.query - The search query text.
     * @param searchOptions.userAgent - A custom `User-Agent` header for this request only.
     * @param searchOptions.xForwardedFor - An optional IPv4/IPv6 address to send in the `X-Forwarded-For` header for this request only - best-effort, may not always be successful (SoundCloud can ignore or override it). Must be a valid IPv4/IPv6 address.
     * @param searchOptions.limit - The maximum number of results to return. Defaults to `10`.
     *
     * @returns A promise that resolves with an array of matching {@link Search} results. Resolves to an empty array if the search returns no results.
     *
     * @throws If no query is provided, an invalid `xForwardedFor` IP is given, no client ID is available, or the search request fails.
     *
     * @example
     * ```js
     * const results = await client.search({ query: 'Martin Garrix - Animals', limit: 20 });
     * // Logs the titles of the first 20 search results
     * results.forEach(track => console.log(track.title));
     * ```
     */
    search(searchOptions: SearchOptions): Promise<Search[]>;
}

declare namespace soundcloudJs {
    export {
        SoundCloudClient,
        SoundCloudClientOptions,
        ClientIdOptions,
        SongOptions,
        PlaylistOptions,
        PlaylistLimit,
        ProfileOptions,
        SearchOptions,
        MetaData,
        Profile,
        Playlist,
        Search,
        Artist,
        Stats,
        LocationInfo,
        Badges,
        Subscriptions,
        Station,
        WebProfile,
        UserStats,
        PlaylistTrack,
        PlaylistTrackArtist,
        PlaylistCurator,
        PlaylistStats
    }
}


/**
 * soundcloud-core is a Fast, Minimalist, Unofficial SoundCloud v2 API client wrapper for [Node.js](https://nodejs.org)
 * 
 * SoundCloud API Requests done right!
 * 
 * Learn more about it from [here](https://github.com/blazeinferno64/soundcloud-core)
 * @example 
 * // Require it in your project by doing -
 * const { SoundCloudClient } = require("soundcloud-core");
 * 
 * // Or import it to your project if its an ES module by doing -
 * import { SoundCloudClient } from "soundcloud-core";
 */
declare const soundcloud: typeof soundcloudJs;
export = soundcloud;