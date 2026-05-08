/**
 * Booking Service — localStorage mock database
 * Cada cita: id, userId, clientName, phone, service, date, time, duration, price, status, createdAt
 */

const STORAGE_KEY = 'paradise_barber_appointments';

/**
 * Normaliza número de teléfono español a formato +34XXXXXXXXX
 * @param {string} phone
 * @returns {string}
 */
export function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('34') && digits.length === 11) return `+${digits}`;
  if (digits.length === 9) return `+34${digits}`;
  return `+34${digits}`;
}

/**
 * @returns {Array} All appointments
 */
function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * @param {Array} appointments
 */
function saveAll(appointments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

/**
 * Get appointments by phone number
 * @param {string} phone - normalized phone
 * @returns {Array}
 */
function getByPhone(phone) {
  const normalized = normalizePhone(phone);
  return getAll().filter((a) => a.phone === normalized || a.userId === normalized);
}

/**
 * Get appointments by date (YYYY-MM-DD)
 * @param {string} date
 * @returns {Array}
 */
function getByDate(date) {
  return getAll().filter((a) => a.date === date);
}

/**
 * Check if a time slot is available for a given date
 * @param {string} date - YYYY-MM-DD
 * @param {string} time - HH:MM
 * @param {string} [excludeId] - appointment id to exclude (for edits)
 * @returns {boolean}
 */
function isSlotAvailable(date, time, excludeId = null) {
  const appointments = getByDate(date);
  return !appointments.some((a) => a.time === time && a.id !== excludeId && a.status !== 'CANCELADA');
}

/**
 * Create a new appointment
 * @param {Object} data
 * @returns {Object} created appointment
 */
function create(data) {
  const appointments = getAll();
  const appointment = {
    id: crypto.randomUUID(),
    userId: normalizePhone(data.phone),
    clientName: data.clientName.trim(),
    phone: normalizePhone(data.phone),
    service: data.service,
    date: data.date,
    time: data.time,
    duration: data.duration,
    price: data.price,
    status: 'PENDIENTE',
    createdAt: new Date().toISOString(),
  };
  appointments.push(appointment);
  saveAll(appointments);
  return appointment;
}

/**
 * Update an existing appointment
 * @param {string} id
 * @param {Object} updates
 * @returns {Object|null}
 */
function update(id, updates) {
  const appointments = getAll();
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  appointments[idx] = { ...appointments[idx], ...updates, updatedAt: new Date().toISOString() };
  saveAll(appointments);
  return appointments[idx];
}

/**
 * Delete an appointment by id
 * @param {string} id
 * @returns {boolean}
 */
function remove(id) {
  const appointments = getAll();
  const filtered = appointments.filter((a) => a.id !== id);
  if (filtered.length === appointments.length) return false;
  saveAll(filtered);
  return true;
}

/**
 * Get the next upcoming appointment for a phone
 * @param {string} phone
 * @returns {Object|null}
 */
function getNextAppointment(phone) {
  const now = new Date();
  const upcoming = getByPhone(phone)
    .filter((a) => {
      const apptDate = new Date(`${a.date}T${a.time}`);
      return apptDate >= now && a.status !== 'CANCELADA';
    })
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  return upcoming[0] || null;
}

const bookingService = {
  getAll,
  getByPhone,
  getByDate,
  create,
  update,
  remove,
  isSlotAvailable,
  getNextAppointment,
  normalizePhone,
};

export default bookingService;
