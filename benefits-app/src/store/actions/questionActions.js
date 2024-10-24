import axios from 'axios';

export const fetchQuestions = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/questions');
    dispatch({ type: 'FETCH_QUESTIONS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_QUESTIONS_FAIL', payload: error.response.data.message });
  }
};

export const addQuestion = (question) => async (dispatch) => {
  try {
    const response = await axios.post('/api/questions', question);
    dispatch({ type: 'ADD_QUESTION_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'ADD_QUESTION_FAIL', payload: error.response.data.message });
  }
};

export const deleteQuestion = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/questions/${id}`);
    dispatch({ type: 'DELETE_QUESTION_SUCCESS', payload: id });
  } catch (error) {
    dispatch({ type: 'DELETE_QUESTION_FAIL', payload: error.response.data.message });
  }
};