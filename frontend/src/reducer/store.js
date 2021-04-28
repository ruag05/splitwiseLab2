import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { composeWithDevTools } from 'redux-devtools-extension'
import ProfileReducer from './ProfileReducer'
import CreateGroupReducer from './CreateGroupReducer';
import RecentActivitiesReducer from './RecentActivitiesReducer';
import  DashboardReducer from "./DashboardReducer"

export default configureStore({
    // middleware: getDefaultMiddleware({
    //     serializableCheck: {
    //       // Ignore these action types
    //       ignoredActions: ['users/fetchProfile'],
    //       // Ignore these field paths in all actions
    //       ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
    //       // Ignore these paths in the state
    //       ignoredPaths: ['items.dates'],
    //     },
    //   }),
    reducer: {
         profile: ProfileReducer,
         createGroup: CreateGroupReducer,
         recentActivities: RecentActivitiesReducer,
         dashboard: DashboardReducer
    },
}, composeWithDevTools());