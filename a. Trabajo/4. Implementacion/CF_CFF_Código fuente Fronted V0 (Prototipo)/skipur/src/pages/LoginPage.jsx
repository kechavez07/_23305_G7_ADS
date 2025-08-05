import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="text-2xl font-bold text-blue-600">Fundación Carlitos</div>
        </div>
        <h2 className="text-xl font-semibold text-center mb-2">Bienvenido de nuevo</h2>
        <p className="text-center text-gray-600 mb-4">Ingresa tus credenciales para acceder al sistema</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;