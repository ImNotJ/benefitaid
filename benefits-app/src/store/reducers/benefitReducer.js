const initialState = {
    benefits: [],
    error: null,
  };
  
  const benefitReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_BENEFITS_SUCCESS':
        return {
          ...state,
          benefits: action.payload,
          error: null,
        };
      case 'FETCH_BENEFITS_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      case 'ADD_BENEFIT_SUCCESS':
        return {
          ...state,
          benefits: [...state.benefits, action.payload],
          error: null,
        };
      case 'ADD_BENEFIT_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      case 'DELETE_BENEFIT_SUCCESS':
        return {
          ...state,
          benefits: state.benefits.filter((benefit) => benefit.id !== action.payload),
          error: null,
        };
      case 'DELETE_BENEFIT_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default benefitReducer;