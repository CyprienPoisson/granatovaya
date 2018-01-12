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
const fs = require("fs");
const handlebars_1 = require("handlebars");
const subsidiaryLogos = {
    "Akela Interim": "akela.jpg",
    "Axel Duval": "axel_duval.jpg",
    "Axel Sud": "axel_sud.jpg",
    "Brein Transports": "brein_transports.jpg",
    "Groupe Poisson": "groupe_poisson.jpg",
    "Marcel Equipment": "logo-marcel-equipment-limited.jpg",
    "Maintenance Service": "maintenance_service.jpg",
    "Morel": "morel.jpg",
    "Poisson Formation": "poisson_formation.jpg",
    "Select Civil": "select_civil.jpg",
    "SNDM": "sndm.jpg",
    "Terre-durable": "terre_durable.jpg",
    "Terre-net": "terre_net.jpg",
};
const firebaseConfig = functions.config().firebase;
firebaseConfig.databaseAuthVariableOverride = {
    uid: "update-service",
};
const firebaseServeContentApp = admin.initializeApp(firebaseConfig, 'serve-content');
const db = firebaseServeContentApp.database();
function newsIndex(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newsRef = db.ref(`content/news`);
        const snapshot = yield newsRef.once('value');
        let newsList = snapshot.val();
        newsList = Object.keys(newsList).map(k => newsList[k])
            .sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                return a.createdAt - b.createdAt;
            }
            else if (a.createdAt && !b.createdAt) {
                return 1;
            }
            else if (!a.createdAt && b.createdAt) {
                return -1;
            }
            else if (!a.createdAt && !b.createdAt) {
                return a.id - b.id;
            }
            return 0;
        })
            .reverse();
        const rawPage = fs.readFileSync("./pages/toutes-nos-actualites.html").toString();
        const templateString = fs.readFileSync("./templates/news-list.hbs").toString();
        handlebars_1.default.registerHelper('subsidiaryLogo', function (subsidiary) {
            return subsidiaryLogos[subsidiary];
        });
        const templateFunction = handlebars_1.default.compile(templateString);
        const newsListHTML = templateFunction({ newsList });
        const result = rawPage.replace('NEWS_LIST', newsListHTML);
        res.send(result);
    });
}
function newsPage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newsId = req.params.id;
        const newsRef = db.ref(`content/news/${newsId}`);
        const snapshot = yield newsRef.once('value');
        const news = snapshot.val();
        const rawPage = fs.readFileSync("./pages/actualite.html").toString();
        const templateString = fs.readFileSync("./templates/news-page.hbs").toString();
        handlebars_1.default.registerHelper('subsidiaryLogo', function (subsidiary) {
            return subsidiaryLogos[subsidiary];
        });
        const templateFunction = handlebars_1.default.compile(templateString);
        const newsHTML = templateFunction({ news });
        const result = rawPage.replace('NEWS_CONTENT', newsHTML);
        res.send(result);
        res.send(req.params.id);
    });
}
exports.default = {
    newsIndex,
    newsPage
};
//# sourceMappingURL=serve-content.js.map