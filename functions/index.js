const functions = require('firebase-functions');
const updateContent = require("./update-content");
const pages = require("./pages");

exports.updateSite = updateContent.updateNews;
exports.newsIndex = pages.newsIndex;
exports.news = pages.news;