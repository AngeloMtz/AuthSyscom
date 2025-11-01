import { Request, Response } from 'express';
import prisma from '../config/database';
import passwordUtil from '../utils/password.util';
import jwtUtil from '../utils/jwt.util';
import validatorsUtil from '../utils/validators.util';
import otpService from '../services/otp.service';
import emailService from '../services/email.service';
import smsService from '../services/sms.service';
import { AuthRequest, RegistroDTO, LoginDTO, VerificarOtpDTO } from '../types';

class AuthController {
  // ==================== REGISTRO ====================

  /**
   * Paso 1: Registro inicial del usuario
   * POST /api/auth/register
   */
  async registrar(req: Request, res: Response) {
    try {
      const { nombre, apellidos, email, telefono, password }: RegistroDTO = req.body;

      // Verificar si el email ya existe
      const emailExiste = await prisma.user.findUnique({ where: { email } });
      if (emailExiste) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado',
        });
      }

      // Verificar si el teléfono ya existe
      const telefonoExiste = await prisma.user.findUnique({ where: { telefono } });
      if (telefonoExiste) {
        return res.status(400).json({
          success: false,
          message: 'El teléfono ya está registrado',
        });
      }

      // Hashear contraseña
      const passwordHash = await passwordUtil.hash(password);

      // Crear usuario
      const user = await prisma.user.create({
        data: {
          nombre: validatorsUtil.sanitizarTexto(nombre),
          apellidos: validatorsUtil.sanitizarTexto(apellidos),
          email: email.toLowerCase().trim(),
          telefono,
          passwordHash,
          estado: 'pendiente',
        },
      });

      // Generar código OTP para email
      const codigoEmail = await otpService.crearOtp(user.id, 'registro', 'email');

      // Enviar email de verificación
      const emailEnviado = await emailService.enviarCodigoRegistro(
        user.email,
        user.nombre,
        codigoEmail
      );

      if (!emailEnviado) {
        return res.status(500).json({
          success: false,
          message: 'Error al enviar el email de verificación',
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Usuario registrado. Verifica tu email para continuar.',
        data: {
          userId: user.id,
          email: user.email,
          siguientePaso: 'verificar_email',
        },
      });
    } catch (error) {
      console.error('Error en registro:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al registrar usuario',
      });
    }
  }

  /**
   * Paso 2: Verificar email con código OTP
   * POST /api/auth/verify-email
   */
  async verificarEmail(req: Request, res: Response) {
    try {
      const { email, codigo } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      // Verificar código OTP
      const codigoValido = await otpService.verificarOtp(user.id, codigo, 'registro', 'email');

      if (!codigoValido) {
        return res.status(400).json({
          success: false,
          message: 'Código inválido o expirado',
        });
      }

      // Marcar email como verificado
      await prisma.user.update({
        where: { id: user.id },
        data: { verificadoEmail: true },
      });

      // Generar código OTP para SMS
      const codigoSms = await otpService.crearOtp(user.id, 'registro', 'sms');

      // Enviar SMS de verificación
      const smsEnviado = await smsService.enviarCodigoRegistro(
        user.telefono,
        user.nombre,
        codigoSms
      );

      if (!smsEnviado) {
        return res.status(500).json({
          success: false,
          message: 'Error al enviar el SMS de verificación',
        });
      }

      return res.json({
        success: true,
        message: 'Email verificado. Se ha enviado un código a tu teléfono.',
        data: {
          siguientePaso: 'verificar_sms',
        },
      });
    } catch (error) {
      console.error('Error verificando email:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar email',
      });
    }
  }

  /**
   * Paso 3: Verificar SMS con código OTP
   * POST /api/auth/verify-phone
   */
  async verificarTelefono(req: Request, res: Response) {
    try {
      const { email, codigo } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      if (!user.verificadoEmail) {
        return res.status(400).json({
          success: false,
          message: 'Primero debes verificar tu email',
        });
      }

      // Verificar código OTP
      const codigoValido = await otpService.verificarOtp(user.id, codigo, 'registro', 'sms');

      if (!codigoValido) {
        return res.status(400).json({
          success: false,
          message: 'Código inválido o expirado',
        });
      }

      // Activar cuenta completamente
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificadoSms: true,
          estado: 'activo',
        },
      });

      // Generar token JWT
      const token = jwtUtil.generarToken({
        userId: user.id,
        email: user.email,
        rol: user.rol,
      });

      return res.json({
        success: true,
        message: '¡Cuenta activada con éxito! Ya puedes iniciar sesión.',
        data: {
          token,
          user: {
            id: user.id,
            nombre: user.nombre,
            apellidos: user.apellidos,
            email: user.email,
            rol: user.rol,
          },
        },
      });
    } catch (error) {
      console.error('Error verificando teléfono:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar teléfono',
      });
    }
  }

  // ==================== LOGIN ====================

  /**
   * Paso 1: Login con credenciales
   * POST /api/auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const { emailOrPhone, password, metodoVerificacion }: LoginDTO = req.body;

      // Identificar si es email o teléfono
      const tipo = validatorsUtil.identificarTipo(emailOrPhone);
      if (!tipo) {
        return res.status(400).json({
          success: false,
          message: 'Formato inválido',
        });
      }

      // Buscar usuario
      const user = await prisma.user.findUnique({
        where: tipo === 'email' ? { email: emailOrPhone } : { telefono: emailOrPhone },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas',
        });
      }

      // Verificar si está bloqueado
      if (user.bloqueadoHasta && user.bloqueadoHasta > new Date()) {
        return res.status(403).json({
          success: false,
          message: 'Cuenta bloqueada temporalmente por múltiples intentos fallidos',
          bloqueadoHasta: user.bloqueadoHasta,
        });
      }

      // Verificar contraseña
      const passwordValida = await passwordUtil.compare(password, user.passwordHash);

      if (!passwordValida) {
        // Incrementar intentos fallidos
        const intentosFallidos = user.intentosFallidos + 1;
        const actualizacion: any = { intentosFallidos };

        // Bloquear después de 5 intentos fallidos
        if (intentosFallidos >= 5) {
          const bloqueadoHasta = new Date();
          bloqueadoHasta.setMinutes(bloqueadoHasta.getMinutes() + 15);
          actualizacion.bloqueadoHasta = bloqueadoHasta;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: actualizacion,
        });

        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas',
          intentosRestantes: Math.max(0, 5 - intentosFallidos),
        });
      }

      // Verificar que la cuenta esté activa
      if (user.estado !== 'activo') {
        return res.status(403).json({
          success: false,
          message: 'Tu cuenta no está activa. Por favor verifica tu email y teléfono.',
        });
      }

      // Resetear intentos fallidos
      await prisma.user.update({
        where: { id: user.id },
        data: { intentosFallidos: 0, bloqueadoHasta: null },
      });

      // Generar código OTP según el método elegido
      const codigo = await otpService.crearOtp(user.id, 'login', metodoVerificacion);

      // Enviar código
      let enviado = false;
      if (metodoVerificacion === 'email') {
        enviado = await emailService.enviarCodigoLogin(user.email, user.nombre, codigo);
      } else {
        enviado = await smsService.enviarCodigoLogin(user.telefono, user.nombre, codigo);
      }

      if (!enviado) {
        return res.status(500).json({
          success: false,
          message: 'Error al enviar código de verificación',
        });
      }

      return res.json({
        success: true,
        message: `Código de verificación enviado a tu ${metodoVerificacion === 'email' ? 'correo' : 'teléfono'}`,
        data: {
          userId: user.id,
          metodoVerificacion,
          siguientePaso: 'verificar_otp',
        },
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
      });
    }
  }

  /**
   * Paso 2: Verificar código OTP para login
   * POST /api/auth/login/verify-otp
   */
  async verificarOtpLogin(req: Request, res: Response) {
    try {
      const { emailOrPhone, codigo, metodoVerificacion } = req.body;

      const tipo = validatorsUtil.identificarTipo(emailOrPhone);
      if (!tipo) {
        return res.status(400).json({
          success: false,
          message: 'Formato inválido',
        });
      }

      const user = await prisma.user.findUnique({
        where: tipo === 'email' ? { email: emailOrPhone } : { telefono: emailOrPhone },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      // Verificar código OTP
      const codigoValido = await otpService.verificarOtp(
        user.id,
        codigo,
        'login',
        metodoVerificacion
      );

      if (!codigoValido) {
        return res.status(400).json({
          success: false,
          message: 'Código inválido o expirado',
        });
      }

      // Generar token JWT
      const token = jwtUtil.generarToken({
        userId: user.id,
        email: user.email,
        rol: user.rol,
      });

      return res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          token,
          user: {
            id: user.id,
            nombre: user.nombre,
            apellidos: user.apellidos,
            email: user.email,
            telefono: user.telefono,
            rol: user.rol,
          },
        },
      });
    } catch (error) {
      console.error('Error verificando OTP login:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar código',
      });
    }
  }

  // ==================== RECUPERACIÓN DE CONTRASEÑA ====================

  /**
   * Paso 1: Solicitar recuperación de contraseña
   * POST /api/auth/forgot-password
   */
  async solicitarRecuperacion(req: Request, res: Response) {
    try {
      const { emailOrPhone, metodoVerificacion } = req.body;

      const tipo = validatorsUtil.identificarTipo(emailOrPhone);
      if (!tipo) {
        return res.status(400).json({
          success: false,
          message: 'Formato inválido',
        });
      }

      const user = await prisma.user.findUnique({
        where: tipo === 'email' ? { email: emailOrPhone } : { telefono: emailOrPhone },
      });

      if (!user) {
        // Por seguridad, no revelamos si el usuario existe
        return res.json({
          success: true,
          message: 'Si el usuario existe, recibirá un código de recuperación',
        });
      }

      // Generar código OTP
      const codigo = await otpService.crearOtp(user.id, 'recuperacion', metodoVerificacion);

      // Enviar código
      let enviado = false;
      if (metodoVerificacion === 'email') {
        enviado = await emailService.enviarCodigoRecuperacion(user.email, user.nombre, codigo);
      } else {
        enviado = await smsService.enviarCodigoRecuperacion(user.telefono, user.nombre, codigo);
      }

      if (!enviado) {
        return res.status(500).json({
          success: false,
          message: 'Error al enviar código',
        });
      }

      return res.json({
        success: true,
        message: `Código de recuperación enviado a tu ${metodoVerificacion === 'email' ? 'correo' : 'teléfono'}`,
        data: {
          metodoVerificacion,
        },
      });
    } catch (error) {
      console.error('Error solicitando recuperación:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al procesar solicitud',
      });
    }
  }

  /**
 * Resetear contraseña (MODIFICADO - sin código)
 * POST /api/auth/reset-password
 */
async resetearPassword(req: Request, res: Response) {
  try {
    const { emailOrPhone, newPassword } = req.body;

    // Validar campos requeridos
    if (!emailOrPhone || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos',
      });
    }

    const tipo = validatorsUtil.identificarTipo(emailOrPhone);
    if (!tipo) {
      return res.status(400).json({
        success: false,
        message: 'Formato inválido',
      });
    }

    const user = await prisma.user.findUnique({
      where: tipo === 'email' ? { email: emailOrPhone } : { telefono: emailOrPhone },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Validar fortaleza de contraseña
    const validacionPassword = passwordUtil.validarFortaleza(newPassword);
    if (!validacionPassword.valida) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña no cumple con los requisitos',
        errores: validacionPassword.errores,
      });
    }

    // Hashear nueva contraseña
    const passwordHash = await passwordUtil.hash(newPassword);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        intentosFallidos: 0,
        bloqueadoHasta: null,
      },
    });

    return res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    console.error('Error reseteando contraseña:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al resetear contraseña',
    });
  }
}

  /**
 * Verificar código de recuperación (sin resetear password aún)
 * POST /api/auth/verify-reset-code
 */
async verificarCodigoRecuperacion(req: Request, res: Response) {
  try {
    const { emailOrPhone, codigo } = req.body;

    const tipo = validatorsUtil.identificarTipo(emailOrPhone);
    if (!tipo) {
      return res.status(400).json({
        success: false,
        message: 'Formato inválido',
      });
    }

    const user = await prisma.user.findUnique({
      where: tipo === 'email' ? { email: emailOrPhone } : { telefono: emailOrPhone },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Verificar código OTP (intentar con ambos canales)
    let codigoValido = await otpService.verificarOtp(user.id, codigo, 'recuperacion', 'email');
    if (!codigoValido) {
      codigoValido = await otpService.verificarOtp(user.id, codigo, 'recuperacion', 'sms');
    }

    if (!codigoValido) {
      return res.status(400).json({
        success: false,
        message: 'Código inválido o expirado',
      });
    }

    return res.json({
      success: true,
      message: 'Código verificado correctamente',
      data: {
        emailOrPhone: emailOrPhone,
      },
    });
  } catch (error) {
    console.error('Error verificando código:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar código',
    });
  }
}

  // ==================== REENVÍO DE CÓDIGOS ====================

  /**
   * Reenviar código de verificación
   * POST /api/auth/resend-code
   */
  async reenviarCodigo(req: Request, res: Response) {
    try {
      const { email, tipo, canal } = req.body; // tipo: 'registro' | 'login', canal: 'email' | 'sms'

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      // Verificar límite de reenvíos
      const intentosRecientes = await otpService.contarIntentosRecientes(user.id, 30);
      if (intentosRecientes >= 5) {
        return res.status(429).json({
          success: false,
          message: 'Demasiados intentos. Espera meida hora antes de solicitar otro código.',
        });
      }

      // Generar nuevo código
      const codigo = await otpService.crearOtp(user.id, tipo, canal);

      // Enviar código
      let enviado = false;
      if (canal === 'email') {
        if (tipo === 'registro') {
          enviado = await emailService.enviarCodigoRegistro(user.email, user.nombre, codigo);
        } else {
          enviado = await emailService.enviarCodigoLogin(user.email, user.nombre, codigo);
        }
      } else {
        if (tipo === 'registro') {
          enviado = await smsService.enviarCodigoRegistro(user.telefono, user.nombre, codigo);
        } else {
          enviado = await smsService.enviarCodigoLogin(user.telefono, user.nombre, codigo);
        }
      }

      if (!enviado) {
        return res.status(500).json({
          success: false,
          message: 'Error al reenviar código',
        });
      }

      return res.json({
        success: true,
        message: 'Código reenviado exitosamente',
      });
    } catch (error) {
      console.error('Error reenviando código:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al reenviar código',
      });
    }
  }

  // ==================== USUARIO ACTUAL ====================

  /**
   * Obtener información del usuario actual (requiere autenticación)
   * GET /api/auth/me
   */
  async obtenerUsuarioActual(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nombre: true,
          apellidos: true,
          email: true,
          telefono: true,
          rol: true,
          estado: true,
          verificadoEmail: true,
          verificadoSms: true,
          creadoEn: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener información del usuario',
      });
    }
  }

  // ==================== LOGOUT ====================

  /**
   * Cerrar sesión
   * POST /api/auth/logout
   */
  async logout(req: AuthRequest, res: Response) {
    try {
      // Aquí podrías invalidar el token en una blacklist si lo deseas
      // Por ahora solo enviamos respuesta de éxito
      return res.json({
        success: true,
        message: 'Sesión cerrada exitosamente',
      });
    } catch (error) {
      console.error('Error en logout:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión',
      });
    }
  }
}

export default new AuthController();