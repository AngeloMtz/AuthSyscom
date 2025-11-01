import bcrypt from 'bcrypt';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

class PasswordUtil {
  /**
   * Hashea una contraseña usando bcrypt
   */
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compara una contraseña con su hash
   */
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Valida que la contraseña cumpla con los requisitos:
   * - Mínimo 8 caracteres
   * - Al menos 1 mayúscula
   * - Al menos 1 número
   * - Al menos 1 carácter especial
   */
  validarFortaleza(password: string): { valida: boolean; errores: string[] } {
    const errores: string[] = [];

    if (password.length < 8) {
      errores.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errores.push('La contraseña debe contener al menos una letra mayúscula');
    }

    if (!/[0-9]/.test(password)) {
      errores.push('La contraseña debe contener al menos un número');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errores.push('La contraseña debe contener al menos un carácter especial');
    }

    return {
      valida: errores.length === 0,
      errores,
    };
  }
}

export default new PasswordUtil();