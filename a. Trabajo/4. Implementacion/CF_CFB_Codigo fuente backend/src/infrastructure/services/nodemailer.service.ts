// src/infrastructure/services/nodemailer.service.ts

import * as nodemailer from 'nodemailer';
import { IEmailService } from '../../domain/services/email.service';

export class NodemailerService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuramos el "transporter" que se encargará de enviar el correo
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Tu correo de Gmail
        pass: process.env.EMAIL_PASS, // La contraseña de aplicación
      },
    });
  }

  async sendWelcomeEmail(to: string, password_autogenerada: string): Promise<void> {
    console.log(`Intentando enviar correo de bienvenida a ${to} con la contraseña autogenerada.`);

    const mailOptions = {
      from: `"Fundación SKIPUR" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: '¡Bienvenido/a a SKIPUR! Tu cuenta ha sido creada.',
      html: `
        <h1>¡Hola!</h1>
        <p>Tu cuenta para el sistema de agendamiento de citas de SKIPUR ha sido creada exitosamente.</p>
        <p>Puedes iniciar sesión con tu correo electrónico y la siguiente contraseña generada automáticamente:</p>
        <h2><strong>${password_autogenerada}</strong></h2>
        <p>Te recomendamos cambiarla después de tu primer inicio de sesión.</p>
        <p>¡Gracias por confiar en nosotros!</p>
        <br>
        <p>Atentamente,</p>
        <p>El equipo de la Fundación SKIPUR</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo de bienvenida enviado a ${to}`);
    } catch (error) {
      console.error(`Error al enviar el correo de bienvenida a ${to}:`, error);
      // En un escenario real, podrías reintentar o registrar este fallo.
      // Por ahora, no lanzamos una excepción para no detener el registro del usuario.
    }
  }


  async sendSpecialistWelcomeEmail(to: string, specialistName: string, password_autogenerada: string): Promise<void> {
    console.log(`Intentando enviar correo de bienvenida al especialista ${specialistName} (${to}).`);

    const mailOptions = {
      from: `"Fundación SKIPUR - Administración" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: '¡Bienvenido/a al equipo de SKIPUR!',
      html: `
        <h1>¡Hola, ${specialistName}!</h1>
        <p>Te damos la bienvenida al equipo de especialistas de la Fundación SKIPUR.</p>
        <p>Hemos creado tu cuenta en nuestro sistema de gestión. Ya puedes acceder para configurar tu disponibilidad y gestionar tus citas.</p>
        <p>Tus credenciales de acceso son:</p>
        <ul>
            <li><strong>Correo:</strong> ${to}</li>
            <li><strong>Contraseña temporal:</strong> <h2><strong>${password_autogenerada}</strong></h2></li>
        </ul>
        <p>Por seguridad, te recomendamos cambiar tu contraseña después de tu primer inicio de sesión.</p>
        <br>
        <p>¡Estamos muy contentos de tenerte a bordo!</p>
        <p>Atentamente,</p>
        <p>El equipo de Administración de SKIPUR</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo de bienvenida enviado exitosamente al especialista ${to}`);
    } catch (error) {
      console.error(`Error al enviar correo de bienvenida al especialista ${to}:`, error);
    }
  }

}