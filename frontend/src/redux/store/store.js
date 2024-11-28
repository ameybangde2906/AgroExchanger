import { configureStore } from "@reduxjs/toolkit";
import sellFormReducer from '../slices/sellForms';
import loginFormReducer from '../slices/loginForm';

const store = configureStore({
    reducer: {
        sellForm: sellFormReducer,
        loginForm: loginFormReducer

    }
})

export default store;