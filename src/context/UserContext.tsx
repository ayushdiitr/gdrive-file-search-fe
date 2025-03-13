import { createContext, useState, ReactNode, useEffect } from "react";

export interface User{
    id: string;
    name: string;
    email: string;
    profilePicture: string;
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}
export const UserContext = createContext<UserContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    setUser : () => {},
    logout: () => {},
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({children}: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
          credentials: 'include'
        })
          .then(res => {
            if (!res.ok) throw new Error('Not authenticated');
            return res.json();
          })
          .then(data => {
            setUser(data);
          })
          .catch(err => {
            console.error('Authentication check failed:', err);
            setUser(null);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, []);

      const logout = async () => {
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
            credentials: 'include'
          });
          setUser(null);
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };

    return (
        <UserContext.Provider value={{user, isLoading, isAuthenticated: !!user, setUser, logout}}>
            {children}
        </UserContext.Provider>
    )
}