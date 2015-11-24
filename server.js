var express = require("express");
var app = express();
var path = require('path');
var cors = require("cors");
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname));

app.listen(3001);

module.exports = app;

console.log('Server started on http://localhost:3001');