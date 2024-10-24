const initialState = {
    adminInfo: null,
    error: null,
  };
  
  const adminReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADMIN_LOGIN_SUCCESS':
        return {
          ...state,
          adminInfo: action.payload,
          error: null,
        };
      case 'ADMIN_LOGIN_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      case 'ADMIN_LOGOUT':
        return {
          ...state,
          adminInfo: null,
          error: null,
        };
      default:
        return state;
    }
  };
  
  export default adminReducer;