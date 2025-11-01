// Tipos de usuario
export interface User {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  rol: string;
  estado?: string;
  verificadoEmail?: boolean;
  verificadoSms?: boolean;
}

// Respuesta de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errores?: string[];
}

// DTOs para formularios
export interface RegisterFormData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  emailOrPhone: string;
  password: string;
  metodoVerificacion: 'email' | 'sms';
}

export interface VerifyCodeFormData {
  codigo: string;
}

export interface ForgotPasswordFormData {
  emailOrPhone: string;
  metodoVerificacion: 'email' | 'sms';
}

export interface ResetPasswordFormData {
  codigo: string;
  newPassword: string;
  confirmPassword: string;
}

// Estado de autenticación
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Datos temporales durante el flujo
  tempEmail: string | null;
  tempUserId: number | null;
  tempMetodoVerificacion: 'email' | 'sms' | null;
  
  // Acciones
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setTempData: (email: string, userId: number) => void;
  setTempMetodo: (metodo: 'email' | 'sms') => void;
  clearTempData: () => void;
  logout: () => void;
}