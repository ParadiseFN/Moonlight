const Express = require("express");
const express = Express();
const fs = require("fs")
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });

express.post("/fortnite/api/game/v2/grant_access/*", async (req, res) => {
    res.json({});
    res.status(204);
});

express.get("/fortnite/api/game/v2/enabled_features", async (req, res) => {
    res.json({});
});

module.exports = express