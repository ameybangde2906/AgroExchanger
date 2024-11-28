import axios from 'axios';

export const fetchOrders = () => async (dispatch) => {
  dispatch({ type: 'FETCH_ORDERS_REQUEST' });
  try {
    const response = await axios.get('/api/orders');
    dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_ORDERS_FAILURE', payload: error.response.data });
  }
};
