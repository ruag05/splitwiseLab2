import { createSlice } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { getGroupsName, getHistory } from '../Actions/RecentActivitiesActions';

export const RecentActivitiesReducer = createSlice({
    name: "recentActivities",
    initialState: {
        groups: [],
        history: [],
        gids:[],
        success: false
    },
    extraReducers: {
        [getGroupsName.fulfilled]: (state, action) => {
            state.groups = action.payload.groups
            state.success = true
        },
        [getHistory.fulfilled]: (state, action) => {
            state.history = action.payload.history
            state.gids = action.payload.gids
            state.success = true
        }
    },
});

export default RecentActivitiesReducer.reducer;