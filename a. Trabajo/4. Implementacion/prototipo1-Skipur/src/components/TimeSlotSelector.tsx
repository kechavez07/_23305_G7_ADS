
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppointment } from '@/context/AppointmentContext';
import { TimeSlot, Appointment } from '@/types/appointment';
import { generateTimeSlots, simulateApiCall, specialists, specialties } from '@/data/mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const TimeSlotSelector: React.FC = () => {
  const { 
    selectedSpecialty, 
    selectedSpecialistId, 
    selectedDate,
    addAppointment,
    isLoading,
    setIsLoading
  } = useAppointment();
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (!selectedSpecialty || !selectedSpecialistId || !selectedDate) return;

    const loadTimeSlots = async () => {
      setIsLoading(true);
      // Generar horarios disponibles
      const slots = generateTimeSlots();
      // Simular una llamada API con delay
      const data = await simulateApiCall(slots);
      setTimeSlots(data);
      setIsLoading(false);
    };

    loadTimeSlots();
  }, [selectedSpecialty, selectedSpecialistId, selectedDate, setIsLoading]);

  const handleSelectTimeSlot = (timeSlot: TimeSlot) => {
    if (!selectedSpecialty || !selectedSpecialistId || !selectedDate || !timeSlot.available) return;

    const specialist = specialists.find(s => s.id === selectedSpecialistId);
    const specialty = specialties.find(s => s.id === selectedSpecialty);

    if (!specialist || !specialty) {
      toast.error("No se pudo completar la selección.");
      return;
    }

    const newAppointment: Appointment = {
      id: `${Date.now()}`,
      specialtyId: selectedSpecialty,
      specialtyName: specialty.name,
      specialistId: selectedSpecialistId,
      specialistName: specialist.name,
      date: selectedDate,
      timeSlot: timeSlot.time
    };

    addAppointment(newAppointment);
  };

  if (!selectedSpecialty || !selectedSpecialistId || !selectedDate) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Selecciona un horario</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Skeleton key={item} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <>
          {timeSlots.length > 0 ? (
            <div>
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <p className="text-sm text-gray-600">
                  Horarios disponibles para el {selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={slot.available ? "outline" : "ghost"}
                    className={`h-12 ${
                      slot.available 
                        ? 'hover:bg-medical-light-blue hover:text-white' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!slot.available}
                    onClick={() => handleSelectTimeSlot(slot)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
              {timeSlots.every(slot => !slot.available) && (
                <p className="mt-4 text-center text-red-500">
                  No hay horarios disponibles para esta fecha.
                </p>
              )}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay horarios disponibles.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TimeSlotSelector;
