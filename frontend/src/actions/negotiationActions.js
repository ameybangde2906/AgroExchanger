import axios from 'axios';

export const fetchNegotiations = (orderId) => async (dispatch) => {
  dispatch({ type: 'FETCH_NEGOTIATIONS_REQUEST' });
  try {
    const response = await axios.get(`/api/negotiations/order/${orderId}`);
    dispatch({ type: 'FETCH_NEGOTIATIONS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_NEGOTIATIONS_FAILURE', payload: error.response.data });
  }
};
