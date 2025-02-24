import axios from "axios";

const backendURL = process.env.BACKEND_URL

if (!backendURL) {
    throw new Error("BACKEND_URL must be set");
}

const axiosInstance = axios.create({
    baseURL: backendURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default axiosInstance