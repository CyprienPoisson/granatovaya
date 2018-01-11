
exports.updateWebContent = require("./update-web-content").updateWebContent;

const pages = require("./pages");
exports.newsIndex = pages.newsIndex;
exports.news = pages.news;

const admin = require("./admin");
exports.process = admin.process;