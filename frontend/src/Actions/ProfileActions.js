import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateProfilePic = createAsyncThunk(
    'users/updateProfilePic',
    async (data) => {
        const response = await axios.post(`/users/updateProfilePic`, data)
        console.log("******updateProfilePic response.data*******: ", response.data)
        if (response.status === 200) {
            return { ...response.data }
        }
    }
)

export const updateProfile = createAsyncThunk(
    'users/updateProfile',
    async (data) => {
        const response = await axios.post(`/users/update`, data)
        console.log("******updateProfile response.data*******: ", response.data)
        if (response.status === 200) {
            return { ...response.data }
        }
    }
)

export const getUsers = createAsyncThunk(
    '/users',
    async () => {
        const response = await axios.get("/users")
        console.log("******getUsers response.data*******: ", response.data)
        if (response.status === 200) {
            return { ...response.data }
        }
    }
)
export const send_update = createAsyncThunk(
    'users/sendupdate',
    async (pckg) => {
        console.log("---LET ME CHECK---", pckg);
        const response = await axios.post('http://localhost:3001/profile/update', pckg)
        console.log(response.status)
        if (response.status === 200) {
            return { status: true, key: pckg.data.type, value: pckg.data.value }
        }
        else {
            console.log("Something here")
            return { status: false, message: `${pckg.data.type} cannot be changed to ${pckg.data.value}` }
        }

    }
)