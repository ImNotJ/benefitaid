const initialState = {
    quizzes: [],
    error: null,
  };
  
  const quizReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_QUIZZES_SUCCESS':
        return {
          ...state,
          quizzes: action.payload,
          error: null,
        };
      case 'FETCH_QUIZZES_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      case 'ADD_QUIZ_SUCCESS':
        return {
          ...state,
          quizzes: [...state.quizzes, action.payload],
          error: null,
        };
      case 'ADD_QUIZ_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      case 'DELETE_QUIZ_SUCCESS':
        return {
          ...state,
          quizzes: state.quizzes.filter((quiz) => quiz.id !== action.payload),
          error: null,
        };
      case 'DELETE_QUIZ_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default quizReducer;