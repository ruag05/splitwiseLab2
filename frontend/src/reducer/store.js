import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import ProfileReducer from './ProfileReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
//import RegisterReducer from './RegisterReducer'
//import GroupReducer from './GroupReducer'

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
         profile: ProfileReducer
        // dash: DashReducer,
        // register: RegisterReducer,
        // group: GroupReducer,
    },
}, composeWithDevTools());