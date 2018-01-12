"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cheerio = require("cheerio");
// import slugger from './slugger';
const firebaseConfig = functions.config().firebase;
const firebaseAdminApp = admin.initializeApp(firebaseConfig, 'admin');
const db = firebaseAdminApp.database();
function buildNewsExcerpts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const snapshot = yield db.ref(`content/news`).once('value');
        const newsList = snapshot.val();
        for (const id in newsList) {
            const news = newsList[id];
            const $ = cheerio.load(news.content);
            const excerpt = $('*')
                .contents()
                .map((i, e) => e.type === 'text' ? $(e).text() : '')
                .get()
                .join(' ')
                .slice(0, 500)
                .trim()
                .replace(/\s+/gi, ' ');
            // db.ref(`content/news/${id}/excerpt`).set(excerpt);
            console.log(excerpt);
        }
        res.send('OK');
    });
}
exports.default = {
    buildNewsExcerpts,
};
//# sourceMappingURL=admin.js.map