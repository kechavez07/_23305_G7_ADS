// src/domain/services/email.service.ts

export interface IEmailService {

  /**
   * Envía un correo de bienvenida a un nuevo cliente.
   */
  sendWelcomeEmail(to: string, password_autogenerada: string): Promise<void>;


  /**
   * Envía un correo de bienvenida a un nuevo especialista.
   * @param to - Correo del especialista.
   * @param specialistName - Nombre completo del especialista.
   * @param password_autogenerada - Contraseña para el primer acceso.
   */
  sendSpecialistWelcomeEmail(to: string, specialistName: string, password_autogenerada: string): Promise<void>; 
  
}


