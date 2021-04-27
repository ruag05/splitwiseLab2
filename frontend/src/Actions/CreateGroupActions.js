import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createGroup = createAsyncThunk(
    '/groups/createGroup',
    async (data) => {
        //  try {
        console.log("inside createGroup action....data", data)

        const response = await axios.post("/groups/create", data)
        console.log("*********create group Action....response.data", response.data)

        if (response.status === 200) {
            return { ...response.data }
        }
        // else {
        //     return { status: false, message: `${data.data.type} cannot be changed to ${data.data.value}` }
        //     // }
        // }
        // catch (err) {
        //     return { status: false, message: `Error is: ${err}` }
        // }
    }
)
