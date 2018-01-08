const functions = require('firebase-functions');
const admin = require("firebase-admin");
const toSlug = require('./to-slug').toSlug;

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

let firebaseConfig = functions.config().firebase;
firebaseConfig.databaseAuthVariableOverride = {
  uid: "update-service",
};

admin.initializeApp(firebaseConfig);

exports.updateWebContent = functions.https.onRequest((req, res) => {
  
  updateWebContent(req.body)
  .then(result=>{
    let data = JSON.stringify(result);
    res.status(200).send(data);
  })
  .catch(error=>{
    console.log(error);
    let data = JSON.stringify(error);
    res.status(400).send(data);
  });

});

function updateWebContent(webContent){
  console.log(webContent);
  let db = admin.database();

  let recordType = recordTypes[webContent.RecordTypeId];

  let ref = db.ref(`content/${recordType.key}/${webContent.Name}`);

  let content = webContent.Content__c;
  if(typeof content === 'string'){
    content = content.replace(
      /https\:\/\/[^\/]*.force.com\/servlet\/rtaImage\?/g,
      'https://groupepoisson.secure.force.com/website/servlet/rtaImage?'
    )
  }
  else{
    content = '';
  }
  if( webContent.Published__c ){
    return ref.set({
      id: webContent.Name,
      slug: toSlug(webContent.Title__c),
      subsidiary: webContent.Subsidiary__c || null,
      title: webContent.Title__c,
      content,
      label: webContent.JobOfferLabel__c || null,
      contract: webContent.JobOfferContract__c || null,
      place: webContent.JobOfferPlace__c || null,
      createdAt: webContent.CreatedDate,
    });
  }
  else{
    return ref.remove();
  }
}