const Express = require("express");
const express = Express();
const fs = require("fs")
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });

express.get("/fortnite/api/game/v2/profile/*/client/:op", async (req, res) => {
    var profile = fs.readFileSync(`local/athena/profile_${req.query.profileId}`);
    return await require(`../mcp/operations/${req.params.op}`)(req, res, profile, req.query.rvn, profile.rvn, profile.commandRevision);
});

module.exports = express;