const fs = require('fs');

module.exports = (req, res, queryRvn, rvn, commandRevision, next) => {
    if (!req.query.profileId && req.originalUrl.toLowerCase().startsWith("/fortnite/api/game/v2/profile/")) {
        return res.status(404).json({
            error: "Profile not defined."
        });
    }

    fs.readdirSync("../../local/athena").forEach((file) => {
        if (file.endsWith(".json")) {

            const profile = require(`../../local/athena/${file}`);
            if (!profile.rvn) profile.rvn = 0;
            if (!profile.items) profile.items = {}
            if (!profile.stats) profile.stats = {}
            if (!profile.stats.attributes) profile.stats.attributes = {}
            if (!profile.commandRevision) profile.commandRevision = 0;

            fs.writeFileSync("../../local/athena/profile_athenathena.json", JSON.stringify(profile, null, 2));
        }
    });


    if (typeof next === 'function') {
        return next();
    }
};
