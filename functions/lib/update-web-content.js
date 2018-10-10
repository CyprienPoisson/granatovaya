"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const cheerio = require("cheerio");
const slugger_1 = require("./slugger");
const recordTypes = {
    '0121p000000wrPFAAY': {
        type: 'news',
        key: 'news'
    },
    '0121p000000wrPEAAY': {
        type: 'jobOffer',
        key: 'jobOffers'
    }
};
let database = null;
function initDatabase() {
    if (database === null) {
        const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
        firebaseConfig.databaseAuthVariableOverride = {
            uid: 'update-service'
        };
        const app = admin.initializeApp(firebaseConfig, 'update-web-content');
        database = app.database();
    }
    return database;
}
async function updateWebContent(req, res) {
    const db = initDatabase();
    const webContent = req.body;
    console.log(webContent);
    const recordType = recordTypes[webContent.RecordTypeId];
    const ref = db.ref(`content/${recordType.key}/${webContent.Name}`);
    let content = webContent.Content__c;
    if (typeof content === 'string') {
        content = content.replace(/https\:\/\/[^\/]*.force.com\/servlet\/rtaImage\?/g, 'https://groupepoisson.secure.force.com/website/servlet/rtaImage?');
    }
    else {
        content = '';
    }
    const $ = cheerio.load(content);
    const firstImage = $('img')
        .first()
        .attr('src');
    const excerpt = $('*')
        .contents()
        .map((i, e) => (e.type === 'text' ? $(e).text() : ''))
        .get()
        .join(' ')
        .slice(0, 500)
        .trim()
        .replace(/\s+/gi, ' ');
    let language;
    switch (webContent.Language__c) {
        case 'Anglais':
            language = 'en';
            break;
        default:
            language = 'fr';
    }
    if (webContent.Published__c) {
        await ref.set({
            id: webContent.Name,
            content,
            contract: webContent.JobOfferContract__c || null,
            excerpt: excerpt || null,
            firstImage: firstImage || null,
            label: webContent.JobOfferLabel__c || null,
            place: webContent.JobOfferPlace__c || null,
            slug: slugger_1.default.toSlug(webContent.Title__c),
            subsidiary: webContent.Subsidiary__c || null,
            title: webContent.Title__c,
            language,
            createdAt: webContent.CreatedDate
        });
    }
    else {
        await ref.remove();
    }
    res.status(200).send();
}
exports.default = updateWebContent;
//# sourceMappingURL=update-web-content.js.map