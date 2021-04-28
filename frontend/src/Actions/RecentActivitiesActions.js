import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getGroupsName = createAsyncThunk(
    'groups/getGroupsName',
    async () => {
        const response = await axios.get("/groups/getAllGroupsName")
        if (response.status === 200) {
            return { ...response.data }
        }
    }
)

export const getHistory = createAsyncThunk(
    'users/getHistory',
    async () => {
        const response = await axios.get("/users/getAllHistory")
        if (response.status === 200) {
            return { ...response.data }
        }
    }
)
