
import React from 'react';
import { useAppointment } from '@/context/AppointmentContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, Clock, User, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AppointmentCart: React.FC<{ inPage?: boolean }> = ({ inPage = false }) => {
  const { appointments, removeAppointment, clearAppointments } = useAppointment();
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (appointments.length === 0) {
      toast.error("Debes agregar al menos una cita para continuar.");
      return;
    }
    
    toast.success("¡Citas confirmadas exitosamente!");
    
    // Simular delay antes de redirección
    setTimeout(() => {
      navigate('/voucher');
    }, 1000);
  };

  if (!inPage && appointments.length === 0) {
    return null;
  }

  return (
    <div className={`${inPage ? '' : 'mt-8'}`}>
      <h2 className="text-xl font-semibold mb-4">
        {inPage ? 'Tu canasta de citas' : 'Resumen de citas'}
      </h2>
      
      {appointments.length === 0 ? (
        <Alert className="mb-4">
          <AlertDescription>
            No hay citas en tu canasta. Por favor selecciona una especialidad, fecha, especialista y horario para agendar.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{appointment.specialtyName}</h3>
                    <div className="flex items-center mt-2">
                      <User className="h-4 w-4 text-gray-500 mr-1" />
                      <p className="text-sm text-gray-600">{appointment.specialistName}</p>
                    </div>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <p className="text-sm text-gray-600">
                        {format(appointment.date, "EEEE d 'de' MMMM", { locale: es })}
                      </p>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <p className="text-sm text-gray-600">{appointment.timeSlot}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeAppointment(appointment.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {inPage && (
            <CardFooter className="flex justify-between pt-4 px-0">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Agendar más citas
              </Button>
              <Button 
                onClick={handleConfirm}
                className="bg-medical-green hover:bg-medical-green/90"
              >
                Confirmar citas
              </Button>
            </CardFooter>
          )}
        </div>
      )}
      
      {!inPage && appointments.length > 0 && (
        <div className="mt-4 flex justify-between">
          <Button 
            variant="outline" 
            className="text-sm"
            onClick={() => navigate('/appointment-cart')}
          >
            Ver todas las citas
          </Button>
          <Button 
            onClick={handleConfirm}
            className="text-sm bg-medical-green hover:bg-medical-green/90"
          >
            Confirmar citas
          </Button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCart;
