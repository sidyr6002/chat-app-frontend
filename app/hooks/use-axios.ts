import { useMemo } from "react";
import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";

import { useAuth } from "~/context/auth-context"
import RefreshResponse from "~/types/refresh-response";

export const useAxios = (backendUrl: string) => {
    const { accessToken, setAccessToken } = useAuth();

    if (!backendUrl) {
        throw new Error('Backend URL is not defined');
    }

    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: backendUrl,
            withCredentials: true,
        });

        // Request Interceptor: Attach the access token if available.
        instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (accessToken) {
                    config.headers = new AxiosHeaders(config.headers);
                    config.headers.set("Authorization", `Bearer ${accessToken}`);
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response Interceptor: Refresh token on 401 errors and retry the request.
        instance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as InternalAxiosRequestConfig & {
                    _retry?: boolean;
                };

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const { data } = await instance.post<RefreshResponse>(
                            `/auth/refresh`,
                            {},
                            { withCredentials: true }
                        );

                        setAccessToken(data.accessToken);

                        originalRequest.headers = new AxiosHeaders(originalRequest.headers);
                        originalRequest.headers.set("Authorization", `Bearer ${data.accessToken}`);

                        return instance(originalRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return instance;
    }, [accessToken, backendUrl, setAccessToken]);

    return axiosInstance;
}