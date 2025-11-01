class ValidatorsUtil {
  /**
   * Valida formato de email
   */
  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Valida formato de teléfono (debe incluir código de país)
   * Ejemplo: +521234567890, +14155552671
   */
  validarTelefono(telefono: string): boolean {
    const regex = /^\+[1-9]\d{1,14}$/;
    return regex.test(telefono);
  }

  /**
   * Valida que el nombre no contenga números o caracteres especiales
   */
  validarNombre(nombre: string): boolean {
    const regex = /^[a-záéíóúñü\s]+$/i;
    return regex.test(nombre) && nombre.trim().length >= 2;
  }

  /**
   * Valida código OTP (6 dígitos)
   */
  validarCodigoOtp(codigo: string): boolean {
    const regex = /^\d{6}$/;
    return regex.test(codigo);
  }

  /**
   * Sanitiza una cadena de texto (elimina espacios extra, etc.)
   */
  sanitizarTexto(texto: string): string {
    return texto.trim().replace(/\s+/g, ' ');
  }

  /**
   * Valida que un campo no esté vacío
   */
  campoRequerido(valor: any, nombreCampo: string): { valido: boolean; error?: string } {
    if (valor === undefined || valor === null || valor === '') {
      return {
        valido: false,
        error: `El campo ${nombreCampo} es requerido`,
      };
    }
    return { valido: true };
  }

  /**
   * Valida longitud mínima y máxima de un campo
   */
  validarLongitud(
    valor: string,
    nombreCampo: string,
    min: number,
    max: number
  ): { valido: boolean; error?: string } {
    if (valor.length < min) {
      return {
        valido: false,
        error: `${nombreCampo} debe tener al menos ${min} caracteres`,
      };
    }
    if (valor.length > max) {
      return {
        valido: false,
        error: `${nombreCampo} no puede tener más de ${max} caracteres`,
      };
    }
    return { valido: true };
  }

  /**
   * Determina si un string es email o teléfono
   */
  identificarTipo(emailOrPhone: string): 'email' | 'telefono' | null {
    if (this.validarEmail(emailOrPhone)) {
      return 'email';
    }
    if (this.validarTelefono(emailOrPhone)) {
      return 'telefono';
    }
    return null;
  }
}

export default new ValidatorsUtil();