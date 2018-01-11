const functions = require('firebase-functions');
const admin = require("firebase-admin");
const Handlebars = require("handlebars");
const fs = require("fs");
const cheerio = require('cheerio');
const toSlug = require('./to-slug').toSlug;

let firebaseConfig = functions.config().firebase;

admin.initializeApp(firebaseConfig, 'admin');

exports.process = functions.https.onRequest((req, res) => {
    
  let db = admin.database();
  let newsRef = db.ref(`content/news`);
  return newsRef.once('value').then(s=>{
    let newsList = s.val();
    for(let id in newsList){
      let news = newsList[id];
      
      const $ = cheerio.load(news.content);
      let excerpt = $('*').contents().map(function() {
        return (this.type === 'text') ? ($(this).text() + ' ') : '';
      }).get().join('').slice(0, 500).trim().replace(/\s+/gi, ' ');

      newsRef.child(id).child('excerpt').set(excerpt);
      // console.log(subsidiarySlug);
    }
  });
});