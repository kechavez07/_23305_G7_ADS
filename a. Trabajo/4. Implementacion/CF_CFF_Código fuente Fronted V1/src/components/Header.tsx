
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAppointment } from '@/context/AppointmentContext';
import { Calendar, User, LogOut, Home } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Header: React.FC = () => {
  const { appointments } = useAppointment();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem('userLoggedIn');
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };
  
  return (
    <header className="bg-white border-b shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Calendar className="h-6 w-6 text-medical-blue mr-2" />
            <span className="font-bold text-xl text-medical-blue">Bienestar a Tu Cita</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-medical-blue hover:text-medical-blue/80">
            <Home className="h-5 w-5" />
            <span>Inicio</span>
          </Link>
          
          <Link to="/appointment-cart" className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Canasta</span>
              {appointments.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-medical-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {appointments.length}
                </span>
              )}
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
