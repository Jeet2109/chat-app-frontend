import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "https://chitchat-service-api.onrender.com",
    // baseURL: "http://localhost:5000"
})