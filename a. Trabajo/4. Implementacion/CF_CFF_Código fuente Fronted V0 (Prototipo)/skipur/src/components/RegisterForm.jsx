import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    representativeName: '',
    email: '',
    phone: '',
    patientName: '',
    patientAge: '',
    patientSex: '',
    disability: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de correo inválido';
    } else if (storedUsers.some(user => user.email === formData.email)) {
      newErrors.email = 'Correo ya registrado';
    }

    // Validar teléfono
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Número no válido (debe ser 10 dígitos empezando con 09)';
    }

    // Validar edad
    const age = parseInt(formData.patientAge);
    if (age < 1 || age > 100) {
      newErrors.patientAge = 'Edad debe estar entre 1 y 100';
    }

    // Validar contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*-]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial';
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar campos obligatorios
    const requiredFields = ['representativeName', 'email', 'phone', 'patientName', 'patientAge', 'patientSex', 'password', 'confirmPassword'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Este campo es obligatorio';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newUser = { ...formData, role: 'cliente' };
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      alert('Registro exitoso');
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre del representante *</label>
        <input
          type="text"
          name="representativeName"
          value={formData.representativeName}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.representativeName && <p className="text-red-500 text-xs">{errors.representativeName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Correo electrónico *</label>
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
        <label className="block text-sm font-medium text-gray-700">Teléfono *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre del paciente *</label>
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.patientName && <p className="text-red-500 text-xs">{errors.patientName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Edad del paciente *</label>
        <input
          type="number"
          name="patientAge"
          value={formData.patientAge}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.patientAge && <p className="text-red-500 text-xs">{errors.patientAge}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Sexo del paciente *</label>
        <select
          name="patientSex"
          value={formData.patientSex}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Seleccionar</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        {errors.patientSex && <p className="text-red-500 text-xs">{errors.patientSex}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Presencia de alguna discapacidad</label>
        <input
          type="text"
          name="disability"
          value={formData.disability}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contraseña *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirmar contraseña *</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        Registrar Cuenta
      </button>
    </form>
  );
};

export default RegisterForm;