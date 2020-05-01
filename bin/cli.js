#!/usr/bin/env node
"use strict";

const fs = require("fs");

const database = require("./../database.json");
const app = require("./app.js");
const todoParser = require("./../src/utils/TodoParser.js");


// Start provided args
const [,, ...args] = process.argv;
app.main(args, database, fs, new todoParser.TodoParser());