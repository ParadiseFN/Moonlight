const Express = require("express");
const express = Express();
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "config", ".env") });

express.post("/fortnite/api/game/v2/grant_access/*", async (req, res) => {
  res.json({});
  res.status(204);
});

express.get("/fortnite/api/game/v2/enabled_features", async (req, res) => {
  res.json({});
});

express.post(
  "/fortnite/api/game/v2/tryPlayOnPlatform/account/*",
  async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(true);
  }
);

express.get("/fortnite/api/v2/versioncheck/*", async (req, res) => {
  res.json({
    type: "NO_UPDATE",
  });
});

express.get("/fortnite/api/v2/versioncheck*", async (req, res) => {
  res.json({
    type: "NO_UPDATE",
  });
});

express.get("/fortnite/api/versioncheck*", async (req, res) => {
  res.json({
    type: "NO_UPDATE",
  });
});

express.post("/api/v1/user/setting", async (req, res) => {
  res.json({});
});

express.get(
  "/fortnite/api/receipts/v1/account/*/receipts",
  async (req, res) => {
    res.json([]);
  }
);

express.get(
  "/account/api/public/account/:accountId/externalAuths",
  async (req, res) => {
    res.status(204);
    res.json({});
  }
);

express.post(
  "/fortnite/api/game/v2/tryPlayOnPlatform/account/*",
  async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(true);
  }
);

module.exports = express;
