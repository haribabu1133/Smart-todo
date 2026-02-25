import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState(() => {
        return localStorage.getItem('username') || '';
    });

    const saveUsername = (name) => {
        localStorage.setItem('username', name);
        setUsername(name);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 17) return 'Good Afternoon';
        if (hour >= 17 && hour < 21) return 'Good Evening';
        return 'Good Night';
    };

    return (
        <UserContext.Provider value={{ username, saveUsername, getGreeting }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
