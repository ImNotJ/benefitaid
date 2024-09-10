import axios from 'axios';

export const fetchBenefits = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/benefits');
    dispatch({ type: 'FETCH_BENEFITS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_BENEFITS_FAIL', payload: error.response.data.message });
  }
};

export const addBenefit = (benefit) => async (dispatch) => {
  try {
    const response = await axios.post('/api/benefits', benefit);
    dispatch({ type: 'ADD_BENEFIT_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'ADD_BENEFIT_FAIL', payload: error.response.data.message });
  }
};

export const deleteBenefit = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/benefits/${id}`);
    dispatch({ type: 'DELETE_BENEFIT_SUCCESS', payload: id });
  } catch (error) {
    dispatch({ type: 'DELETE_BENEFIT_FAIL', payload: error.response.data.message });
  }
};