CREATE TYPE userrole AS ENUM ('CLIENTE', 'ESPECIALISTA', 'ADMIN');
CREATE TYPE appointmentstatus AS ENUM ('RESERVADA', 'PENDIENTE_VERIFICACION', 'AGENDADA', 'CANCELADA', 'COMPLETADA', 'NO_ASISTIO');
CREATE TYPE patientgender AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    role userrole NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "Patient" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    representative_id UUID NOT NULL,
    full_name TEXT NOT NULL,
    age INT NOT NULL,
    gender patientgender,
    condition TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (representative_id) REFERENCES "User"(id) ON DELETE CASCADE
);


CREATE TABLE "Specialty" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "Specialist" (
    user_id UUID PRIMARY KEY,
    specialty_id UUID,
    title TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (specialty_id) REFERENCES "Specialty"(id) ON DELETE SET NULL
);


CREATE TABLE "Availability" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialist_id UUID NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (specialist_id, start_time)
);


CREATE TABLE "Appointment" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    specialist_id UUID NOT NULL,
    availability_id UUID UNIQUE,
    status appointmentstatus DEFAULT 'RESERVADA',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES "Patient"(id),
    FOREIGN KEY (specialist_id) REFERENCES "User"(id),
    FOREIGN KEY (availability_id) REFERENCES "Availability"(id)
);


CREATE TABLE "Payment" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL,
    boucher_url TEXT NOT NULL,
    status TEXT DEFAULT 'PENDIENTE_VERIFICACION',
    verified_by_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES "Appointment"(id),
    FOREIGN KEY (verified_by_id) REFERENCES "User"(id)
);
