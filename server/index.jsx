import express from 'express';
import yields from 'express-yields';
import fs from 'fs-extra';
import webpack from 'webpack'
import { argv } from 'optimist';
import { get } from 'request-promise';
import { questions, question, tag } from '../data/api-real-url';
import { delay } from 'redux-saga';
import getStore from '../src/getStore';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import React from 'react';
import createHistory from 'history/createMemoryHistory';
import { ConnectedRouter } from 'react-router-redux';
import path from 'path';
import App from '../src/App';


const app = express();
const port = process.env.PORT || 3000;

const useLiveData = argv.useLiveData === 'true';
const useServerRender = argv.useServerRender === 'true';

async function getQuestions() {
  let data;
  if (useLiveData) {
    data = await get(questions, {gzip: true});
  } else {
    data = await fs.readFile('data/mock-questions.json', 'utf-8');
  }
  return JSON.parse(data);
}

async function getQuestion(question_id) {
  let data;
  if (useLiveData) {
    data = await get(question(question_id),{gzip:true,json:true});
  } else {
    const questions = await fs.readFile('data/mock-questions.json', 'utf-8');
    const question = response.items.find(_question=> _question.question_id === question_id);
    question.body = `mock body ${question_id}`
    data = {items: [question]}
  }
  return data;
}

async function getQuestionsForTag(tag_name) {
  return await get(tag(tag_name), {gzip: true, json: true});
}

app.get('/api/questions', async function (req, res) {
  const data = await getQuestions()
  res.json(data)
});

app.get('/api/questions/:id', async function (req, res) {
  const data = await getQuestion(req.params.id)
  res.json(data)
});


if (process.env.NODE_ENV === 'development') {
  const config = require('../webpack.config.dev.babel.js').default;
  const compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true
  }));

  app.use(require('webpack-hot-middleware')(compiler));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
}

app.get(['/', '/questions/:id', '/tags/react/:id'], function * (req, res) {
  let index = yield fs.readFile('public/index.html', 'utf-8');

  const initialState = {
    questions: []
  };
  if (req.url.match(/questions/)) {
    const question_id = req.params.id
    const response = yield getQuestion(question_id);
    const questionDetails = response.items[0];
    initialState.questions = [question_id, questionDetails];
  } else if (req.url.match(/tags/)) {
    const tag_name = req.params.id
    const questions = yield getQuestionsForTag(tag_name);
    initialState.questions = questions.items;
  } else {
    const questions = yield getQuestions();
    initialState.questions = questions.items;
  }

  const history = createHistory({
    initialEntries: [req.path]
  });

  const store = getStore(history, initialState);

  if (useServerRender) {
    const appRendered = renderToString(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );
    index = index.replace('<%= preloadedApplication %>', appRendered);
    index = index.replace('<%- initialData %>', JSON.stringify(initialState));
  } else {
    index = index.replace('<%- initialData %>', JSON.stringify(''));
    index = index.replace('<%= preloadedApplication %>', 'Please wait while we load the application');
  }
  res.send(index);
})

app.listen(port, '0.0.0.0', () => console.log(`App listening on port ${port}`))
