import rateLimit from 'express-rate-limit';

/**
 * Rate limiter general para endpoints de autenticación
 * Máximo 5 intentos por 15 minutos
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 requests
  message: {
    success: false,
    message: 'Demasiados intentos. Por favor intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter estricto para login
 * Máximo 3 intentos por 15 minutos
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Por favor intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Usar IP + email para el rate limit
  keyGenerator: (req) => {
    return `${req.ip}-${req.body.emailOrPhone || ''}`;
  },
});

/**
 * Rate limiter para envío de códigos OTP
 * Máximo 3 envíos por hora
 */
export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,
  message: {
    success: false,
    message: 'Has alcanzado el límite de envío de códigos. Intenta en 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `${req.ip}-${req.body.email || req.body.telefono || req.body.emailOrPhone || ''}`;
  },
});

/**
 * Rate limiter para registro
 * Máximo 3 registros por hora desde la misma IP
 */
export const registroLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Demasiados intentos de registro. Intenta de nuevo en 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});