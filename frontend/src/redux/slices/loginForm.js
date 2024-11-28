import { createSlice } from "@reduxjs/toolkit";

const loginForm = createSlice({
    name:'login',
    initialState:{
        open:false
    },
    reducers:{
        openLogin:(state)=>{
            state.open=true;
        },
        closeLogin: (state)=>{
            state.open=false;
        }
    }  
})

export const {openLogin, closeLogin}= loginForm.actions;

export default loginForm.reducer