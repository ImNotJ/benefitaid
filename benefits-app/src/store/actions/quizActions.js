import axios from 'axios';

export const fetchQuizzes = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/quizzes');
    dispatch({ type: 'FETCH_QUIZZES_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_QUIZZES_FAIL', payload: error.response.data.message });
  }
};

export const addQuiz = (quiz) => async (dispatch) => {
  try {
    const response = await axios.post('/api/quizzes', quiz);
    dispatch({ type: 'ADD_QUIZ_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'ADD_QUIZ_FAIL', payload: error.response.data.message });
  }
};

export const deleteQuiz = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/quizzes/${id}`);
    dispatch({ type: 'DELETE_QUIZ_SUCCESS', payload: id });
  } catch (error) {
    dispatch({ type: 'DELETE_QUIZ_FAIL', payload: error.response.data.message });
  }
};