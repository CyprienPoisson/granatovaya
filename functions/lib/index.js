"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
const admin_1 = require("./admin");
const appAdmin = express();
for (const k in admin_1.default) {
    appAdmin.get(`/${k}`, admin_1.default[k]);
}
exports.admin = functions.https.onRequest(appAdmin);
const update_web_content_1 = require("./update-web-content");
exports.updateWebContent = functions.https.onRequest(update_web_content_1.default);
const serve_content_1 = require("./serve-content");
const appContent = express();
appContent.get('/toutes-nos-actualites.html', serve_content_1.default.newsIndex);
appContent.get('/actualites/:id/:slug', serve_content_1.default.newsPage);
appContent.get('/offres-emploi.html', serve_content_1.default.jobsIndex);
appContent.get('/offres-emploi/:id/:slug', serve_content_1.default.jobPage);
appContent.get('/:language/toutes-nos-actualites.html', serve_content_1.default.newsIndex);
appContent.get('/:language/actualites/:id/:slug', serve_content_1.default.newsPage);
appContent.get('/:language/job-vacancies.html', serve_content_1.default.jobsIndex);
appContent.get('/:language/jobs/:id/:slug', serve_content_1.default.jobPage);
exports.content = functions.https.onRequest(appContent);
//# sourceMappingURL=index.js.map