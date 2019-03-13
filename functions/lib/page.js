"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function buildPage(pageName, language, replacements) {
    const pathPrefix = language === 'fr' ? '' : `${language}/`;
    let page = fs
        .readFileSync(`./pages/${pathPrefix}${pageName}.html`)
        .toString();
    for (const [text, regex] of replacements) {
        page = page.replace(regex, text);
    }
    return page;
}
exports.default = buildPage;
//# sourceMappingURL=page.js.map