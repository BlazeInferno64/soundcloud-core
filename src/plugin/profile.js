// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 19/09/2026

const { ua } = require('./user-agent');
const { getFreshClientID } = require('./client-id');
const { validateIp } = require("./ip");

// Accepts either a bare username ("BlazeInferno64") or a full profile URL and normalizes it into
// something the resolve endpoint can work with either way.
const normalizeProfileUrl = (input) => {
    if (/^https?:\/\//i.test(input)) return input;
    return `https://soundcloud.com/${input.trim().toLowerCase()}`;
};

const fetchProfile = async (profileInput, userAgent, clientID, forwardedIp) => {
    // Validate up-front (outside the try/catch) so an invalid IP surfaces as its own IP_Validation_Error
    // instead of the generic error below - and before any request is made.
    if (forwardedIp !== undefined && forwardedIp !== null) validateIp(forwardedIp); // throws on an invalid IP

    try {
        if (!profileInput || typeof profileInput !== "string") {
            throw new Error("Invalid username or profile URL provided!");
        }

        if (!clientID) clientID = await getFreshClientID(userAgent, forwardedIp);

        const profileUrl = normalizeProfileUrl(profileInput);
        const resolveUrl = `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(profileUrl)}&client_id=${clientID}`;

        const response = await fetch(resolveUrl, {
            headers: {
                'User-Agent': userAgent || ua,
                ...(forwardedIp && { 'X-Forwarded-For': forwardedIp }),
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to resolve profile. Status: ${response.status}`);
        }

        const user = await response.json();

        //console.log("Resolved user data:", user); // Debugging log to inspect the resolved user object

        // The resolve endpoint can also return tracks/playlists depending on what the URL points to -
        // we only want an actual user profile here.
        if (!user || user.kind !== "user") {
            throw new Error(`Provided username/URL did not resolve to a profile (kind: ${user?.kind || "unknown"}).`);
        }

        // The banner image at the top of a profile page lives under visuals, not avatar_url - falls back
        // to null since plenty of profiles don't have one set.
        const headerUrl = user.visuals?.visuals?.[0]?.visual_url || null;

        const profileData = {
            id: user.id,
            urn: user.urn || null, // internal stable identifier, e.g. "soundcloud:users:1197971329" - useful if you're caching/de-duping across requests
            username: user.username,
            firstName: user.first_name || null,
            lastName: user.last_name || null,
            fullName: user.full_name || null,
            permalink: user.permalink || null, // short slug ("blazeinferno64"), as opposed to the full permalinkUrl below
            permalinkUrl: user.permalink_url,
            description: user.description || null,

            kind: user.kind || null, // should always be "user" for a profile, but included for completeness

            location: {
                city: user.city || null,
                country: user.country_code || null
            },

            avatarUrl: user.avatar_url?.replace("-large.jpg", "-t500x500.jpg"),
            headerUrl,

            // Pro/Pro Unlimited/verified badges - shown next to the username on the real profile page
            badges: {
                verified: !!user.badges?.verified,
                pro: !!user.badges?.pro,
                proUnlimited: !!user.badges?.pro_unlimited
            },

            subscriptions: {
                creatorSubscriptions: user.creator_subscriptions.products || [], // array of subscription product IDs the user is subscribed to (e.g. "creator_subscription:premium")
                // The `creator_subscription` field is a newer addition to SoundCloud's subscription model, allowing users to support specific creators directly. The `product.id` can be used to identify the specific subscription product.
                creatorSubscription: user.creator_subscription.product?.id,
            },

            // External links from the profile's "Links" section (personal site, Instagram, Twitter/X, etc.)
            webProfiles: (user.web_profiles || []).map(link => ({
                network: link.network,
                title: link.title || null,
                url: link.url
            })),

            // A user's "station" is what SoundCloud autoplays after their tracks finish (their own radio mix) -
            // both fields are internal identifiers, not directly a browsable page URL.
            station: {
                urn: user.station_urn || null,
                permalink: user.station_permalink || null
            },

            // Stats you'd see laid out on the profile page itself
            stats: {
                followers: user.followers_count,
                following: user.followings_count,
                tracks: user.track_count,
                playlists: user.playlist_count,
                playlistLikes: user.playlist_likes_count,
                likes: user.public_favorites_count ?? user.likes_count,
                reposts: user.reposts_count,
                comments: user.comments_count,
                groups: user.groups_count,
                dateOfBirth: user.date_of_birth || null,
                // Note: SoundCloud doesn't provide a "total plays" stat for a user profile, only per-track plays.
            },

            createdAt: user.created_at,
            lastModified: user.last_modified || null // last time this profile's data changed on SoundCloud's end
        };

        return profileData;
    } catch (e) {
        throw new Error("Failed to fetch profile!");
    }
}

module.exports = {
    fetchProfile
}