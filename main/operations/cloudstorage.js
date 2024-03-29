const Express = require("express")
const express = Express();
const log = require("../utils/base/log.js")
const functions = require("../utils/functions/functions.js")
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
            hash: crypto.createHash('sha1').update(f).digest('hex'),
            hash256: crypto.createHash('sha256').update(f).digest('hex'),
            length: f.length,
            contentType: "application/octet-stream",
            uploaded: new Date().toISOString(),
            storageType: "S3",
            storageIds: {},
            doNotCache: true,
        });
    };
    res.json(csFiles);
});

express.get("/fortnite/api/cloudstorage/system/config", async (req, res) => {
    var csFiles = [];
    for (var file of fs.readdirSync("local/resources/hotfixes")) {
        var f = fs.readFileSync("././local/resources/hotfixes/" + file).toString();
        csFiles.push({
            uniqueFilename: file,
            filename: file,
            hash: crypto.createHash('sha1').update(f).digest('hex'),
            hash256: crypto.createHash('sha256').update(f).digest('hex'),
            length: f.length,
            contentType: "application/octet-stream",
            uploaded: new Date().toISOString(),
            storageType: "S3",
            storageIds: {},
            doNotCache: true,
        });
    };
    res.json(csFiles);
});

express.get("/fortnite/api/cloudstorage/system/:file", async (req, res) =>{
    res.send(fs.readFileSync("././local/resources/hotfixes/" + req.params.file).toString());
});

express.use((req, res, next) => {
    if (req.originalUrl.toLowerCase().startsWith("/fortnite/api/cloudstorage/user/") && req.method === "PUT") {
        req.rawBody = "";
        req.setEncoding("latin1");
        req.on("data", (chunk) => req.rawBody += chunk);
        req.on("end", () => next());
    }
    else
        return next();
});

express.get("/fortnite/api/cloudstorage/user/:accountId", functions.getUser, async (req, res) => {
    let clientSettingsPath = path.join(__dirname, "..", "ClientSettings", req.user.accountId);
    if (!fs.existsSync(clientSettingsPath)) fs.mkdirSync(clientSettingsPath);

    const ver = functions.getVersion(req);
    
    let file = path.join(clientSettingsPath, `ClientSettings-${ver.season}.Sav`);

    if (fs.existsSync(file)) {
        const ParsedFile = fs.readFileSync(file, 'latin1');
        const ParsedStats = fs.statSync(file);

        return res.json([{
            "uniqueFilename": "ClientSettings.Sav",
            "filename": "ClientSettings.Sav",
            "hash": crypto.createHash('sha1').update(ParsedFile).digest('hex'),
            "hash256": crypto.createHash('sha256').update(ParsedFile).digest('hex'),
            "length": Buffer.byteLength(ParsedFile),
            "contentType": "application/octet-stream",
            "uploaded": ParsedStats.mtime,
            "storageType": "S3",
            "storageIds": {},
            "accountId": req.user.accountId,
            "doNotCache": false
        }]);
    }
    
    res.json([]);
});

module.exports = express