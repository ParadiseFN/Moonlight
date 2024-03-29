const Express = require("express")
const express = Express();
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });

const port = process.env.PORT

express.get("/", async (req, res) => {
    res.json({
        message: "Moonlight is running!"
    });
});

express.listen(port, () => {
    console.log(`Moonlight started on Port ${port}`)
})
