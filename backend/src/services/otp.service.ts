import prisma from '../config/database';
import { OtpTipo, OtpCanal } from '../types';

class OtpService {
  /**
   * Genera un código OTP de 6 dígitos
   */
  private generarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Crea y guarda un código OTP en la base de datos
   */
  async crearOtp(userId: number, tipo: OtpTipo, canal: OtpCanal): Promise<string> {
    const codigo = this.generarCodigo();
    const expiracion = new Date();
    
    // Los códigos expiran en 10 minutos
    expiracion.setMinutes(expiracion.getMinutes() + 10);

    // Invalidar códigos anteriores del mismo tipo y canal
    await prisma.otpCode.updateMany({
      where: {
        userId,
        tipo,
        canal,
        utilizado: false,
      },
      data: {
        utilizado: true,
      },
    });

    // Crear nuevo código
    await prisma.otpCode.create({
      data: {
        userId,
        codigo,
        tipo,
        canal,
        expiracion,
      },
    });

    return codigo;
  }

  /**
   * Verifica si un código OTP es válido
   */
  async verificarOtp(
    userId: number,
    codigo: string,
    tipo: OtpTipo,
    canal: OtpCanal
  ): Promise<boolean> {
    const otpCode = await prisma.otpCode.findFirst({
      where: {
        userId,
        codigo,
        tipo,
        canal,
        utilizado: false,
        expiracion: {
          gte: new Date(), // Código no expirado
        },
      },
    });

    if (!otpCode) {
      return false;
    }

    // Marcar como utilizado
    await prisma.otpCode.update({
      where: { id: otpCode.id },
      data: { utilizado: true },
    });

    return true;
  }

  /**
   * Limpia códigos expirados (se puede ejecutar periódicamente)
   */
  async limpiarCodigosExpirados(): Promise<number> {
    const result = await prisma.otpCode.deleteMany({
      where: {
        expiracion: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  /**
   * Cuenta intentos recientes de un usuario (para prevenir spam)
   */
  async contarIntentosRecientes(userId: number, minutos: number = 30): Promise<number> {
    const desde = new Date();
    desde.setMinutes(desde.getMinutes() - minutos);

    const count = await prisma.otpCode.count({
      where: {
        userId,
        expiracion: {
          gte: desde,
        },
      },
    });

    return count;
  }
}

export default new OtpService();