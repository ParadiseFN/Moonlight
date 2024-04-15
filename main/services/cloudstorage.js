const Express = require("express");
const express = Express();
const log = require("../utils/base/log.js");
const functions = require("../utils/functions/functions.js");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

express.get("/fortnite/api/cloudstorage/system", async (req, res) => {
  var csFiles = [];
  for (var file of fs.readdirSync("local/resources/hotfixes")) {
    var f = fs.readFileSync("././local/resources/hotfixes/" + file).toString();
    csFiles.push({
      uniqueFilename: file,
      filename: file,
      hash: crypto.createHash("sha1").update(f).digest("hex"),
      hash256: crypto.createHash("sha256").update(f).digest("hex"),
      length: f.length,
      contentType: "application/octet-stream",
      uploaded: new Date().toISOString(),
      storageType: "S3",
      storageIds: {},
      doNotCache: true,
    });
  }
  res.json(csFiles);
});

express.get("/fortnite/api/cloudstorage/system/config", async (req, res) => {
  var csFiles = [];
  for (var file of fs.readdirSync("local/resources/hotfixes")) {
    var f = fs.readFileSync("././local/resources/hotfixes/" + file).toString();
    csFiles.push({
      uniqueFilename: file,
      filename: file,
      hash: crypto.createHash("sha1").update(f).digest("hex"),
      hash256: crypto.createHash("sha256").update(f).digest("hex"),
      length: f.length,
      contentType: "application/octet-stream",
      uploaded: new Date().toISOString(),
      storageType: "S3",
      storageIds: {},
      doNotCache: true,
    });
  }
  res.json(csFiles);
});

express.get("/fortnite/api/cloudstorage/system/:file", async (req, res) => {
  res.send(
    fs
      .readFileSync("././local/resources/hotfixes/" + req.params.file)
      .toString()
  );
});

express.use((req, res, next) => {
  if (
    req.originalUrl
      .toLowerCase()
      .startsWith("/fortnite/api/cloudstorage/user/") &&
    req.method === "PUT"
  ) {
    req.rawBody = "";
    req.setEncoding("latin1");
    req.on("data", (chunk) => (req.rawBody += chunk));
    req.on("end", () => next());
  } else return next();
});

express.get("/fortnite/api/cloudstorage/user/:accountId", async (req, res) => {
  res.json([]);
});

express.put(
  "/fortnite/api/cloudstorage/user/:accountId/:file",
  functions.getUser,
  async (req, res) => {
    if (req.params.file.includes("..")) return res.status(400).end();
    if (Buffer.byteLength(req.rawBody) >= 400000)
      return res
        .status(403)
        .json({ error: "File size must be less than 400kb." });

    let clientSettingsPath = path.join(
      __dirname,
      "..",
      "..",
      "local",
      "ClientSettings",
      req.params.accountId
    );
    if (!fs.existsSync(clientSettingsPath)) fs.mkdirSync(clientSettingsPath);

    if (req.params.file.toLowerCase() != "clientsettings.sav")
      return res.status(204).end();

    const ver = functions.getVersion(req);

    let file = path.join(
      clientSettingsPath,
      `ClientSettings-${ver.season}.Sav`
    );
    fs.writeFileSync(file, req.rawBody, "latin1");

    res.status(204).end();
  }
);

express.get(
  "/fortnite/api/cloudstorage/user/:accountId/:file",
  functions.getUser,
  async (req, res) => {
    let clientSettingsPath = path.join(
      __dirname,
      "..",
      "..",
      "local",
      "ClientSettings",
      req.params.accountId
    );
    if (!fs.existsSync(clientSettingsPath)) fs.mkdirSync(clientSettingsPath);

    if (req.params.file.toLowerCase() != "clientsettings.sav")
      return res.status(204).end();

    const ver = functions.getVersion(req);

    let file = path.join(
      clientSettingsPath,
      `ClientSettings-${ver.season}.Sav`
    );
    if (fs.existsSync(file)) return res.status(200).send(fs.readFileSync(file));

    res.status(200).end();
  }
);

express.get(
  "/fortnite/api/cloudstorage/user/:accountId",
  functions.getUser,
  async (req, res) => {
    let clientSettingsPath = path.join(
      __dirname,
      "..",
      "..",
      "local",
      "ClientSettings",
      req.params.accountId
    );
    if (!fs.existsSync(clientSettingsPath)) fs.mkdirSync(clientSettingsPath);

    const ver = functions.getVersion(req);

    let file = path.join(
      clientSettingsPath,
      `ClientSettings-${ver.season}.Sav`
    );

    if (fs.existsSync(file)) {
      const ParsedFile = fs.readFileSync(file, "latin1");
      const ParsedStats = fs.statSync(file);

      return res.json([
        {
          uniqueFilename: "ClientSettings.Sav",
          filename: "ClientSettings.Sav",
          hash: crypto.createHash("sha1").update(ParsedFile).digest("hex"),
          hash256: crypto.createHash("sha256").update(ParsedFile).digest("hex"),
          length: Buffer.byteLength(ParsedFile),
          contentType: "application/octet-stream",
          uploaded: ParsedStats.mtime,
          storageType: "S3",
          storageIds: {},
          accountId: req.params.accountId,
          doNotCache: false,
        },
      ]);
    }

    res.json([]);
  }
);

module.exports = express;
