import { createSlice } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { createGroup } from '../Actions/CreateGroupActions'

export const CreateGroupReducer = createSlice({
    name: "createGroup",
    initialState: {
        group: "",
        msg: "",
        success: false
    },
    reducers: {
        resetMsg(state, action) {
            state.msg = ""
            state.success = true
        }
    },
    extraReducers: {
        [createGroup.fulfilled]: (state, action) => {
            state.group = action.payload.group
            state.msg = action.payload.msg
            state.success = true
        },
        [createGroup.rejected]: (state, action) => {
            state.msg = "Group name already taken"
            state.success = false
        },
    },
});

export const { resetMsg } = CreateGroupReducer.actions;
export default CreateGroupReducer.reducer