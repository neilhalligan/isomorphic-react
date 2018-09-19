import { put, take } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';

export default function* () {
  while(true) {
    yield take('REQUEST_FETCH_QUESTIONS');
    const raw = yield fetch('/api/questions');
    const data = yield raw.json();
    const questions = data.items;
    yield put({type: 'FETCHED_QUESTIONS', questions});
  }
}
