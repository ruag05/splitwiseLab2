import { createSlice } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { createGroup } from '../Actions/CreateGroupActions'

export const CreateGroupReducer = createSlice({
    name: "createGroup",
    initialState: {
        group: "",
        msg: ""
    },
    reducers: {
        resetMsg(state, action) {
            state.msg = ""
        }
    },
    extraReducers: {
        [createGroup.fulfilled]: (state, action) => {
            state.group = action.payload.group
            state.msg = action.payload.msg
        },
    },
});

export const { resetMsg } = CreateGroupReducer.actions;
export default CreateGroupReducer.reducer