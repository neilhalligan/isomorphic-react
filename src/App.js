import React from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';

import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';

class AppDisplay extends React.Component {
  render() {
    return (
      <div>
        <Link to="/">
          <h1>
            Questions Galore
          </h1>
        </Link>
        <div>
          <Route exact path="/" render={() => <QuestionList />} />
          <Route exact path="/questions/:id"
            render={({match}) => <QuestionDetail question_id={match.params.id}/>}
          />
          <Route exact path="/tags/react/:id" render={() => <QuestionList />} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state
  };
}
export default connect(mapStateToProps)(AppDisplay);
