import { Request, Response, NextFunction } from 'express';
import validatorsUtil from '../utils/validators.util';
import passwordUtil from '../utils/password.util';

/**
 * Valida el body de registro
 */
export const validarRegistro = (req: Request, res: Response, next: NextFunction) => {
  const { nombre, apellidos, email, telefono, password, confirmPassword } = req.body;

  // Validar campos requeridos
  const camposRequeridos = [
    { valor: nombre, nombre: 'nombre' },
    { valor: apellidos, nombre: 'apellidos' },
    { valor: email, nombre: 'email' },
    { valor: telefono, nombre: 'telefono' },
    { valor: password, nombre: 'password' },
    { valor: confirmPassword, nombre: 'confirmPassword' },
  ];

  for (const campo of camposRequeridos) {
    const resultado = validatorsUtil.campoRequerido(campo.valor, campo.nombre);
    if (!resultado.valido) {
      return res.status(400).json({
        success: false,
        message: resultado.error,
      });
    }
  }

  // Validar formato de nombre
  if (!validatorsUtil.validarNombre(nombre)) {
    return res.status(400).json({
      success: false,
      message: 'El nombre solo debe contener letras',
    });
  }

  if (!validatorsUtil.validarNombre(apellidos)) {
    return res.status(400).json({
      success: false,
      message: 'Los apellidos solo deben contener letras',
    });
  }

  // Validar email
  if (!validatorsUtil.validarEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'El formato del email no es válido',
    });
  }

  // Validar teléfono
  if (!validatorsUtil.validarTelefono(telefono)) {
    return res.status(400).json({
      success: false,
      message: 'El teléfono debe incluir código de país (ej: +521234567890)',
    });
  }

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Las contraseñas no coinciden',
    });
  }

  // Validar fortaleza de contraseña
  const validacionPassword = passwordUtil.validarFortaleza(password);
  if (!validacionPassword.valida) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña no cumple con los requisitos',
      errores: validacionPassword.errores,
    });
  }

  next();
};

/**
 * Valida el body de login
 */
export const validarLogin = (req: Request, res: Response, next: NextFunction) => {
  const { emailOrPhone, password, metodoVerificacion } = req.body;

  // Validar campos requeridos
  if (!emailOrPhone || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email/teléfono y contraseña son requeridos',
    });
  }

  // Validar método de verificación
  if (!metodoVerificacion || !['email', 'sms'].includes(metodoVerificacion)) {
    return res.status(400).json({
      success: false,
      message: 'Método de verificación inválido. Debe ser "email" o "sms"',
    });
  }

  // Validar formato de email o teléfono
  const tipo = validatorsUtil.identificarTipo(emailOrPhone);
  if (!tipo) {
    return res.status(400).json({
      success: false,
      message: 'El formato de email o teléfono no es válido',
    });
  }

  next();
};

/**
 * Valida código OTP
 */
export const validarCodigoOtp = (req: Request, res: Response, next: NextFunction) => {
  const { codigo } = req.body;

  if (!codigo) {
    return res.status(400).json({
      success: false,
      message: 'El código es requerido',
    });
  }

  if (!validatorsUtil.validarCodigoOtp(codigo)) {
    return res.status(400).json({
      success: false,
      message: 'El código debe ser de 6 dígitos',
    });
  }

  next();
};
/**
 * Valida solicitud de recuperación de contraseña
 */
export const validarSolicitudRecuperacion = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { emailOrPhone, metodoVerificacion } = req.body;

  if (!emailOrPhone) {
    return res.status(400).json({
      success: false,
      message: 'Email o teléfono es requerido',
    });
  }

  if (!metodoVerificacion || !['email', 'sms'].includes(metodoVerificacion)) {
    return res.status(400).json({
      success: false,
      message: 'Método de verificación inválido',
    });
  }

  const tipo = validatorsUtil.identificarTipo(emailOrPhone);
  if (!tipo) {
    return res.status(400).json({
      success: false,
      message: 'Formato inválido',
    });
  }

  next();
};

/**
 * Valida reset de contraseña
 */
export const validarResetPassword = (req: Request, res: Response, next: NextFunction) => {
  const { emailOrPhone, codigo, newPassword, confirmPassword } = req.body;

  if (!emailOrPhone || !codigo || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos',
    });
  }

  if (!validatorsUtil.validarCodigoOtp(codigo)) {
    return res.status(400).json({
      success: false,
      message: 'Código inválido',
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Las contraseñas no coinciden',
    });
  }

  const validacionPassword = passwordUtil.validarFortaleza(newPassword);
  if (!validacionPassword.valida) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña no cumple con los requisitos',
      errores: validacionPassword.errores,
    });
  }

  next();
};