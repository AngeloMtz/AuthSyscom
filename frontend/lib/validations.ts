import { z } from 'zod';

// Validación de contraseña
const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Debe contener al menos un carácter especial');

// Validación de teléfono (formato internacional)
const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, 'El teléfono debe incluir código de país (ej: +521234567890)');

// ==================== REGISTRO ====================
export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .regex(/^[a-záéíóúñü\s]+$/i, 'El nombre solo debe contener letras'),
    apellidos: z
      .string()
      .min(2, 'Los apellidos deben tener al menos 2 caracteres')
      .regex(/^[a-záéíóúñü\s]+$/i, 'Los apellidos solo deben contener letras'),
    email: z.string().email('Email inválido'),
    telefono: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// ==================== LOGIN ====================
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Este campo es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
  metodoVerificacion: z.enum(['email', 'sms'], {
    required_error: 'Selecciona un método de verificación',
  }),
});

// ==================== VERIFICAR CÓDIGO ====================
export const verifyCodeSchema = z.object({
  codigo: z
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d{6}$/, 'El código debe ser numérico'),
});

// ==================== RECUPERACIÓN ====================
export const forgotPasswordSchema = z.object({
  emailOrPhone: z.string().min(1, 'Este campo es requerido'),
  metodoVerificacion: z.enum(['email', 'sms'], {
    required_error: 'Selecciona un método de verificación',
  }),
});

export const resetPasswordSchema = z
  .object({
    codigo: z
      .string()
      .length(6, 'El código debe tener 6 dígitos')
      .regex(/^\d{6}$/, 'El código debe ser numérico'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// Tipos inferidos de los schemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;