import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as cheerio from 'cheerio';
// import slugger from './slugger';

const firebaseConfig = functions.config().firebase;

const firebaseAdminApp = admin.initializeApp(firebaseConfig, 'admin');
const db = firebaseAdminApp.database();

async function buildNewsExcerpts(req, res){

  const snapshot = await db.ref(`content/news`).once('value');
  const newsList = snapshot.val();

  for(const id in newsList){
    const news = newsList[id];
    const $ = cheerio.load(news.content);

    const excerpt = $('*')
      .contents()
      .map( (i, e) => e.type === 'text' ? $(e).text() : '' )
      .get()
      .join(' ')
      .slice(0, 500)
      .trim()
      .replace(/\s+/gi, ' ');

    // db.ref(`content/news/${id}/excerpt`).set(excerpt);
    console.log(excerpt);
  }

  res.send('OK');
}

export default {
  buildNewsExcerpts,
}