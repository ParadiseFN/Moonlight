const Express = require("express");
const express = Express();
const fs = require("fs")
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });

express.get("/launcher/api/public/assets/*", async (req, res) => {
    res.json({
        appName: "FortniteContentBuilds",
        labelName: "Moonlight",
        buildVersion: "++Fortnite+Release-20.00-CL-19458861-Windows",
        catalogItemId: "5cb97847cee34581afdbc445400e2f77",
        expires: "9999-12-31T23:59:59.999Z",
        items: {
            MANIFEST: {
                signature: "Moonlight",
                distribution: "https://Moonlight.ol.epicgames.com/",
                path: "Builds/Fortnite/Content/CloudDir/Moonlight.manifest",
                hash: "55bb954f5596cadbe03693e1c06ca73368d427f3",
                additionalDistributions: []
            },
            CHUNKS: {
                signature: "Moonlight",
                distribution: "https://Moonlight.ol.epicgames.com/",
                path: "Builds/Fortnite/Content/CloudDir/Moonlight.manifest",
                additionalDistributions: []
            }
        },
        assetId: "FortniteContentBuilds"
    });
});

express.get("/Builds/Fortnite/Content/CloudDir/*.manifest", async (req, res) => {
    res.set("Content-Type", "application/octet-stream")
    const manifest = fs.readFileSync(path.join(__dirname, ".", "..", "..", "local", "resources", "cd", "Moonlight.manifest"));
    res.status(200).send(manifest).end();
});

express.get("/Builds/Fortnite/Content/CloudDir/*.ini", async (req, res) => {
    const ini = fs.readFileSync(path.join(__dirname, ".", "..", "..", "local", "resources", "cd", "stuff.ini"));
    res.status(200).send(ini).end();
});

express.get("/launcher/api/public/distributionpoints/", (req, res) => {
    res.json({
        distributions: [
            "https://download.epicgames.com/",
            "https://download2.epicgames.com/",
            "https://download3.epicgames.com/",
            "https://download4.epicgames.com/",
            "https://epicgames-download1.akamaized.net/",
            "https://itztiva.com/Moonlight/"
        ]
    });
});

module.exports = express;