const Express = require("express");
const express = Express();
const log = require("../utils/base/log.js");
const functions = require("../utils/functions/functions.js");
const fs = require("fs");
const path = require("path");

express.get("/content/api/pages/fortnite-game", async (req, res) => {
  const c = functions.contentpages(req);
  res.json(c);
});

module.exports = express;
