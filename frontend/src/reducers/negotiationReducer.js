const initialState = {
    negotiations: [],
    loading: false,
    error: null,
  };
  
  const negotiationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_NEGOTIATIONS_REQUEST':
        return { ...state, loading: true, error: null };
      case 'FETCH_NEGOTIATIONS_SUCCESS':
        return { ...state, loading: false, negotiations: action.payload };
      case 'FETCH_NEGOTIATIONS_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default negotiationReducer;
  