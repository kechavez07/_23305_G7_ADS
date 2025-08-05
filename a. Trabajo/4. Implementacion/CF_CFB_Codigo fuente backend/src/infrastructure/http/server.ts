import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Asegura que las variables de .env se carguen
import authRouter from './routes/auth.routes';
import specialtyRouter from './routes/specialty.routes'; 
import specialistRouter from './routes/specialist.routes';
import availabilityRouter from './routes/availability.routes'; 
import appointmentRouter from './routes/appointment.routes';

const app = express();

// --- Middlewares ---
app.use(cors()); // Permite peticiones de diferentes orígenes
app.use(express.json()); // Permite al servidor entender body en formato JSON

// --- Rutas ---
app.use('/api/auth', authRouter);
app.use('/api/specialties', specialtyRouter);
app.use('/api/specialists', specialistRouter);
app.use('/api/availabilities', availabilityRouter);
app.use('/api/appointments', appointmentRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});