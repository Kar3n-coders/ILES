import React, { createContext,useState,useEffect,useCallback } from "react";

export const AuthContext = createContext(null);

export const USER_ROLES = {
    STUDENT: "student",
    WORKPLACE_SUPERVISOR:"workplace_supervisor",
    ACADEMIC_SUPERVISOR:"academic_supervisor",
    ADMIN:"internship_admin",
};


export function AuthProvider({children}){
    const [user,setUser] = useState(null);


    const [isLoading,setIsLoading] = useState(true);

 
    useEffect(() => {
        const storedToken = localStorage.getItem("iles_auth_token");
        const storedUser = localStorage.getItem("iles_user");


        if (storedToken && storedUser ) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse stored user data. Clearing session.");
                localStorage.removeItem("iles_auth_token");
                localStorage.removeItem("iles_user");
            }
        }
        
        setIsLoading(false);
    },[]);

    const login = useCallback(({user: userData, token}) => {

        localStorage.setItem("iles_auth_token",token);
        localStorage.setItem("iles_user",JSON.stringify(userData));


        setUser(userData);
    },[]);

    const logout = useCallback(() => {

        localStorage.removeItem("iles_auth_token");
        localStorage.removeItem("iles_user");


        setUser(null);
    },[]);



    const isAuthenticated = user !== null;


    const contextValue = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

 