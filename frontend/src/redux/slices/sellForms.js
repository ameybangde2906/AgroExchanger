import { createSlice } from "@reduxjs/toolkit";

const sellForm = createSlice({
    name: 'sellCrops',
    initialState: {
        open: false,
    },
    reducers: {
        openForm: (state)=>{
            state.open=true;
        },
        closeForm: (state)=>{
            state.open=false;
        }
    }

});

export const {openForm, closeForm} = sellForm.actions;

export default sellForm.reducer;