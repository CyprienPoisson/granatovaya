const functions = require('firebase-functions');
const admin = require("firebase-admin");
const Handlebars = require("handlebars");
const fs = require("fs");

let firebaseConfig = functions.config().firebase;
firebaseConfig.databaseAuthVariableOverride = {
  uid: "update-service",
};

admin.initializeApp(firebaseConfig, 'pages');

exports.newsIndex = functions.https.onRequest((req, res) => {
    
  newsIndex(req.body)
  .then(result=>{
    let data = result;
    res.status(200).send(data);
  })
  .catch(error=>{
    console.log(error);
    let data = JSON.stringify(error);
    res.status(400).send(data);
  });

});

function newsIndex(){
  let db = admin.database();
  let newsRef = db.ref(`content/news`);
  return newsRef.once('value').then(s=>{
    let newsList = s.val();
    let page = fs.readFileSync("./pages/toutes-nos-actualites.html").toString();
    let template = fs.readFileSync("./templates/news-list.hbs").toString();
    template = Handlebars.compile(template);
    newsList = Object.keys(newsList).map(k=>newsList[k]);
    newsList = template({newsList});
    page = page.replace('NEWS_LIST', newsList);
    return page;
  });
}