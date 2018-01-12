import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as cheerio from 'cheerio';
import Slugger from './slugger';

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

export default async function updateWebContent(req, res){
  const webContent = req.body;

  console.log(webContent);

  const recordType = recordTypes[webContent.RecordTypeId];

  const ref = db.ref(`content/${recordType.key}/${webContent.Name}`);

  let content = webContent.Content__c;

  if(typeof content === 'string'){
    content = content.replace(
      /https\:\/\/[^\/]*.force.com\/servlet\/rtaImage\?/g,
      'https://groupepoisson.secure.force.com/website/servlet/rtaImage?'
    );
  }
  else{
    content = '';
  }

  const $ = cheerio.load(content);

  const firstImage = $('img').first().attr('src');

  const excerpt = $('*')
      .contents()
      .map( (i, e) => e.type === 'text' ? $(e).text() : '' )
      .get()
      .join(' ')
      .slice(0, 500)
      .trim()
      .replace(/\s+/gi, ' ');

  if( webContent.Published__c ){
    await ref.set({
      id: webContent.Name,

      content,
      contract: webContent.JobOfferContract__c || null,
      excerpt: excerpt || null,
      firstImage: firstImage || null,
      label: webContent.JobOfferLabel__c || null,
      place: webContent.JobOfferPlace__c || null,
      slug: Slugger.toSlug(webContent.Title__c),
      subsidiary: webContent.Subsidiary__c || null,
      title: webContent.Title__c,
      
      createdAt: webContent.CreatedDate,
    });
  }
  else{
    await ref.remove();
  }

  res.status(200).send();
}