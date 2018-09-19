import unionWith from 'lodash/unionWith';

export const questions = (state = [], {type, questions, question}) => {
  const questionsEquality = (a, b) => {
    return a.question_id == b.question_id;
  };

  if (type === 'FETCHED_QUESTIONS') {
    state = unionWith(state, questions, questionsEquality);
  }

  if (type === 'FETCHED_QUESTION') {
    state =unionWith([question], state, questionsEquality);
  }

  return state;
};
