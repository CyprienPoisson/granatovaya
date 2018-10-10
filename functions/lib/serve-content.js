"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const fs = require("fs");
const handlebars_1 = require("handlebars");
const subsidiaryLogos = {
    'Akela Interim': 'akela.jpg',
    'Axel Duval': 'axel_duval.jpg',
    'Axel Sud': 'axel_sud.jpg',
    'Brein Transports': 'brein_transports.jpg',
    'Groupe Poisson': 'entite_groupepoisson.png',
    'Marcel Equipment': 'logo-marcel-equipment-limited.jpg',
    'Maintenance Service': 'maintenance_service.jpg',
    Morel: 'morel.jpg',
    'Poisson Formation': 'poisson_formation.jpg',
    'Select Civil': 'select_civil.jpg',
    SNDM: 'sndm.jpg',
    'Terre-durable': 'terre_durable.jpg',
    'Terre-net': 'terre_net.jpg'
};
let database = null;
function initDatabase() {
    if (database === null) {
        const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
        firebaseConfig.databaseAuthVariableOverride = {
            uid: 'update-service'
        };
        const app = admin.initializeApp(firebaseConfig, 'serve-content');
        database = app.database();
    }
    return database;
}
async function newsIndex(req, res) {
    const db = initDatabase();
    const language = req.params.language || 'fr';
    const snapshot = await db
        .ref(`content/news`)
        .orderByChild('language')
        .equalTo(language)
        .once('value');
    let newsList = snapshot.val() || {};
    newsList = Object.keys(newsList)
        .map(k => newsList[k])
        .sort((a, b) => {
        try {
            return a.createdAt.localeCompare(b.createdAt);
        }
        catch (e) {
            return 0;
        }
    })
        .reverse();
    const pathPrefix = language === 'fr' ? '' : `${language}/`;
    const rawPage = fs
        .readFileSync(`./pages/${pathPrefix}toutes-nos-actualites.html`)
        .toString();
    const templateString = fs
        .readFileSync(`./templates/${pathPrefix}news-list.hbs`)
        .toString();
    handlebars_1.default.registerHelper('subsidiaryLogo', function (subsidiary) {
        return subsidiaryLogos[subsidiary];
    });
    const templateFunction = handlebars_1.default.compile(templateString);
    const newsListHTML = templateFunction({ newsList });
    const result = rawPage.replace('NEWS_LIST', newsListHTML);
    res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    res.send(result);
}
async function newsPage(req, res) {
    const db = initDatabase();
    const language = req.params.language || 'fr';
    const newsId = req.params.id;
    const snapshot = await db
        .ref(`content/news`)
        .orderByChild('language')
        .equalTo(language)
        .once('value');
    const allNews = snapshot.val();
    const news = allNews[newsId];
    const newsList = Object.keys(allNews)
        .map(k => allNews[k])
        .sort((a, b) => {
        try {
            return a.createdAt.localeCompare(b.createdAt);
        }
        catch (e) {
            return 0;
        }
    })
        .reverse();
    const newsPosition = newsList.indexOf(news);
    const previousNews = newsList[newsPosition - 1];
    const nextNews = newsList[newsPosition + 1];
    const pathPrefix = language === 'fr' ? '' : `${language}/`;
    const rawPage = fs
        .readFileSync(`./pages/${pathPrefix}actualite.html`)
        .toString();
    const templateString = fs
        .readFileSync(`./templates/${pathPrefix}news-page.hbs`)
        .toString();
    handlebars_1.default.registerHelper('subsidiaryLogo', function (subsidiary) {
        return subsidiaryLogos[subsidiary];
    });
    const templateFunction = handlebars_1.default.compile(templateString);
    const newsHTML = templateFunction({ news, previousNews, nextNews });
    const result = rawPage
        .replace('NEWS_CONTENT', newsHTML)
        .replace(/NEWS_TITLE/g, news.title);
    res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    res.send(result);
}
async function jobsIndex(req, res) {
    const db = initDatabase();
    const language = req.params.language || 'fr';
    const snapshot = await db
        .ref(`content/jobOffers`)
        .orderByChild('language')
        .equalTo(language)
        .once('value');
    let jobsList = snapshot.val() || {};
    jobsList = Object.keys(jobsList)
        .map(k => jobsList[k])
        .sort((a, b) => {
        try {
            return a.createdAt.localeCompare(b.createdAt);
        }
        catch (e) {
            return 0;
        }
    })
        .reverse();
    const pathPrefix = language === 'fr' ? '' : `${language}/`;
    const rawPage = fs
        .readFileSync(`./pages/${pathPrefix}offres-emploi.html`)
        .toString();
    const templateString = fs
        .readFileSync(`./templates/${pathPrefix}jobs-list.hbs`)
        .toString();
    handlebars_1.default.registerHelper('subsidiaryLogo', function (subsidiary) {
        return subsidiaryLogos[subsidiary];
    });
    const templateFunction = handlebars_1.default.compile(templateString);
    const jobsListHTML = templateFunction({ jobsList });
    const result = rawPage.replace('JOBS_LIST', jobsListHTML);
    res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    res.send(result);
}
async function jobPage(req, res) {
    const db = initDatabase();
    const language = req.params.language || 'fr';
    const jobId = req.params.id;
    const snapshot = await db.ref(`content/jobOffers/${jobId}`).once('value');
    const job = snapshot.val();
    const pathPrefix = language === 'fr' ? '' : `${language}/`;
    const rawPage = fs
        .readFileSync(`./pages/${pathPrefix}offre-emploi.html`)
        .toString();
    const templateString = fs
        .readFileSync(`./templates/${pathPrefix}job-page.hbs`)
        .toString();
    handlebars_1.default.registerHelper('subsidiaryLogo', function (subsidiary) {
        return subsidiaryLogos[subsidiary];
    });
    const templateFunction = handlebars_1.default.compile(templateString);
    const jobHTML = templateFunction({ job });
    const result = rawPage
        .replace('JOB_CONTENT', jobHTML)
        .replace(/JOB_TITLE/g, job.title);
    res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    res.send(result);
}
exports.default = {
    newsIndex,
    newsPage,
    jobsIndex,
    jobPage
};
//# sourceMappingURL=serve-content.js.map