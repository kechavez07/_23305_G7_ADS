
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthCheckProps {
  children: React.ReactNode;
}

// Este componente verifica si el usuario está autenticado
const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    // Verificar si hay un usuario en sessionStorage
    const checkAuth = () => {
      const userLoggedIn = sessionStorage.getItem('userLoggedIn');
      setIsAuthenticated(userLoggedIn === 'true');
    };
    
    checkAuth();
  }, []);

  // Mostrar un estado de carga mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-medical-blue" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redireccionar al login si no está autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthCheck;
