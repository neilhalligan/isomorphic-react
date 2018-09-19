import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import TagList from './TagList';

const Question = ({title, tags, question_id}) => {
  return (
    <div className="mb-3">
      <h3>{title}</h3>
      <div className="mb-2">
        <TagList tags={tags} />
      </div>
      <div>
        <Link to={`questions/${question_id}`}>
          <button>More Info</button>
        </Link>
      </div>
    </div>
  );
}

const QuestionList = ({questions}) => {
  return (
    <div>
    {questions && questions.length ?
        <div>
          {questions.map(question=> <Question key={question.question_id} {...question} />)}
        </div> :
        <div>
        ...Loading Questions
        </div>
    }
    </div>
  );
}

function mapStateToProps({questions}) {
  return {questions};
}
export default connect(mapStateToProps)(QuestionList);
