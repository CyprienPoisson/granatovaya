import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

import Handlebars from 'handlebars';


const subsidiaryLogos = {
  "Akela Interim": "akela.jpg",
  "Axel Duval": "axel_duval.jpg",
  "Axel Sud": "axel_sud.jpg",
  "Brein Transports": "brein_transports.jpg",
  "Groupe Poisson": "entite_groupepoisson.png",
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
    try{
      return a.createdAt.localeCompare(b.createdAt);
    }
    catch(e){
      return 0;
    }
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
  
  res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
  res.send(result);
}

async function newsPage(req, res){
  const newsId = req.params.id;
  const newsRef = db.ref(`content/news`);
  const snapshot = await newsRef.once('value');
  const allNews = snapshot.val();

  const news = allNews[newsId];

  const newsList = Object.keys(allNews).map(k=>allNews[k])
  .sort((a, b)=>{
    try{
      return a.createdAt.localeCompare(b.createdAt);
    }
    catch(e){
      return 0;
    }
  })
  .reverse();

  const newsPosition = newsList.indexOf(news);
  const previousNews = newsList[newsPosition - 1];
  const nextNews = newsList[newsPosition + 1];

  const rawPage: string = fs.readFileSync("./pages/actualite.html").toString();
  const templateString: string = fs.readFileSync("./templates/news-page.hbs").toString();

  Handlebars.registerHelper('subsidiaryLogo', function(subsidiary) {
    return subsidiaryLogos[subsidiary];
  });

  const templateFunction = Handlebars.compile(templateString);

  const newsHTML: string = templateFunction({news, previousNews, nextNews});
  const result = rawPage
    .replace('NEWS_CONTENT', newsHTML)
    .replace(/NEWS_TITLE/g, news.title);

  res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
  res.send(result);
}

async function jobsIndex(req, res){
  
  const snapshot = await db.ref(`content/jobOffers`).once('value');

  let jobsList = snapshot.val();
  jobsList = Object.keys(jobsList).map(k=>jobsList[k])
  .sort((a, b)=>{
    try{
      return a.createdAt.localeCompare(b.createdAt);
    }
    catch(e){
      return 0;
    }
  })
  .reverse();
  
  const rawPage: string = fs.readFileSync("./pages/offres-emploi.html").toString();
  const templateString: string = fs.readFileSync("./templates/jobs-list.hbs").toString();

  Handlebars.registerHelper('subsidiaryLogo', function(subsidiary) {
    return subsidiaryLogos[subsidiary];
  });

  const templateFunction = Handlebars.compile(templateString);

  const jobsListHTML: string = templateFunction({jobsList});
  const result = rawPage.replace('JOBS_LIST', jobsListHTML);
  
  res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
  res.send(result);
}



async function jobPage(req, res){
  const jobId = req.params.id;
  const snapshot = await db.ref(`content/jobOffers/${jobId}`).once('value');
  const job = snapshot.val();

  const rawPage: string = fs.readFileSync("./pages/offre-emploi.html").toString();
  const templateString: string = fs.readFileSync("./templates/job-page.hbs").toString();

  Handlebars.registerHelper('subsidiaryLogo', function(subsidiary) {
    return subsidiaryLogos[subsidiary];
  });

  const templateFunction = Handlebars.compile(templateString);

  const jobHTML: string = templateFunction({job});
  const result = rawPage
    .replace('JOB_CONTENT', jobHTML)
    .replace(/JOB_TITLE/g, job.title);
  
  res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
  res.send(result);
}

export default {
  newsIndex,
  newsPage,
  jobsIndex,
  jobPage,
}