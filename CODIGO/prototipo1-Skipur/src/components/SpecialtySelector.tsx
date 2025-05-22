
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { specialties } from '@/data/mockData';
import { useAppointment } from '@/context/AppointmentContext';
import { Specialty } from '@/types/appointment';

const SpecialtySelector: React.FC = () => {
  const { selectedSpecialty, setSelectedSpecialty, setSelectedDate, setSelectedSpecialistId } = useAppointment();

  const handleSelectSpecialty = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    // Reset other selections when specialty changes
    setSelectedDate(null);
    setSelectedSpecialistId(null);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Selecciona una especialidad</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {specialties.map((specialty) => (
          <Card 
            key={specialty.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedSpecialty === specialty.id ? 'border-2 border-medical-blue ring-2 ring-medical-blue/20' : ''
            }`}
            onClick={() => handleSelectSpecialty(specialty.id as Specialty)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[120px]">
              <div className={`text-2xl mb-2 ${
                selectedSpecialty === specialty.id ? 'text-medical-blue' : 'text-gray-400'
              }`}>
                {specialty.id === 'fisioterapia' && '🦵'}
                {specialty.id === 'psicopedagogía' && '🧠'}
                {specialty.id === 'psicología' && '🧩'}
              </div>
              <h3 className={`text-lg font-medium ${
                selectedSpecialty === specialty.id ? 'text-medical-blue' : ''
              }`}>
                {specialty.name}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SpecialtySelector;
