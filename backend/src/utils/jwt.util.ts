import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secret_super_seguro';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

class JwtUtil {
  /**
   * Genera un token JWT
   */
  generarToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as any,
    };

    return jwt.sign(payload, JWT_SECRET, options);
  }

  /**
   * Verifica y decodifica un token JWT
   */
  verificarToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Decodifica un token sin verificar (útil para debugging)
   */
  decodificarToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica si un token está expirado
   */
  estaExpirado(token: string): boolean {
    const decoded = this.decodificarToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    return Date.now() >= decoded.exp * 1000;
  }
}

export default new JwtUtil();