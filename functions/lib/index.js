"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
const serve_content_1 = require("./serve-content");
const app = express();
app.get('/toutes-nos-actualites.html', serve_content_1.default.newsIndex);
app.get('/actualites/:id/:slug', serve_content_1.default.newsPage);
app.get('/offres-emploi.html', serve_content_1.default.jobsIndex);
app.get('/offres-emploi/:id/:slug', serve_content_1.default.jobPage);
exports.content = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map