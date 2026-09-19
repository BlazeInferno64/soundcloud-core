// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 19/09/2026

const net = require("net");

//const cheerio = require("cheerio");

const validateIp = (ip) => {
    if (net.isIP(ip) === 0) { // 0 = invalid, 4 / 6 = valid
        const err = new Error(`${JSON.stringify(ip)} isn't a valid IPv4 or IPv6 address!`);
        err.name = "IP_Validation_Error";
        err.input = ip;
        throw err;
    }
    return true;
};


module.exports = {
    validateIp
}