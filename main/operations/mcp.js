const Express = require("express");
const express = Express();
const fs = require("fs")
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });



module.exports = express