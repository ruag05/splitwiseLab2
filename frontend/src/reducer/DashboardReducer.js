import { createSlice } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { getStats, getDashboardData, getTUsers, settle } from '../Actions/DashboardActions'

export const DashboardReducer = createSlice({
    name: "dashboard",
    initialState: {
        data: "",
        finalDashboardData: [],
        users: [],
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
        [getStats.fulfilled]: (state, action) => {
            state.data = action.payload
            state.success = true
        },
        [getDashboardData.fulfilled]: (state, action) => {
            state.finalDashboardData = action.payload.finalDashboardData
            state.success = true
        },
        [getTUsers.fulfilled]: (state, action) => {
            state.users = action.payload.users
            state.success = true
        },
        [settle.fulfilled]: (state, action) => {
            state.msg = action.payload.msg
            state.success = true
        }
    }
});

export const { resetMsg } = DashboardReducer.actions;
export default DashboardReducer.reducer