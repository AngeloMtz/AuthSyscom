import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  private from = process.env.EMAIL_FROM || 'Tu App <noreply@tudominio.com>';

  /**
   * Envía código de verificación para registro
   */
  async enviarCodigoRegistro(email: string, nombre: string, codigo: string): Promise<boolean> {
    try {
      await resend.emails.send({
        from: this.from,
        to: email,
        subject: 'Verifica tu cuenta - Código de activación',
        html: this.templateRegistro(nombre, codigo),
      });
      return true;
    } catch (error) {
      console.error('Error enviando email de registro:', error);
      return false;
    }
  }

  /**
   * Envía código para login
   */
  async enviarCodigoLogin(email: string, nombre: string, codigo: string): Promise<boolean> {
    try {
      await resend.emails.send({
        from: this.from,
        to: email,
        subject: 'Código de verificación - Inicio de sesión',
        html: this.templateLogin(nombre, codigo),
      });
      return true;
    } catch (error) {
      console.error('Error enviando email de login:', error);
      return false;
    }
  }

  /**
   * Envía código para recuperación de contraseña
   */
  async enviarCodigoRecuperacion(email: string, nombre: string, codigo: string): Promise<boolean> {
    try {
      await resend.emails.send({
        from: this.from,
        to: email,
        subject: 'Recuperación de contraseña - Código de verificación',
        html: this.templateRecuperacion(nombre, codigo),
      });
      return true;
    } catch (error) {
      console.error('Error enviando email de recuperación:', error);
      return false;
    }
  }

  // ========== TEMPLATES HTML ==========

  private templateRegistro(nombre: string, codigo: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .code { background: white; border: 2px dashed #4F46E5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido/a!</h1>
          </div>
          <div class="content">
            <h2>Hola ${nombre},</h2>
            <p>Gracias por registrarte. Para completar tu registro, necesitamos verificar tu correo electrónico.</p>
            <p>Tu código de verificación es:</p>
            <div class="code">${codigo}</div>
            <p><strong>Este código expira en 10 minutos.</strong></p>
            <p>Si no solicitaste este registro, puedes ignorar este correo.</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private templateLogin(nombre: string, codigo: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .code { background: white; border: 2px dashed #10B981; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10B981; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Código de Inicio de Sesión</h1>
          </div>
          <div class="content">
            <h2>Hola ${nombre},</h2>
            <p>Hemos recibido una solicitud de inicio de sesión en tu cuenta.</p>
            <p>Tu código de verificación es:</p>
            <div class="code">${codigo}</div>
            <p><strong>Este código expira en 10 minutos.</strong></p>
            <p>Si no fuiste tú, te recomendamos cambiar tu contraseña de inmediato.</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private templateRecuperacion(nombre: string, codigo: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #F59E0B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .code { background: white; border: 2px dashed #F59E0B; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #F59E0B; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Recuperación de Contraseña</h1>
          </div>
          <div class="content">
            <h2>Hola ${nombre},</h2>
            <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
            <p>Tu código de verificación es:</p>
            <div class="code">${codigo}</div>
            <p><strong>Este código expira en 15 minutos.</strong></p>
            <p>Si no solicitaste este cambio, por favor ignora este correo y tu contraseña permanecerá sin cambios.</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();