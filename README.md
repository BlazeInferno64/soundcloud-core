[![NPM Version](http://img.shields.io/npm/v/soundcloud-core.svg?style=flat-square)](https://npmjs.com/package/soundcloud-core)
[![Dependencies](https://img.shields.io/badge/dependencies-0-success?style=flat-square)](https://www.npmjs.com/package/soundcloud-core?activeTab=dependencies)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen?style=flat-square&logo=node.js)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

[![NPM Downloads](https://img.shields.io/npm/dm/soundcloud-core.svg?style=flat-square)](https://npm-stat.com/charts.html?package=soundcloud-core)
[![Install Size](https://packagephobia.com/badge?p=soundcloud-core&style=flat-square)](https://packagephobia.com/result?p=soundcloud-core)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/soundcloud-core?style=flat-square)](https://bundlephobia.com/package/soundcloud-core@latest)

![GitHub last commit](https://img.shields.io/github/last-commit/blazeinferno64/soundcloud-core?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/blazeinferno64/soundcloud-core?style=flat-square)
[![Gitpod Ready-to-code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod&style=flat-square)](https://gitpod.io/#https://github.com/blazeinferno64/soundcloud-core)
[![Author](https://img.shields.io/badge/author-BlazeInferno64-orange?style=flat-square&logo=github)](https://github.com/blazeinferno64)
![GitHub Repo stars](https://img.shields.io/github/stars/blazeinferno64/soundcloud-core?style=social)

# soundcloud-core

> Fast, Minimalist, Unofficial SoundCloud v2 API client wrapper for [Node.js](https://nodejs.org)

## Disclaimer & Terms of Use

This project is an independent, unofficial wrapper for the **SoundCloud v2 API**. It is **not** affiliated, endorsed, sponsored, or officially connected with SoundCloud Limited in any way. 

The author and contributors do not encourage, condone, or support any misuse of the [SoundCloud API](https://developers.soundcloud.com/), scraping practices, or any actions that violate [SoundCloud's Terms of Service](https://soundcloud.com/terms-of-use), [API Terms of Use](https://developers.soundcloud.com/docs/api/terms-of-use), or platform policies. This library is provided for educational and experimental purposes only. Users are solely responsible for ensuring that their usage of this software complies with **SoundCloud's official terms and applicable laws**.

# Installation

To get started with `soundcloud-core`, simply run the following command in your terminal:

Using [npm](https://npmjs.com) installation command:

```bash
$ npm i soundcloud-core
```

Using [yarn](https://yarnpkg.com) installation command:

```bash
$ yarn add soundcloud-core
```

Using [bun](https://bun.sh) installation command:

```bash
$ bun add soundcloud-core
```
# Info

New to Promises?

If you're not familiar with promises, check out the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to learn more.

## Built on Top of Node.js HTTP library

Under the hood, `soundcloud-core` uses the native [Fetch API](https://nodejs.org/learn/getting-started/fetch) provided by Node.js (undici), ensuring a seamless and efficient experience without any third party packages.

# Getting started

First, require/import this library to your project as follows:

```js
const { SoundCloudClient } = require("soundcloud-core");
```

If it's an ES Module then import it to your project as follows:

```js
import { SoundCloudClient } from "soundcloud-core";
```

Then spin up a client and you're good to go:

```js
const client = new SoundCloudClient();
```

# Client Id

As per [SoundCloud's v2 API](https://developers.soundcloud.com/), no client id is strictly necessary to use this library - if you don't pass one in, `soundcloud-core` will quietly go fetch a fresh one for you the first time it actually needs it (by pulling it straight off [soundcloud.com](https://soundcloud.com)), and reuse it for the lifetime of the client.

That said, if you already have a `client_id` lying around (or you're hitting rate limits and want a bit more control over when/how it's fetched), you can just hand it to the constructor yourself:

```js
const client = new SoundCloudClient({
    // Leave it empty, incase you don't have one!
    clientId: "your_client_id"
});
```

You can also grab whatever `client_id` the client ends up using, in case you want to cache it or reuse it elsewhere:

```js
const clientId = await client.getClientId();
console.log(clientId);
```

# Usage

Every method on `SoundCloudClient` returns a promise, so `await` them (or `.then()` them) inside an `async` function.

## Fetching a track

```js
const client = new SoundCloudClient();

const track = await client.getMetaData({
    url: "https://soundcloud.com/martingarrix/martin-garrix-animals-original" // Martin Garrix - Animals
});

console.log(track.title);      // "Track Name"
console.log(track.streamUrl);  // Playable HLS/progressive stream (Best for audio quality) URL (short-lived!)
```

Keep in mind `streamUrl` is short-lived and will expire after a while, so don't go caching it for later - fetch it fresh whenever you actually need to stream the track.

## Fetching a playlist

```js
const playlist = await client.getPlaylist({
    // Place your playlist url here, for example I'am placing my playlist url here
    url: "https://soundcloud.com/blazeinferno64/sets/only-house",
    limit: 20 // grab up to 20 tracks, or pass "max" for the whole playlist
});

console.log(playlist.title, playlist.trackCount);
playlist.tracks.forEach(track => console.log(track.title));
```

## Fetching a user profile

```js
// A bare username works just as well as a full profile URL
const profile = await client.getProfile({
    // Your username here, for example I'am placing my username here
    username: "BlazeInferno64"
});

console.log(profile.username, profile.stats.followers);
```

## Searching for tracks

```js
const results = await client.search({
    query: "Martin Garrix - Animals", // Any song you want to search
    limit: 15
});

results.forEach(track => console.log(track.title, "-", track.artist.username));
```

# LICENSE

`soundcloud-core` is released under the MIT License.

View the full license terms <a href="https://github.com/BlazeInferno64/soundcloud-core/blob/main/LICENSE">here</a>.

# Bugs & Issues

Found a bug or want a new feature?

Report issues and request features on the [soundcloud-core issue tracker](https://github.com/blazeinferno64/soundcloud-core/issues).

`Thanks for reading!`

`Have a great day ahead :D`