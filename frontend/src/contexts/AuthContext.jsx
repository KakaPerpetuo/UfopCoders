import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        const storedToken = {
            access: accessToken,
            refresh: refreshToken
        };

        if(accessToken && refreshToken) {
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        const newToken = {
            access: data.access,
            refresh: data.refresh
        };

        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{token, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};