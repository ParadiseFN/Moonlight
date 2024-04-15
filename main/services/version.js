const Express = require("express");
const express = Express();

express.get("/fortnite/api/v2/versioncheck/*", async (req, res) => {
  res.json({
    type: "NO_UPDATE",
  });
});

module.exports = express;
