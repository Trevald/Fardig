#!/usr/bin/env node
"use strict";


const database = require("./../database.json");
const app = require("./app.js");

// Start provided args
const [,, ...args] = process.argv;
app.main(args, database);