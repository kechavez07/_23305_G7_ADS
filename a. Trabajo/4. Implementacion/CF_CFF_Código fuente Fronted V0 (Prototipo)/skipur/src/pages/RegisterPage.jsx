import RegisterForm from '../components/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center mb-4">
          <Link to="/" className="text-blue-600 hover:underline mr-4">
            ← Regresar
          </Link>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-blue-600">Fundación Carlitos</div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">Registro de Nueva Cuenta</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;