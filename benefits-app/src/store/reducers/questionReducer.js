const initialState = {
    questions: [],
    error: null,
  };
  
  const questionReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_QUESTIONS_SUCCESS':
        return {
          ...state,
          questions: action.payload,
          error: null,
        };
      case 'FETCH_QUESTIONS_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      case 'ADD_QUESTION_SUCCESS':
        return {
          ...state,
          questions: [...state.questions, action.payload],
          error: null,
        };
      case 'ADD_QUESTION_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      case 'DELETE_QUESTION_SUCCESS':
        return {
          ...state,
          questions: state.questions.filter((question) => question.id !== action.payload),
          error: null,
        };
      case 'DELETE_QUESTION_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default questionReducer;