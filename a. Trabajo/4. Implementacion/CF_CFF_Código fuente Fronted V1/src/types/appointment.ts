
export type Specialty = 'fisioterapia' | 'psicopedagogía' | 'psicología';

export interface Specialist {
  id: string;
  name: string;
  specialty: Specialty;
  avatar?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  specialtyId: Specialty;
  specialtyName: string;
  specialistId: string;
  specialistName: string;
  date: Date;
  timeSlot: string;
}
