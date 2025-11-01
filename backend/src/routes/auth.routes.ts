import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { verificarToken } from '../middlewares/auth.middleware';
import {
  validarRegistro,
  validarLogin,
  validarCodigoOtp,
  validarSolicitudRecuperacion,
  validarResetPassword,
} from '../middlewares/validation.middleware';
import {
  registroLimiter,
  loginLimiter,
  otpLimiter,
  authLimiter,
} from '../middlewares/rateLimiter.middleware';

const router: Router = Router();

// ==================== REGISTRO ====================
router.post(
  '/register',
  registroLimiter,
  validarRegistro,
  authController.registrar
);

router.post(
  '/verify-email',
  authLimiter,
  validarCodigoOtp,
  authController.verificarEmail
);

router.post(
  '/verify-phone',
  authLimiter,
  validarCodigoOtp,
  authController.verificarTelefono
);

// ==================== LOGIN ====================
router.post(
  '/login',
  loginLimiter,
  validarLogin,
  authController.login
);

router.post(
  '/login/verify-otp',
  authLimiter,
  validarCodigoOtp,
  authController.verificarOtpLogin
);

// ==================== RECUPERACIÓN ====================
router.post(
  '/forgot-password',
  authLimiter,
  validarSolicitudRecuperacion,
  authController.solicitarRecuperacion
);

// NUEVA RUTA - Verificar código
router.post(
  '/verify-reset-code',
  authLimiter,
  validarCodigoOtp,
  authController.verificarCodigoRecuperacion
);

// RUTA MODIFICADA - Reset password (sin código)
router.post(
  '/reset-password',
  authLimiter,
  authController.resetearPassword
);

// ==================== REENVÍO DE CÓDIGOS ====================
router.post(
  '/resend-code',
  otpLimiter,
  authController.reenviarCodigo
);

// ==================== RUTAS PROTEGIDAS ====================
router.get(
  '/me',
  verificarToken,
  authController.obtenerUsuarioActual
);

router.post(
  '/logout',
  verificarToken,
  authController.logout
);


export default router;