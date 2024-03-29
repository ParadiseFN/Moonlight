const Express = require("express")
const express = Express();
const log = require("../utils/base/log.js")
const fs = require("fs");
const path = require("path");

express.post("/datarouter/api/v1/public/data", async (req, res) => {
    res.status(204).end();
});

module.exports = express;