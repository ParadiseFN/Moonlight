const Express = require("express");
const express = Express();
const fs = require("fs");
const path = require("path");
const functions = require("../utils/functions/functions.js")
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });

 express.post("/fortnite/api/game/v2/profile/*/client/:operation", functions.getUser, async (req, res, next) => {
    let MultiUpdate = [];
    let ApplyProfileChanges = [];
    let BaseRevision;
    let QueryRevision = req.query.rvn || -1;
    let profile; 

    if (!req.query.profileId) {
        return res.status(404).end() 
    }

    fs.readdirSync("./local/athena").forEach((file) => {
        if (file.endsWith(".json")) {
            profile = require(`E:/github/yap/Moonlight/local/athena/${file}`); 
            if (!profile.rvn) profile.rvn = 0;
            if (!profile.items) profile.items = {};
            if (!profile.stats) profile.stats = {};
            if (!profile.stats.attributes) profile.stats.attributes = {};
            if (!profile.commandRevision) profile.commandRevision = 0;

            fs.writeFileSync(`./local/athena/${file}`, JSON.stringify(profile, null, 2));
        }
    });

    BaseRevision = profile.rvn;

    switch (req.params.operation) {
        case "QueryProfile": break;
        case "SetMtxPlatform": break;
    }
    
    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        multiUpdate: MultiUpdate,
        responseVersion: 1
    });
}); 

module.exports = express;