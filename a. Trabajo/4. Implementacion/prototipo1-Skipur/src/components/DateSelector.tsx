
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useAppointment } from '@/context/AppointmentContext';
import { addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

const DateSelector: React.FC = () => {
  const { selectedDate, setSelectedDate } = useAppointment();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  
  useEffect(() => {
    // Generar fechas disponibles (días de semana de la semana actual)
    const dates: Date[] = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 es domingo, 6 es sábado
    
    // Calculamos el lunes de la semana actual
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = addDays(today, mondayOffset);
    
    // Añadimos los 5 días laborables (lunes a viernes)
    for (let i = 0; i < 5; i++) {
      const date = addDays(monday, i);
      dates.push(date);
    }
    
    setAvailableDates(dates);
  }, []);

  // Función para verificar si una fecha es seleccionable
  const isDateAvailable = (date: Date): boolean => {
    const day = date.getDay();
    // 0 es domingo, 6 es sábado - excluimos estos días
    if (day === 0 || day === 6) return false;

    // Verificar si la fecha está en la lista de disponibles
    return availableDates.some(availableDate => 
      isSameDay(availableDate, date)
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Selecciona una fecha</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={setSelectedDate}
          disabled={(date) => !isDateAvailable(date)}
          locale={es}
          className="pointer-events-auto"
        />
        <div className="text-sm text-gray-500 mt-2">
          *Solo días laborables disponibles
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
