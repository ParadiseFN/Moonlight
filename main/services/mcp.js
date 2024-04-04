const Express = require("express");
const express = Express();
const fs = require("fs");
const path = require("path");
const functions = require("../utils/functions/functions.js")
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });

/*express.get("/fortnite/api/game/v2/profile/* /client/:op", async (req, res) => {
    var profile = fs.readFileSync(`E:/github/yap/Moonlight/local/athena/profile_${req.query.profileId}`);
    return await require(`../mcp/operations/${req.params.op}`)(req, res, profile, req.query.rvn, profile.rvn, profile.commandRevision);
}); */


express.post("/fortnite/api/game/v2/profile/*/client/QueryProfile", functions.getUser, async (req, res, next) => {
    if (!req.query.profileId) {
        return res.status(404).end() 
    }

    fs.readdirSync("./local/athena").forEach((file) => {
        if (file.endsWith(".json")) {
            const profile = require(`E:/github/yap/Moonlight/local/athena/${file}`);
            if (!profile.rvn) profile.rvn = 0;
            if (!profile.items) profile.items = {};
            if (!profile.stats) profile.stats = {};
            if (!profile.stats.attributes) profile.stats.attributes = {};
            if (!profile.commandRevision) profile.commandRevision = 0;

            fs.writeFileSync(`./local/athena/${file}`, JSON.stringify(profile, null, 2));
        }
    });

    // u also need to return an MCP return btw

});


module.exports = express;
