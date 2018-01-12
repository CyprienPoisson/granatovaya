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
const slugger_1 = require("./slugger");
const recordTypes = {
    '0121p000000wrPFAAY': {
        type: 'news',
        key: 'news',
    },
    '0121p000000wrPEAAY': {
        type: 'jobOffer',
        key: 'jobOffers',
    }
};
const firebaseConfig = functions.config().firebase;
firebaseConfig.databaseAuthVariableOverride = {
    uid: "update-service",
};
const firebaseUpdateApp = admin.initializeApp(firebaseConfig, 'update-web-content');
const db = firebaseUpdateApp.database();
function updateWebContent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const firstImage = $('img').first().attr('src');
        const excerpt = $('*')
            .contents()
            .map((i, e) => e.type === 'text' ? $(e).text() : '')
            .get()
            .join(' ')
            .slice(0, 500)
            .trim()
            .replace(/\s+/gi, ' ');
        if (webContent.Published__c) {
            yield ref.set({
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
                createdAt: webContent.CreatedDate,
            });
        }
        else {
            yield ref.remove();
        }
        res.status(200).send();
    });
}
exports.default = updateWebContent;
//# sourceMappingURL=update-web-content.js.map