const Express = require("express")
const express = Express();
const log = require("./utils/base/log.js")
const fs = require("fs");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });

const port = process.env.PORT

express.use((req, res, next) => {
    log.backend(`${req.method} ${req.originalUrl}`);
    next();
});

express.get("/", async (req, res) => {
    res.json({
        message: "Moonlight is running!"
    });
});

express.use(async (req, res, next) => {
    log.backend("Error on:" + req.path);
    const errorname = "error.Moonlight.common.not_found";
    const errorcode = 1004;
  
    res.set({
      'X-Epic-Error-Name': errorname,
      'X-Epic-Error-Code': errorcode
    });
  
    res.status(404);
    res.json({
      "errorCode": errorcode,
      "errorname": errorname,
      "errorMessage": "Not found.",
      "numericErrorCode": errorcode,
      "originatingService": "any",
      "intent": "prod"
    });
    res.end();
  });

fs.readdirSync("./main/operations").forEach(file => {
    const route = require(path.join(__dirname, "operations", file));
    express.use(route);
});

express.listen(port, () => {
    log.backend(`Moonlight started on Port ${port}`)
});


module.exports = express