import {Outlet, Navigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {useAuth} from './AuthContext';

const ProtectedRoutes = () => {
    const { isAuthenticated, loading } = useAuth();
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
      if (loading) {
        return <div>Loading...</div>; // Or your loading component
      }
    const isUserAuthenticated = isAuthenticated || userValid === 'true';
    return isUserAuthenticated ? <Outlet/> : <Navigate to="/"/>
}

export default ProtectedRoutes;