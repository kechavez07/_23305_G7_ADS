
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SpecialtySelector from '@/components/SpecialtySelector';
import DateSelector from '@/components/DateSelector';
import SpecialistSelector from '@/components/SpecialistSelector';
import TimeSlotSelector from '@/components/TimeSlotSelector';
import AppointmentCart from '@/components/AppointmentCart';
import AuthCheck from '@/components/AuthCheck';
import { useAppointment } from '@/context/AppointmentContext';

const Index: React.FC = () => {
  const { selectedSpecialty, selectedDate, selectedSpecialistId } = useAppointment();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Agendar Cita Médica</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <SpecialtySelector />
              
              {selectedSpecialty && (
                <DateSelector />
              )}
              
              {selectedSpecialty && selectedDate && selectedSpecialistId && (
                <TimeSlotSelector />
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                  {selectedSpecialty && selectedDate && (
                    <SpecialistSelector />
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                  <AppointmentCart />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthCheck>
  );
};

export default Index;
