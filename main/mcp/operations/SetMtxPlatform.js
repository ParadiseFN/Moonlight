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