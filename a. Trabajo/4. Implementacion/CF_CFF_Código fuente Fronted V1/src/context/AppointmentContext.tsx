
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, Specialty } from '../types/appointment';
import { toast } from '@/components/ui/sonner';

interface AppointmentContextType {
  appointments: Appointment[];
  selectedSpecialty: Specialty | null;
  selectedDate: Date | null;
  selectedSpecialistId: string | null;
  isLoading: boolean;
  
  setSelectedSpecialty: (specialty: Specialty | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedSpecialistId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  
  addAppointment: (appointment: Appointment) => void;
  removeAppointment: (id: string) => void;
  clearAppointments: () => void;
  hasConflict: (newAppointment: Omit<Appointment, 'id'>) => boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Verificar si existe un conflicto de cita (mismo día y especialidad)
  const hasConflict = (newAppointment: Omit<Appointment, 'id'>): boolean => {
    return appointments.some(appointment => 
      appointment.specialtyId === newAppointment.specialtyId && 
      appointment.date.toDateString() === newAppointment.date.toDateString()
    );
  };

  // Añadir una nueva cita
  const addAppointment = (appointment: Appointment) => {
    // Verificar si ya existe una cita para la misma especialidad en el mismo día
    if (hasConflict(appointment)) {
      toast.error("Ya tienes una cita para esta especialidad en la fecha seleccionada.");
      return;
    }
    
    setAppointments(prev => [...prev, appointment]);
    toast.success("Cita añadida a la canasta exitosamente.");
  };

  // Eliminar una cita por ID
  const removeAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    toast.info("Cita eliminada de la canasta.");
  };

  // Limpiar todas las citas
  const clearAppointments = () => {
    setAppointments([]);
  };

  const value = {
    appointments,
    selectedSpecialty,
    selectedDate,
    selectedSpecialistId,
    isLoading,
    
    setSelectedSpecialty,
    setSelectedDate,
    setSelectedSpecialistId,
    setIsLoading,
    
    addAppointment,
    removeAppointment,
    clearAppointments,
    hasConflict
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};
