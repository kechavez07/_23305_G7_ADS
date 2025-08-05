
import React from 'react';
import Header from '@/components/Header';
import AppointmentCart from '@/components/AppointmentCart';
import AuthCheck from '@/components/AuthCheck';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AppointmentCartPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </Button>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Canasta de Citas</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <AppointmentCart inPage={true} />
          </div>
        </main>
      </div>
    </AuthCheck>
  );
};

export default AppointmentCartPage;
