import axios from 'axios';

export const submitUserForm = (user) => async (dispatch) => {
  try {
    const response = await axios.post('/api/eligibility/check', user);
    dispatch({ type: 'SUBMIT_USER_FORM_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'SUBMIT_USER_FORM_FAIL', payload: error.response.data.message });
  }
};