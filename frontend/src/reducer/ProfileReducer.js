import { createSlice } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { updateProfilePic, updateProfile, getUsers } from '../Actions/ProfileActions'

export const ProfileReducer = createSlice({
    name: "profile",
    initialState: {
        name: "",
        email: "",
        phone: "",
        photo: "",
        currency: "",
        timezone: "",
        language: "",
        user: "",
        msg: ""
    },
    reducers: {
        setSingleData(state, action) {
            let key = action.payload.key
            let value = action.payload.value
            switch (key) {
                case 'name': {
                    state.name = value
                    state.msg = "Name modified, click Save button to save"
                    break;
                }
                case 'email': {
                    state.email = value
                    state.msg = "email modified, click Save button to save"
                    break;
                }
                case 'phone': {
                    state.phone = `(${value.substring(0, 3)}) ${value.substring(3, 6)} ${value.substring(6, 10)}`
                    state.msg = "Number modified, click Save button to save"
                    break;
                }
                case 'currency': {
                    state.currency = value
                    state.msg = "Currency modified, click Save button to save"
                    break;
                }
                case 'timezone': {
                    state.timezone = value
                    state.msg = "Timezone modified, click Save button to save"
                    break;
                }
                case 'language': {
                    state.language = value
                    state.msg = "Language modified, click Save button to save"
                    break;
                }
                case 'photo': {
                    state.photo = value
                    state.msg = "Photo modified, click Save button to save"
                    break;
                }
                default:                   
                    break;
            }
        }
    },
    extraReducers: {
        [updateProfilePic.fulfilled]: (state, action) => {
            // if (action.payload !== null) {
            console.log("************updateProfilePic action.payload**************", action.payload)
            state.photo = action.payload.photo
            state.msg = action.payload.msg
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
        [updateProfile.fulfilled]: (state, action) => {
            console.log("************ updateProfile action.payload**************", action.payload)
            state.user = action.payload.user
            state.msg = "Profile updated"
        },
        [getUsers.fulfilled]: (state, action) => {
            console.log("**********getUsers 234 action.payload**********", action.payload)
            state.photo = action.payload.photo
            state.name = action.payload.name
            state.email = action.payload.email
            state.phone = action.payload.phone
            state.currency = action.payload.currency?action.payload.currency:"USD"
            state.timezone = action.payload.timezone?action.payload.timezone:"America/New_York"
            state.language = action.payload.language?action.payload.language:"English"
            state.msg = "Profile loaded"
        }
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

export const { setSingleData } = ProfileReducer.actions;
export default ProfileReducer.reducer