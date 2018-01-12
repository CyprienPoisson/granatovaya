const functions = require('firebase-functions');
const express = require('express')

exports.updateWebContent = require("./update-web-content").updateWebContent;

const admin = require("./admin");
exports.process = admin.process;

const app = express();
const content = require("./pages");
app.get('/toutes-nos-actualites.html', content.newsIndex);
app.get('/actualites/:id/:slug', (req, res) => res.send(content.news(req, res)));

exports.content = functions.https.onRequest(app);