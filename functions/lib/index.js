"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
const serve_content_1 = require("./serve-content");
const app = express();
app.get('/toutes-nos-actualites.html', serve_content_1.default.newsIndex);
app.get('/actualites/:id/:slug', serve_content_1.default.newsPage);
exports.content = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map