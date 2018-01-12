const functions = require('firebase-functions');
const admin = require("firebase-admin");
const Handlebars = require("handlebars");
const fs = require("fs");

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
}

let firebaseConfig = functions.config().firebase;
firebaseConfig.databaseAuthVariableOverride = {
  uid: "update-service",
};

admin.initializeApp(firebaseConfig, 'pages');


exports.newsIndex = function newsIndex(req, res){
  let db = admin.database();
  let newsRef = db.ref(`content/news`);
  return newsRef.once('value').then(s=>{
    let newsList = s.val();
    let page = fs.readFileSync("./pages/toutes-nos-actualites.html").toString();
    let template = fs.readFileSync("./templates/news-list.hbs").toString();

    Handlebars.registerHelper('subsidiaryLogo', function(subsidiary) {
      return subsidiaryLogos[subsidiary];
    });

    template = Handlebars.compile(template);
    newsList = Object.keys(newsList).map(k=>newsList[k])
    .sort((a, b)=>{
      if( a.createdAt && b.createdAt ){
        return a.createdAt - b.createdAt;
      }
      else if( a.createdAt && !b.createdAt){
        return 1;
      }
      else if( !a.createdAt && b.createdAt){
        return -1;
      }
      else if( !a.createdAt && !b.createdAt){
        return a.id - b.id;
      }
    })
    .reverse();
    newsList = template({newsList});
    page = page.replace('NEWS_LIST', newsList);
    return page;
  })
  .then(page => res.send(page));
}

exports.news = function news(req, res){
  console.log(req);
  return req.params.id;
}