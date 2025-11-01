import { Request } from 'express';

// Tipos de OTP
export type OtpTipo = 'registro' | 'login' | 'recuperacion';
export type OtpCanal = 'email' | 'sms';

// Tipos de respuesta
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Usuario autenticado en request
export interface AuthRequest extends Request {
  userId?: number;
  user?: {
    id: number;
    email: string;
    nombre: string;
    apellidos: string;
    rol: string;
  };
}

// DTOs para registro
export interface RegistroDTO {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
}

// DTOs para login
export interface LoginDTO {
  emailOrPhone: string;
  password: string;
  metodoVerificacion: 'email' | 'sms';
}

export interface VerificarOtpDTO {
  emailOrPhone: string;
  codigo: string;
  tipo: OtpTipo;
}

// DTOs para recuperación
export interface SolicitarRecuperacionDTO {
  emailOrPhone: string;
  metodoVerificacion: 'email' | 'sms';
}

export interface ResetPasswordDTO {
  emailOrPhone: string;
  codigo: string;
  newPassword: string;
  confirmPassword: string;
}

// Payload JWT
export interface JwtPayload {
  userId: number;
  email: string;
  rol: string;
  iat?: number; // issued at (agregado automáticamente por JWT)
  exp?: number; // expiration time (agregado automáticamente por JWT)
}