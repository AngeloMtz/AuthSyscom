import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import jwtUtil from '../utils/jwt.util';
import prisma from '../config/database';

/**
 * Middleware para proteger rutas que requieren autenticación
 */
export const verificarToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar token
    const payload = jwtUtil.verificarToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellidos: true,
        rol: true,
        estado: true,
        bloqueadoHasta: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    if (user.estado !== 'activo') {
      return res.status(403).json({
        success: false,
        message: 'Cuenta no activa',
      });
    }

    // Verificar si la cuenta está bloqueada
    if (user.bloqueadoHasta && user.bloqueadoHasta > new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Cuenta temporalmente bloqueada',
        bloqueadoHasta: user.bloqueadoHasta,
      });
    }

    // Agregar información del usuario al request
    req.userId = user.id;
    req.user = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellidos: user.apellidos,
      rol: user.rol,
    };

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar autenticación',
    });
  }
};

/**
 * Middleware para verificar roles específicos
 */
export const verificarRol = (rolesPermitidos: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
      });
    }

    next();
  };
};