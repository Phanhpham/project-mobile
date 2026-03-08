import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://192.168.1.224:8084/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000
}) 