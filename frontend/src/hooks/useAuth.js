import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";



export function useAuth(){
    const context =useContext(AuthContext);


    if (context === null){
        throw new Error(
            "useAuth() was called outside of <AuthProvider>."+
            "Make sure <AuthProvider> wraps your component in App.js."
        );
    }
    return context;
}