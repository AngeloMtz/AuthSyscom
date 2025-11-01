// frontend/lib/auth.ts

import { apiClient } from './api';
import {
  ApiResponse,
  RegisterFormData,
  LoginFormData,
  VerifyCodeFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  User,
} from '@/types/auth';

// ==================== REGISTRO ====================

export const registrarUsuario = async (data: RegisterFormData): Promise<ApiResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const verificarEmail = async (
  email: string,
  codigo: string
): Promise<ApiResponse> => {
  const response = await apiClient.post('/auth/verify-email', { email, codigo });
  return response.data;
};

export const verificarTelefono = async (
  email: string,
  codigo: string
): Promise<ApiResponse> => {
  const response = await apiClient.post('/auth/verify-phone', { email, codigo });
  return response.data;
};

// ==================== LOGIN ====================

export const iniciarSesion = async (data: LoginFormData): Promise<ApiResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

export const verificarOtpLogin = async (
  emailOrPhone: string,
  codigo: string,
  metodoVerificacion: 'email' | 'sms'
): Promise<ApiResponse> => {
  const response = await apiClient.post('/auth/login/verify-otp', {
    emailOrPhone,
    codigo,
    metodoVerificacion,
  });
  return response.data;
};

// ==================== RECUPERACIÓN ====================

export const solicitarRecuperacion = async (
  data: ForgotPasswordFormData
): Promise<ApiResponse> => {
  const response = await apiClient.post('/auth/forgot-password', data);
  return response.data;
};

export const resetearPassword = async (
  emailOrPhone: string,
  newPassword: string
): Promise<ApiResponse> => {
  const response = await apiClient.post('/auth/reset-password', {
    emailOrPhone,
    newPassword,
  });
  return response.data;
};

// ==================== REENVÍO DE CÓDIGOS ====================

export const reenviarCodigo = async (
  email: string,
  tipo: 'registro' | 'login',
  canal: 'email' | 'sms'
): Promise<ApiResponse> => {
  const response = await apiClient.post('/auth/resend-code', {
    email,
    tipo,
    canal,
  });
  return response.data;
};

// ==================== USUARIO ACTUAL ====================

export const obtenerUsuarioActual = async (): Promise<ApiResponse<User>> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// ==================== LOGOUT ====================

export const cerrarSesion = async (): Promise<ApiResponse> => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};