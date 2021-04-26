import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createGroup = createAsyncThunk(
    '/groups/createGroup',
    async (data) => {
        const response = await axios.post("/groups/create", data)
        if (response.status === 200) {
            return response.data
        }
    }
)
