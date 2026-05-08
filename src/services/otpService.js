/**
 * OTP Service — Mock OTP with rate limiting
 */

const OTP_CODE = '123456';
const OTP_STORAGE_KEY = 'paradise_otp_data';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const OTP_EXPIRY_MS = 2 * 60 * 1000; // 2 minutes

function getOTPData(phone) {
  try {
    const raw = localStorage.getItem(OTP_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data[phone] || null;
  } catch {
    return null;
  }
}

function saveOTPData(phone, data) {
  try {
    const raw = localStorage.getItem(OTP_STORAGE_KEY);
    const allData = raw ? JSON.parse(raw) : {};
    allData[phone] = data;
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(allData));
  } catch {
    // ignore
  }
}

/**
 * Send OTP to phone (mock — always 123456)
 * @param {string} phone
 * @returns {{ success: boolean, message: string, lockedUntil?: number }}
 */
export function sendOTP(phone) {
  const existing = getOTPData(phone);

  if (existing?.lockedUntil && Date.now() < existing.lockedUntil) {
    const remaining = Math.ceil((existing.lockedUntil - Date.now()) / 1000 / 60);
    return {
      success: false,
      message: `Cuenta bloqueada. Inténtalo en ${remaining} minuto${remaining > 1 ? 's' : ''}.`,
      lockedUntil: existing.lockedUntil,
    };
  }

  saveOTPData(phone, {
    code: OTP_CODE,
    sentAt: Date.now(),
    attempts: 0,
    lockedUntil: null,
  });

  console.info(`[OTP Mock] Código para ${phone}: ${OTP_CODE}`);

  return { success: true, message: 'Código enviado correctamente.' };
}

/**
 * Verify OTP code
 * @param {string} phone
 * @param {string} code
 * @returns {{ valid: boolean, message: string, attemptsLeft?: number, lockedUntil?: number }}
 */
export function verifyOTP(phone, code) {
  const data = getOTPData(phone);

  if (!data) {
    return { valid: false, message: 'No hay código activo. Solicita uno nuevo.' };
  }

  if (data.lockedUntil && Date.now() < data.lockedUntil) {
    const remaining = Math.ceil((data.lockedUntil - Date.now()) / 1000 / 60);
    return {
      valid: false,
      message: `Bloqueado por ${remaining} minuto${remaining > 1 ? 's' : ''}.`,
      lockedUntil: data.lockedUntil,
    };
  }

  if (Date.now() - data.sentAt > OTP_EXPIRY_MS) {
    return { valid: false, message: 'El código ha expirado. Solicita uno nuevo.' };
  }

  const newAttempts = data.attempts + 1;

  if (code !== data.code) {
    if (newAttempts >= MAX_ATTEMPTS) {
      const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      saveOTPData(phone, { ...data, attempts: newAttempts, lockedUntil });
      return {
        valid: false,
        message: 'Demasiados intentos. Cuenta bloqueada 5 minutos.',
        lockedUntil,
      };
    }

    saveOTPData(phone, { ...data, attempts: newAttempts });
    const attemptsLeft = MAX_ATTEMPTS - newAttempts;
    return {
      valid: false,
      message: `Código incorrecto. ${attemptsLeft} intento${attemptsLeft !== 1 ? 's' : ''} restante${attemptsLeft !== 1 ? 's' : ''}.`,
      attemptsLeft,
    };
  }

  // Valid — clear OTP data
  saveOTPData(phone, null);
  return { valid: true, message: 'Verificación exitosa.' };
}

/**
 * Check OTP lock status
 * @param {string} phone
 * @returns {{ locked: boolean, lockedUntil?: number }}
 */
export function checkLockStatus(phone) {
  const data = getOTPData(phone);
  if (data?.lockedUntil && Date.now() < data.lockedUntil) {
    return { locked: true, lockedUntil: data.lockedUntil };
  }
  return { locked: false };
}
