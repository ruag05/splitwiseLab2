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
        msg: "",
        success: false
    },
    reducers: {
        resetMsg(state, action) {
            state.msg = ""
            state.success = true
        },
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
            state.photo = action.payload.photo
            state.msg = action.payload.msg
            state.success = true
        },
        [updateProfilePic.rejected]: (state, action) => {
            state.msg = action.payload.msg
            state.success = false
        },
        [updateProfile.fulfilled]: (state, action) => {
            state.user = action.payload.user
            state.msg = "Profile updated"
            state.success = true
        },
        [updateProfile.rejected]: (state, action) => {
            state.msg = "Email already taken"
            state.success = false
        },
        [getUsers.fulfilled]: (state, action) => {
            state.photo = action.payload.photo
            state.name = action.payload.name
            state.email = action.payload.email
            state.phone = action.payload.phone
            state.currency = action.payload.currency ? action.payload.currency : "USD"
            state.timezone = action.payload.timezone ? action.payload.timezone : "America/New_York"
            state.language = action.payload.language ? action.payload.language : "English"
            state.msg = "Profile loaded"
            state.success = true
        }
    },
});

export const { resetMsg, setSingleData } = ProfileReducer.actions;
export default ProfileReducer.reducer