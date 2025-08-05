
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAppointment } from '@/context/AppointmentContext';
import { Specialist } from '@/types/appointment';
import { specialists, simulateApiCall } from '@/data/mockData';
import { Skeleton } from '@/components/ui/skeleton';

const SpecialistSelector: React.FC = () => {
  const { selectedSpecialty, selectedSpecialistId, setSelectedSpecialistId, isLoading, setIsLoading } = useAppointment();
  const [availableSpecialists, setAvailableSpecialists] = useState<Specialist[]>([]);

  useEffect(() => {
    if (!selectedSpecialty) return;

    const loadSpecialists = async () => {
      setIsLoading(true);
      // Filtrar especialistas por la especialidad seleccionada
      const filtered = specialists.filter(s => s.specialty === selectedSpecialty);
      // Simular una llamada API con delay
      const data = await simulateApiCall(filtered);
      setAvailableSpecialists(data);
      setIsLoading(false);
    };

    loadSpecialists();
  }, [selectedSpecialty, setIsLoading]);

  if (!selectedSpecialty) {
    return null;
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-4">Selecciona un especialista</h2>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <Card key={item} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="ml-3 space-y-1">
                    <Skeleton className="h-3 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {availableSpecialists.length > 0 ? (
            <div className="space-y-2">
              {availableSpecialists.map((specialist) => (
                <Card 
                  key={specialist.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedSpecialistId === specialist.id ? 'border-2 border-medical-blue ring-2 ring-medical-blue/20' : ''
                  }`}
                  onClick={() => setSelectedSpecialistId(specialist.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={specialist.avatar} />
                        <AvatarFallback>{specialist.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <h3 className={`font-medium text-sm ${
                          selectedSpecialistId === specialist.id ? 'text-medical-blue' : ''
                        }`}>
                          {specialist.name}
                        </h3>
                        <p className="text-xs text-gray-500">{specialist.specialty}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">No hay especialistas disponibles para esta especialidad.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SpecialistSelector;
