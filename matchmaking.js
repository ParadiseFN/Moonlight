require("dotenv").config();
const Express = require("express");
const express = Express();
const user = {};
const fs = require("fs");
const functions = require("./../utils/functions/functions.js");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });

express.get("/fortnite/api/matchmaking/session/findPlayer/*", async (req, res) => {
    res
        .status(200)
        .end();
});

express.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/:accountId", async (req, res) => {
    const ver = functions.getVersion
    console.log(req.params.accountId)
        const bucketId = req.query.bucketId;
        const playerMatchmakingKey = req.query["player.option.customKey"];
        const playerPlaylist = bucketId.split(":")[3];
        const playerRegion = bucketId.split(":")[2];

        user[req.params.accountId] = { bucketId, playerRegion, playerPlaylist };

        const mmData = jwt.sign({
            region: playerRegion,
            playlist: playerPlaylist,
            type: typeof playerMatchmakingKey === "string" ? "custom" : "normal",
            key: typeof playerMatchmakingKey === "string" ? playerMatchmakingKey : undefined,
            bucket: bucketId,
            version: `${ver.build}`
        }, "LVe51Izk03lzceNf1ZGZs0glGx5tKh7f");

        var matchmakerIP = process.env.MATCHMAKER_IP;
        var data = mmData.split(".");

        return res.json({
            serviceUrl: `${process.env.MATCHMAKER_Secure == "true" ? "wss" : "ws"}://${process.env.MATCHMAKER_IP}`,
            ticketType: "nebulon",
            payload: data[0] + "." + data[1],
            signature: data[2],
        });
});


express.get("/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId", async (req, res) => {
    res.json({
        accountId: req.params.accountId,
        sessionId: req.params.sessionId,
        key: "none"
    });
});

express.post("/fortnite/api/matchmaking/session/*/join", async (req, res) => {
    res
        .status(204)
        .end();
});

express.post("/fortnite/api/matchmaking/session/matchMakingRequest", async (req, res) => {
    let serverAddress;
    let serverPort;
    res.json({
        id: req.params.sessionId,
        ownerId: functions.MakeID().replace(/-/gi, ""),
        ownerName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
        serverName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
        serverAddress: serverAddress,
        serverPort: serverPort,
        maxPublicPlayers: 220,
        openPublicPlayers: 175,
        maxPrivatePlayers: 0,
        openPrivatePlayers: 0,
        "attributes": {
            REGION_s: "NAE",
            GAMEMODE_s: "FORTATHENA",
            ALLOWBROADCASTING_b: true,
            SUBREGION_s: "NAE",
            DCID_s: "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
            tenant_s: "Fortnite",
            MATCHMAKINGPOOL_s: "Any",
            STORMSHIELDDEFENSETYPE_i: 0,
            HOTFIXVERSION_i: 0,
            PLAYLISTNAME_s: req.playlist,
            SESSIONKEY_s: functions.MakeID().replace(/-/gi, "").toUpperCase(),
            TENANT_s: "Fortnite",
            BEACONPORT_i: 15009
        },
        "publicPlayers": [],
        "privatePlayers": [],
        "totalPlayers": 45,
        "allowJoinInProgress": true,
        "shouldAdvertise": true,
        "isDedicated": true,
        "usesStats": true,
        "allowInvites": true,
        "usesPresence": true,
        "allowJoinViaPresence": false,
        "allowJoinViaPresenceFriendsOnly": false,
        "lastUpdated": new Date().toISOString(),
        "started": false
    });
});

express.get("/fortnite/api/matchmaking/session/:sessionId", functions.getUser, async (req, res) => {
    let serverAddress;
    let serverPort;
    try {
        let response = await axios.get(
            `${process.env.MATCHMAKER_Secure == "true" ? "https" : "http"}://${process.env.MATCHMAKER_IP}/session/${req.params.sessionId}`
        );
        serverAddress = response.data.ip; 
        serverPort = response.data.port;
            
        if (!user[req.user.accountId]) {
            return functions.createError("errors.Solara.common.matchmaking.user.not_found", `User data for account ID "${req.user.accountId}" was not found`, [], 1013, "invalid_user", 404, res);
        }

    } catch (e) {
        console.log(e);
        //return functions.createError("errors.com.epicgames.common.matchmaking.session.not_found", `The matchmaking session "${req.params.sessionId}" was not found`, [], 1013, "invalid_session", 404, res);
    }
    res.json({
        id: req.params.sessionId,
        ownerId: functions.MakeID().replace(/-/gi, ""),
        ownerName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
        serverName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
        serverAddress: serverAddress,
        serverPort: serverPort,
        maxPublicPlayers: 220,
        openPublicPlayers: 175,
        maxPrivatePlayers: 0,
        openPrivatePlayers: 0,
        "attributes": {
            REGION_s: user[req.user.accountId].playerRegion,
            GAMEMODE_s: "FORTATHENA",
            ALLOWBROADCASTING_b: true,
            SUBREGION_s: user[req.user.accountId].playerRegion == "NAE" ? "VA": "GB",
            DCID_s: "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
            tenant_s: "Fortnite",
            MATCHMAKINGPOOL_s: "Any",
            STORMSHIELDDEFENSETYPE_i: 0,
            HOTFIXVERSION_i: 0,
            PLAYLISTNAME_s: user[req.user.accountId].playerPlaylist,
            SESSIONKEY_s: functions.MakeID().replace(/-/gi, "").toUpperCase(),
            TENANT_s: "Fortnite",
            BEACONPORT_i: 15009
        },
        "publicPlayers": [],
        "privatePlayers": [],
        "totalPlayers": 45,
        "allowJoinInProgress": true,
        "shouldAdvertise": true,
        "isDedicated": true,
        "usesStats": true,
        "allowInvites": true,
        "usesPresence": true,
        "allowJoinViaPresence": false,
        "allowJoinViaPresenceFriendsOnly": false,
        "buildUniqueId": user[req.user.accountId].bucketId.split(":")[0],
        "lastUpdated": new Date().toISOString(),
        "started": false
    });
});

module.exports = express;