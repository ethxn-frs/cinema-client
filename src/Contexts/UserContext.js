// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState({ sold: 0, token: null });

    const fetchUserData = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (userId && token) {
            try {
                const response = await fetch(`http://localhost:3000/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch user details');
                const userData = await response.json();
                setUserDetails({ ...userData, token });
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ userDetails, fetchUserData }}>
            {children}
        </UserContext.Provider>
    );
};
