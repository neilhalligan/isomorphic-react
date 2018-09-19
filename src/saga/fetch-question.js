import { takeEvery, put } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';

export default function * () {
  yield takeEvery('REQUEST_FETCH_QUESTION', handleFetchQuestion);
}

function * handleFetchQuestion ({question_id}) {
  const raw = yield fetch(`/api/questions/${question_id}`);
  const data = yield raw.json();
  const question = data.items[0];
  yield put({type: 'FETCHED_QUESTION', question});
}
