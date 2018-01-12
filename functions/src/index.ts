import * as functions from 'firebase-functions';
import * as express from 'express';

import ServeContent from './serve-content';

const app = express();
app.get('/toutes-nos-actualites.html', ServeContent.newsIndex);
app.get('/actualites/:id/:slug', ServeContent.newsPage);
app.get('/offres-emploi.html', ServeContent.jobsIndex);
app.get('/offres-emploi/:id/:slug', ServeContent.jobPage);

export const content = functions.https.onRequest(app);
