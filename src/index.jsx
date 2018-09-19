import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import getStore from './getStore';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import App from './App';

const store = getStore(history)
const history = createHistory();

const render = (_App) => {
    ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <_App />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  );
};

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp)
  })
}

const fetchDataForLocation = location => {
  if (location.pathname === "/") {
    store.dispatch({type: 'REQUEST_FETCH_QUESTIONS'});
  }
  if (location.pathname.includes('questions')) {
    store.dispatch({
      type: 'REQUEST_FETCH_QUESTION',
      question_id: location.pathname.split('/')[2]
    })
  }
}


store.subscribe(() => {
  const state = store.getState()
  if (state.questions.length) {
    console.log('App mounting')
    render(App)
  } else {
    console.log('App not mounting')
  }
})

fetchDataForLocation(history.location);
history.listen(fetchDataForLocation);
