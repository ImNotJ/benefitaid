const initialState = {
    eligibilityResults: null,
    error: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SUBMIT_USER_FORM_SUCCESS':
        return {
          ...state,
          eligibilityResults: action.payload,
          error: null,
        };
      case 'SUBMIT_USER_FORM_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;