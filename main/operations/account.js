const Express = require("express")
const express = Express();
const log = require("../utils/base/log.js")
const fs = require("fs");
const path = require("path");

global.accessTokens = [];
global.refreshTokens = [];
global.clientTokens = [];

express.post("/datarouter/api/v1/public/data", async (req, res) => {
    res.status(204).end();
});

express.get("/account/api/public/account/*/externalAuths", async (req, res) => {
    res.json([]);
});

express.delete("/account/api/oauth/sessions/kill/*", async (req, res) => {
    res.status(204).end();
});

express.get("/account/api/public/account/:accountId", async (req, res) => {
    res.json({
        id: "moonlighttest1",
        displayName: "penis",
        name: "penis",
        email: "penis" + "@anthonymahogany.com",
        failedLoginAttempts: 0,
        lastLogin: new Date().toISOString(),
        numberOfDisplayNameChanges: 0,
        ageGroup: "UNKNOWN",
        headless: false,
        country: "US",
        lastName: "Server",
        preferredLanguage: "en",
        canUpdateDisplayName: false,
        tfaEnabled: false,
        emailVerified: true,
        minorVerified: false,
        minorExpected: false,
        minorStatus: "NOT_MINOR",
        cabinedMode: false,
        hasHashedEmail: false
    });
});

express.post("/account/api/oauth/token", async(req, res) => {
        res.json({
            "access_token": "tivaishot",
            "expires_in": 28800,
            "expires_at": "9999-12-02T01:12:01.100Z",
            "token_type": "bearer",
            "refresh_token": "tivaishot",
            "refresh_expires": 86400,
            "refresh_expires_at": "9999-12-02T01:12:01.100Z",
            "account_id": "moonlighttest1",
            "client_id": "clientId",
            "internal_client": true,
            "client_service": "fortnite",
            "displayName": "penis",
            "app": "fortnite",
            "in_app_id": "moonlighttest1",
            "device_id": "deviceId",
        });
});

module.exports = express;