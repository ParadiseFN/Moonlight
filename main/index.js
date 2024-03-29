const Express = require("express")
const express = Express();
const log = require("./utils/base/log.js")
const fs = require("fs");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });

const port = process.env.PORT

express.get("/", async (req, res) => {
    res.json({
        message: "Moonlight is running!"
    });
});

fs.readdirSync("./main/operations").forEach(file => {
    const route = require(path.join(__dirname, "operations", file));
    express.use(route);
});

express.listen(port, () => {
    log.backend(`Moonlight started on Port ${port}`)
});


module.exports = express