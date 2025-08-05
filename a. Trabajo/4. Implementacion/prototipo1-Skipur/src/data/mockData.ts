
import { Specialist, TimeSlot } from '../types/appointment';

// Lista de especialidades
export const specialties = [
  { id: 'fisioterapia', name: 'Fisioterapia' },
  { id: 'psicopedagogía', name: 'Psicopedagogía' },
  { id: 'psicología', name: 'Psicología' }
];

// Lista de especialistas por especialidad
export const specialists: Specialist[] = [
  { id: '1', name: 'Dra. Ana López', specialty: 'fisioterapia', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Dr. Juan Pérez', specialty: 'fisioterapia', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '3', name: 'Dra. María Rodríguez', specialty: 'psicopedagogía', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '4', name: 'Dr. Carlos Gómez', specialty: 'psicopedagogía', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: '5', name: 'Dra. Laura Fernández', specialty: 'psicología', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: '6', name: 'Dr. Roberto Sánchez', specialty: 'psicología', avatar: 'https://i.pravatar.cc/150?img=11' },
];

// Horarios disponibles (para simular)
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  // Horarios de 8:00 AM a 6:00 PM con intervalos de 1 hora
  for (let hour = 8; hour <= 18; hour++) {
    // Simulamos que algunos horarios ya están ocupados
    const available = Math.random() > 0.3;
    slots.push({
      id: `time-${hour}`,
      time: `${hour}:00`,
      available
    });
  }
  return slots;
};

// Función para simular carga de datos con delay
export const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    // Simula un tiempo de respuesta entre 1-2 segundos
    const delay = Math.floor(Math.random() * 1000) + 1000;
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};
