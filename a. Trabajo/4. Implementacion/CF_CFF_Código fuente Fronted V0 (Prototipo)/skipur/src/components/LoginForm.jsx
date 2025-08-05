import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  // Inicializar cuentas predeterminadas si no existen
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const defaultUsers = [
      { email: 'admin@carlitos.com', password: 'Admin123!', role: 'administrador' },
      { email: 'especialista@carlitos.com', password: 'Especialista123!', role: 'especialista' },
      { email: 'cliente@carlitos.com', password: 'Cliente123!', role: 'cliente' },
    ];

    const hasDefaultUsers = storedUsers.some(user => defaultUsers.some(defaultUser => defaultUser.email === user.email));
    if (!hasDefaultUsers) {
      localStorage.setItem('users', JSON.stringify([...storedUsers, ...defaultUsers]));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Validar campos vacíos
    if (!formData.email) {
      newErrors.email = 'Este campo es obligatorio';
    }
    if (!formData.password) {
      newErrors.password = 'Este campo es obligatorio';
    }

    // Validar credenciales
    const user = storedUsers.find(user => user.email === formData.email);
    if (!user) {
      newErrors.email = 'Correo no registrado';
    } else if (user.password !== formData.password) {
      newErrors.password = 'Contraseña incorrecta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? user : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = validateForm();
    if (user) {
      alert('Inicio de sesión exitoso');
      // Simular redirección según el rol
      if (user.role === 'administrador') {
        alert('Redirigiendo a la sección de reportes (simulado)');
      } else if (user.role === 'especialista') {
        alert('Redirigiendo a registrar terapias impartidas (simulado)');
      } else {
        alert('Redirigiendo a agendar cita médica (simulado)');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
          Iniciar Sesión
        </button>
      </form>
      <p className="text-center mt-4">
        ¿No tienes cuenta?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Regístrate aquí
        </a>
      </p>
    </div>
  );
};

export default LoginForm;