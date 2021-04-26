import { createSlice } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { createGroup } from '../Actions/CreateGroupActions'

export const CreateGroupReducer = createSlice({
    name: "createGroup",
    initialState: {
       group:""
    },
    extraReducers: {
        [createGroup.fulfilled]: (state, action) => {
            // if (action.payload !== null) {
            console.log("************createGroup action.payload**************", action.payload)
            state.group = action.payload.group
            //state.photo = action.payload.photo

            // }
            // state.pname = action.payload.name
            // state.email = action.payload.email
            // if (action.payload.phone !== null) {
            //     state.phone = `(${action.payload.phone.substring(0, 3)}) ${action.payload.phone.substring(3, 6)} ${action.payload.phone.substring(6, 10)}`
            // }
            // else {
            //     state.phone = action.payload.phone
            // }
            // state.pic_loc = action.payload.pic_loc
            // state.currency = action.payload.currency
            // state.timezone = action.payload.timezone
            // state.language = action.payload.language
        },
       
        // [send_update.fulfilled]: (state, action) => {
        //     console.log(action.payload)
        //     if (action.payload.status) {
        //         let key = action.payload.key
        //         let value = action.payload.value
        //         switch (key) {
        //             case 'name': {
        //                 state.pname = value
        //                 break;
        //             }
        //             case 'email': {
        //                 state.email = value
        //                 break;
        //             }
        //             case 'phone': {
        //                 state.phone = `(${value.substring(0, 3)}) ${value.substring(3, 6)} ${value.substring(6, 10)}`
        //                 break;
        //             }
        //             case 'currency': {
        //                 localStorage.setItem("currency", value)
        //                 state.currency = value
        //                 break;
        //             }
        //             case 'timezone': {
        //                 state.timezone = value
        //                 break;
        //             }
        //             case 'language': {
        //                 state.language = value
        //                 break;
        //             }
        //             case 'image': {
        //                 state.pic_info = value
        //                 break;
        //             }
        //             default:
        //                 break;
        //         }
        //     }
        //     else {
        //         state.error = true
        //         state.feed = action.payload.message
        //     }
        // },
        // [send_update.rejected]: (state, action) => {
        //     state.error = true
        //     state.feed = "Operation Unsuccessful"
        // },
    },
});

export default CreateGroupReducer.reducer