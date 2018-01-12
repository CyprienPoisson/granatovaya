import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

import Handlebars from 'handlebars';


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


const firebaseConfig = functions.config().firebase;
firebaseConfig.databaseAuthVariableOverride = {
  uid: "update-service",
};


const firebaseServeContentApp = admin.initializeApp(firebaseConfig, 'serve-content');
const db = firebaseServeContentApp.database();

async function newsIndex(req, res){
  
  const newsRef = db.ref(`content/news`);
  const snapshot = await newsRef.once('value');

  let newsList = snapshot.val();
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
    return 0;
  })
  .reverse();
  
  const rawPage: string = fs.readFileSync("./pages/toutes-nos-actualites.html").toString();
  const templateString: string = fs.readFileSync("./templates/news-list.hbs").toString();

  Handlebars.registerHelper('subsidiaryLogo', function(subsidiary) {
    return subsidiaryLogos[subsidiary];
  });

  const templateFunction = Handlebars.compile(templateString);

  const newsListHTML: string = templateFunction({newsList});
  const result = rawPage.replace('NEWS_LIST', newsListHTML);
  
  res.send(result);
}

async function newsPage(req, res){
  const newsId = req.params.id;
  const newsRef = db.ref(`content/news/${newsId}`);
  const snapshot = await newsRef.once('value');
  const news = snapshot.val();

  const rawPage: string = fs.readFileSync("./pages/actualite.html").toString();
  const templateString: string = fs.readFileSync("./templates/news-page.hbs").toString();

  Handlebars.registerHelper('subsidiaryLogo', function(subsidiary) {
    return subsidiaryLogos[subsidiary];
  });

  const templateFunction = Handlebars.compile(templateString);

  const newsHTML: string = templateFunction({news});
  const result = rawPage.replace('NEWS_CONTENT', newsHTML);
  
  res.send(result);
  res.send(req.params.id);
}

export default {
  newsIndex,
  newsPage
}