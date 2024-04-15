const fs = require('fs');

module.exports = (req, res, queryRvn, rvn, commandRevision, next) => {
    let MultiUpdate = [];
    let ApplyProfileChanges = [];
    let BaseRevision;
    let QueryRevision = req.query.rvn || -1;
    let profile; 

    if (!req.query.profileId) {
        return res.status(404).end() 
    }

    fs.readdirSync("./local/athena").forEach((file) => {
        if (file.endsWith(".json")) {
            profile = require(`../../../local/athena/${file}`);
            if (!profile.rvn) profile.rvn = 0;
            if (!profile.items) profile.items = {};
            if (!profile.stats) profile.stats = {};
            if (!profile.stats.attributes) profile.stats.attributes = {};
            if (!profile.commandRevision) profile.commandRevision = 0;

            fs.writeFileSync(`./local/athena/${file}`, JSON.stringify(profile, null, 2));
        }
    });

    BaseRevision = profile.rvn;
    
    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        multiUpdate: MultiUpdate,
        responseVersion: 1
    });
}