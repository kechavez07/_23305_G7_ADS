
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAppointment } from '@/context/AppointmentContext';
import AuthCheck from '@/components/AuthCheck';

const VoucherPage: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, clearAppointments } = useAppointment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process voucher
    alert('¡Voucher registrado con éxito!');
    clearAppointments(); // Clear appointments after successful registration
    navigate('/');
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Registro de Voucher</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Datos del Voucher</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="voucherNumber" className="text-sm font-medium">
                      Número de Voucher
                    </label>
                    <input
                      id="voucherNumber"
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="Ingresa el número de voucher"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="voucherDate" className="text-sm font-medium">
                      Fecha de Pago
                    </label>
                    <input
                      id="voucherDate"
                      type="date"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Monto
                    </label>
                    <input
                      id="amount"
                      type="number"
                      className="w-full p-2 border rounded"
                      placeholder="$ 0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="bank" className="text-sm font-medium">
                      Banco
                    </label>
                    <select
                      id="bank"
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Seleccionar banco</option>
                      <option value="bancoPichincha">Banco Pichincha</option>
                      <option value="bancoGuayaquil">Banco Guayaquil</option>
                      <option value="bancoBGR">Banco BGR</option>
                      <option value="bancoProdubanco">Produbanco</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Observaciones
                    </label>
                    <textarea
                      id="notes"
                      className="w-full p-2 border rounded"
                      rows={3}
                      placeholder="Observaciones adicionales"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Confirmar Registro
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthCheck>
  );
};

export default VoucherPage;
