const functions = require('firebase-functions');
const admin = require("firebase-admin");

let firebaseConfig = functions.config().firebase;
firebaseConfig.databaseAuthVariableOverride = {
  uid: "update-service",
};

admin.initializeApp(firebaseConfig);

exports.updateNews = functions.https.onRequest((req, res) => {
    
  updateNews(req.body)
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

function updateNews(news){
  let db = admin.database();
  let newsRef = db.ref(`content/news/${news.Name}`);
  let content = news.Content__c;
  content = content.replace(
    /https\:\/\/[^\/]*.force.com\/servlet\/rtaImage\?/g,
    'https://groupepoisson.secure.force.com/website/servlet/rtaImage?'
  )
  if( news.Published__c ){
    return newsRef.set({
      title: news.Title__c,
      content,
    });
  }
  else{
    return newsRef.remove();
  }
}