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

express.get("/fortnite/api/cloudstorage/user/:accountId", async (req, res) => {
    res.json([]);
});

module.exports = express