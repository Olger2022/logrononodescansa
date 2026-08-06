export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates full name (Nombre y Apellido).
 * Must contain at least 5 characters, only letters, accents, spaces and hyphens, and at least 2 words.
 */
export const validateName = (name: string): ValidationResult => {
  const trimmed = name ? name.trim() : '';
  if (!trimmed) {
    return { isValid: false, error: 'El nombre y apellido son obligatorios.' };
  }
  if (trimmed.length < 5) {
    return { isValid: false, error: 'El nombre debe tener al menos 5 caracteres.' };
  }
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: 'El nombre solo debe contener letras y espacios.' };
  }
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 2) {
    return { isValid: false, error: 'Ingrese al menos un nombre y un apellido (ej. María Shakaim).' };
  }
  return { isValid: true };
};

/**
 * Validates Ecuadorian Cedula de Ciudadanía using Modulo 10 algorithm.
 */
export const validateEcuadorianCedula = (cedula: string): ValidationResult => {
  if (!cedula) {
    return { isValid: false, error: 'La cédula de ciudadanía es requerida.' };
  }
  const clean = cedula.replace(/\D/g, '');
  if (clean.length !== 10) {
    return { isValid: false, error: 'La cédula debe contener exactamente 10 dígitos numéricos.' };
  }

  // Province validation (01 - 24, or 30 for foreigner registration)
  const province = parseInt(clean.substring(0, 2), 10);
  if ((province < 1 || province > 24) && province !== 30) {
    return { isValid: false, error: 'Código de provincia de Ecuador no válido (01 a 24).' };
  }

  // Third digit check (< 6 for natural persons)
  const thirdDigit = parseInt(clean.substring(2, 3), 10);
  if (thirdDigit >= 6) {
    return { isValid: false, error: 'El 3er dígito debe ser menor a 6 para personas naturales.' };
  }

  // Modulo 10 check
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let val = parseInt(clean[i], 10) * coefficients[i];
    if (val >= 10) val -= 9;
    sum += val;
  }

  const remainder = sum % 10;
  const verifierDigit = remainder === 0 ? 0 : 10 - remainder;
  const lastDigit = parseInt(clean[9], 10);

  if (verifierDigit !== lastDigit) {
    return { isValid: false, error: 'Cédula no válida (dígito verificador incorrecto).' };
  }

  return { isValid: true };
};

/**
 * Validates Ecuadorian phone number.
 * Accepts:
 * - Mobile: 10 digits starting with '09' (e.g. 0984712039)
 * - Landline: 9 digits starting with '0' (e.g. 072700100)
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: 'El teléfono de contacto es obligatorio.' };
  }
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10 && clean.startsWith('09')) {
    return { isValid: true };
  }
  if (clean.length === 9 && clean.startsWith('0')) {
    return { isValid: true };
  }
  return { isValid: false, error: 'Formato de teléfono no válido (10 dígitos para celular: 09... o 9 para fijo: 07...).' };
};

/**
 * Validates standard email address.
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'El correo electrónico es obligatorio.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Ingrese un correo electrónico válido (ejemplo@dominio.com).' };
  }
  return { isValid: true };
};
