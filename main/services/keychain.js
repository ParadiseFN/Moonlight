const Express = require("express")
const express = Express();
const log = require("../utils/base/log.js")
const functions = require("../utils/functions/functions.js")
const fs = require("fs");
const path = require("path");


express.get("/fortnite/api/storefront/v2/keychain", async (req, res) => {
    res.json(JSON.parse(fs.readFileSync('../../local/resources/keychain.json', 'utf8')));
});

module.exports = express