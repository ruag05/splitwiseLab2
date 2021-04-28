import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getStats = createAsyncThunk(
    'groups/getStats',
    async (data) => {
        const response = await  axios.get(`/groups/getStats`)
        if (response.status === 200) {
            return response.data
        }
    }
)

export const getDashboardData = createAsyncThunk(
    'groups/getDashboardData',
    async (data) => {
        const response = await  axios.get(`/groups/getDashboardData`)
        if (response.status === 200) {
            return {...response.data}
        }
    }
)

export const getTUsers = createAsyncThunk(
    'groups/getTUsers',
    async (data) => {
        const response = await   axios.get(`/groups/getTusers`)
        if (response.status === 200) {
            return {...response.data}
        }
    }
)

export const settle = createAsyncThunk(
    'users/settle',
    async (borrowerId) => {
        const response = await axios.post("/users/settle", { borrowerId })
        if (response.status === 200) {
            return {...response.data}
        }
    }
)