import {Outlet, Navigate} from "react-router-dom";
import {useState, useEffect} from "react";

const ProtectedRoutes = () => {
    const [userValid, setUserValid] = useState(() => {
        return sessionStorage.getItem('userValid') || '';
      });
    
      useEffect(() => {
        const handleStorageChange = () => {
          setUserValid(sessionStorage.getItem('userValid'));
        };
    
        window.addEventListener('storage', handleStorageChange);
    
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
      }, []);

    return userValid ? <Outlet/> : <Navigate to="/"/>
}

export default ProtectedRoutes;