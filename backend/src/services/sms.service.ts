import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class SmsService {
  private from = process.env.TWILIO_PHONE_NUMBER;

  /**
   * Envía código de verificación para registro
   */
  async enviarCodigoRegistro(telefono: string, nombre: string, codigo: string): Promise<boolean> {
    // Verificación dentro del método
    if (!this.from) {
        console.error('Error: TWILIO_PHONE_NUMBER no está configurado.');
        return false;
    }
    try {
      await client.messages.create({
        body: `Hola ${nombre}! Tu código de verificación para completar el registro es: ${codigo}. Expira en 10 minutos.`,
        from: this.from,
        to: telefono,
      });
      return true;
    } catch (error) {
      console.error('Error enviando SMS de registro:', error);
      return false;
    }
  }

  /**
   * Envía código para login
   */
  async enviarCodigoLogin(telefono: string, nombre: string, codigo: string): Promise<boolean> {
    // Verificación dentro del método
    if (!this.from) {
        console.error('Error: TWILIO_PHONE_NUMBER no está configurado.');
        return false;
    }
    try {
      await client.messages.create({
        body: `Hola ${nombre}! Tu código de inicio de sesión es: ${codigo}. Expira en 10 minutos. Si no fuiste tú, ignora este mensaje.`,
        from: this.from,
        to: telefono,
      });
      return true;
    } catch (error) {
      console.error('Error enviando SMS de login:', error);
      return false;
    }
  }

  /**
   * Envía código para recuperación de contraseña
   */
  async enviarCodigoRecuperacion(telefono: string, nombre: string, codigo: string): Promise<boolean> {
    // Verificación dentro del método
    if (!this.from) {
        console.error('Error: TWILIO_PHONE_NUMBER no está configurado.');
        return false;
    }
    try {
      await client.messages.create({
        body: `Hola ${nombre}! Tu código de recuperación de contraseña es: ${codigo}. Expira en 15 minutos.`,
        from: this.from,
        to: telefono,
      });
      return true;
    } catch (error) {
      console.error('Error enviando SMS de recuperación:', error);
      return false;
    }
  }

  /**
   * Verifica formato de número de teléfono (debe incluir código de país)
   * Ejemplo: +52 1234567890
   */
  validarFormatoTelefono(telefono: string): boolean {
    const regex = /^\+[1-9]\d{1,14}$/;
    return regex.test(telefono);
  }
}

export default new SmsService();