import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState({ sold: 0, token: null, roles: [] });
    const [isLoaded, setIsLoaded] = useState(false);

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
                setUserDetails({ ...userData, token, roles: userData.roles.split(';').map(role => role.trim()) });
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoaded(true);
            }
        } else {
            setIsLoaded(true);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const isAdmin = () => userDetails.roles.includes('admin');

    return (
        <UserContext.Provider value={{ userDetails, fetchUserData, isAdmin, isLoaded }}>
            {children}
        </UserContext.Provider>
    );
};
