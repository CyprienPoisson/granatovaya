const functions = require('firebase-functions');
const updateContent = require("./update-content");

exports.updateSite = updateContent.updateNews;
