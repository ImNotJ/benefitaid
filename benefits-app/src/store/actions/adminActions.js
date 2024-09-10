import axios from 'axios';

export const loginAdmin = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post('/api/admins/login', { username, password });
    dispatch({ type: 'ADMIN_LOGIN_SUCCESS', payload: response.data });
    localStorage.setItem('token', response.data.token);
  } catch (error) {
    dispatch({ type: 'ADMIN_LOGIN_FAIL', payload: error.response.data.message });
  }
};

export const logoutAdmin = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: 'ADMIN_LOGOUT' });
};