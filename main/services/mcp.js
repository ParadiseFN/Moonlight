const Express = require("express");
const express = Express();
const fs = require("fs");
const path = require("path");
const functions = require("../utils/functions/functions.js");
const log = require("../utils/base/log.js");
require("dotenv").config({ path: path.resolve(__dirname, "config", ".env") });
const userpath = new Set();

const profilesDir = path.join(__dirname, "..", "..", "local", "profiles");

if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir);
}

express.post(
  "/fortnite/api/game/v2/profile/:accountId/client/:operation",
  functions.getUser,
  async (req, res, next) => {
    let MultiUpdate = [];
    let ApplyProfileChanges = [];
    let BaseRevision = 0;
    let profile;

    if (!req.query.profileId) {
      return res.status(404).end();
    }

    const profileId = req.query.profileId;

    // if (userpath.has(profileId)) {
    // return res.status(203).end();
    // }

    const files = fs.readdirSync("local/athena");
    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const profiles = require(`../../local/athena/${file}`);
        if (!profiles.rvn) profiles.rvn = 0;
        if (!profiles.items) profiles.items = {};
        if (!profiles.stats) profiles.stats = {};
        if (!profiles.stats.attributes) profiles.stats.attributes = {};
        if (!profiles.commandRevision) profiles.commandRevision = 0;

        const accountId = req.params.accountId;
        const profileDir = `./local/profiles/${accountId}`;
        const profilePath = path.join(profileDir, file);

        if (!fs.existsSync(profileDir)) {
          fs.mkdirSync(profileDir, { recursive: true });
        }

        if (!fs.existsSync(profilePath)) {
          fs.writeFileSync(profilePath, JSON.stringify(profiles, null, 2));
        }

        if (file === `profile_${profileId}.json`) {
          profile = fs.existsSync(profilePath)
            ? JSON.parse(fs.readFileSync(profilePath, "utf8"))
            : profiles;
        }
      }
    });

    BaseRevision = profile ? profile.rvn : 0;

    switch (req.params.operation) {
      case "QueryProfile":
        break;
      case "SetMtxPlatform":
        break;
      case "ClientQuestLogin":
        break;
      default:
        break;
    }

    ApplyProfileChanges.push({
      changeType: "fullProfileUpdate",
      profile: profile,
    });

    res.json({
      profileRevision: profile ? profile.rvn || 0 : 0,
      profileId: req.query.profileId,
      profileChangesBaseRevision: BaseRevision,
      profileChanges: ApplyProfileChanges,
      profileCommandRevision: profile ? profile.commandRevision || 0 : 0,
      serverTime: new Date().toISOString(),
      multiUpdate: MultiUpdate,
      responseVersion: 1,
    });

    userpath.add(profileId);
  }
);

module.exports = express;
