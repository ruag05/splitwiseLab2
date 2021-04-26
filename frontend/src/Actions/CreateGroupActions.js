import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createGroup = createAsyncThunk(
    '/groups/create',
    async (data) => {
        const response = await axios.post("/groups/create", data)
        console.log("******createGroup response.data*******: ", response.data)
        if (response.status === 200) {
            return response.data
        }
    }
)
