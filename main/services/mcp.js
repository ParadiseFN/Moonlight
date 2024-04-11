const Express = require("express");
const express = Express();
const fs = require("fs");
const path = require("path");
const functions = require("../utils/functions/functions.js")
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });
const userpath = new Set();

express.post("/fortnite/api/game/v2/profile/*/client/:operation", functions.getUser, async (req, res, next) => {
    let MultiUpdate = [];
    let ApplyProfileChanges = [];
    let BaseRevision = 0; 
    let profile;

    if (!req.query.profileId) {
        return res.status(404).end();
    }

    const profileId = req.query.profileId;

    if (userpath.has(profileId)) {
        return res.status(203).json({ message: "this has been done before ig" });
    }

    const files = fs.readdirSync("local/athena");
    files.forEach((file) => {
        console.log("Processing file:", file);
        if (file.endsWith(".json")) {
            profile = require(`../../local/athena/${file}`);
            if (!profile.rvn) profile.rvn = 0;
            if (!profile.items) profile.items = {};
            if (!profile.stats) profile.stats = {};
            if (!profile.stats.attributes) profile.stats.attributes = {};
            if (!profile.commandRevision) profile.commandRevision = 0;

            fs.writeFileSync(`./local/profiles/${file}`, JSON.stringify(profile, null, 2));
        }
    });

    BaseRevision = profile ? profile.rvn : 0;

    switch (req.params.operation) {
        case "QueryProfile": 
            console.log("QueryProfile op");
            break;
        case "SetMtxPlatform": 
            break;
        default:
            console.log("Invalid operation:", req.params.operation);
            return res.status(400).json({ error: "Invalid op" });
    }
    
    res.json({
        profileRevision: profile ? profile.rvn || 0 : 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile ? profile.commandRevision || 0 : 0,
        serverTime: new Date().toISOString(),
        multiUpdate: MultiUpdate,
        responseVersion: 1
    });

    userpath.add(profileId);
});

// love to lawin 
// TODO: Recode not in school lol

express.post("/fortnite/api/game/v2/profile/*/client/EquipBattleRoyaleCustomization", async (req, res) => {
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;
    var VariantChanged = false;

    try {
        const ReturnVariantsAsString = JSON.stringify(req.body.variantUpdates || [])

        if (ReturnVariantsAsString.includes("active")) {
            if (profile.items[req.body.itemToSlot].attributes.variants.length == 0) {
                profile.items[req.body.itemToSlot].attributes.variants = req.body.variantUpdates || [];
            }
			
            for (var i in profile.items[req.body.itemToSlot].attributes.variants) {
                try {
                    if (profile.items[req.body.itemToSlot].attributes.variants[i].channel.toLowerCase() == req.body.variantUpdates[i].channel.toLowerCase()) {
                        profile.items[req.body.itemToSlot].attributes.variants[i].active = req.body.variantUpdates[i].active || "";
                    }
                } catch (err) {}
            }
			
            VariantChanged = true;
        }
    } catch (err) {}

    if (req.body.slotName) {

        switch (req.body.slotName) {

            case "Character":
                profile.stats.attributes.favorite_character = req.body.itemToSlot || "";
                StatChanged = true;
                break;

            case "Backpack":
                profile.stats.attributes.favorite_backpack = req.body.itemToSlot || "";
                StatChanged = true;
                break;

            case "Pickaxe":
                profile.stats.attributes.favorite_pickaxe = req.body.itemToSlot || "";
                StatChanged = true;
                break;

            case "Glider":
                profile.stats.attributes.favorite_glider = req.body.itemToSlot || "";
                StatChanged = true;
                break;

            case "SkyDiveContrail":
                profile.stats.attributes.favorite_skydivecontrail = req.body.itemToSlot || "";
                StatChanged = true;
                break;

            case "MusicPack":
                profile.stats.attributes.favorite_musicpack = req.body.itemToSlot || "";
                StatChanged = true;
                break;

            case "LoadingScreen":
                profile.stats.attributes.favorite_loadingscreen = req.body.itemToSlot || "";
                StatChanged = true;
                break;

            case "Dance":
                var indexwithinslot = req.body.indexWithinSlot || 0;

                if (Math.sign(indexwithinslot) == 1 || Math.sign(indexwithinslot) == 0) {
                    profile.stats.attributes.favorite_dance[indexwithinslot] = req.body.itemToSlot || "";
                }

                StatChanged = true;
                break;

            case "ItemWrap":
                var indexwithinslot = req.body.indexWithinSlot || 0;

                switch (Math.sign(indexwithinslot)) {

                    case 0:
                        profile.stats.attributes.favorite_itemwraps[indexwithinslot] = req.body.itemToSlot || "";
                        break;

                    case 1:
                        profile.stats.attributes.favorite_itemwraps[indexwithinslot] = req.body.itemToSlot || "";
                        break;

                    case -1:
                        for (var i = 0; i < 7; i++) {
                            profile.stats.attributes.favorite_itemwraps[i] = req.body.itemToSlot || "";
                        }
                        break;

                }

                StatChanged = true;
                break;

        }

    }

    if (StatChanged == true) {
        var Category = (`favorite_${req.body.slotName || "character"}`).toLowerCase()

        if (Category == "favorite_itemwrap") {
            Category += "s"
        }

        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": Category,
            "value": profile.stats.attributes[Category]
        })

        if (VariantChanged == true) {
            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": req.body.itemToSlot,
                "attributeName": "variants",
                "attributeValue": profile.items[req.body.itemToSlot].attributes.variants
            })
        }
        fs.writeFileSync("./local/athena/profile_athena.json", JSON.stringify(profile, null, 2));
    }

    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn,
        "profileId": "athena",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
});

module.exports = express;