const Express = require("express")
const express = Express();
const log = require("../utils/base/log.js")
const functions = require("../utils/functions/functions.js")
const fs = require("fs");
const path = require("path");

const keychain = require("../../local/resources/keychain.json")

const catalog = require("../../local/resources/catalog.json")


express.get("/fortnite/api/storefront/v2/keychain", async (req, res) => {
    res.json(keychain)
});

express.get("/fortnite/api/storefront/v2/catalog", async (req, res) => {
    res.json(catalog)
});

module.exports = express