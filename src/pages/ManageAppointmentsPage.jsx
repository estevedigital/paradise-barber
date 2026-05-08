import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Chip, Skeleton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../store/AuthContext';
import bookingService from '../services/bookingService';
import BottomNav from '../components/BottomNav';

const STATUS_CONFIG = {
  CONFIRMADA: { color: '#ffffff', bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.3)' },
  PENDIENTE: { color: '#e0e0e0', bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.3)' },
  CANCELADA: { color: '#ffffff', bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.3)' },
};

// SVG scissors empty state
function ScissorsIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pivot */}
      <circle cx="60" cy="60" r="5" fill="#ffffff" opacity="0.6" />
      {/* Blade 1 */}
      <path d="M60 60 L20 30" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 60 L15 50" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="13" cy="42" rx="7" ry="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
      {/* Blade 2 */}
      <path d="M60 60 L100 30" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 60 L105 50" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="107" cy="42" rx="7" ry="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
      {/* Lower blades */}
      <path d="M60 60 L30 95" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 60 L90 95" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round" />
      {/* Decoration */}
      <circle cx="60" cy="60" r="25" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="60" cy="60" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="6 6" />
    </svg>
  );
}

// ── AppointmentCard ────────────────────────────────────────────────
function AppointmentCard({ appointment, onEdit, onDelete, index }) {
  const cfg = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.PENDIENTE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Box
        sx={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.06)',
          borderLeft: `3px solid ${cfg.color}`,
          borderRadius: 2,
          p: 2,
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
          transition: 'border-color 0.2s',
          '&:hover': { borderLeftColor: cfg.color, borderColor: 'rgba(255,255,255,0.1)' },
        }}
      >
        {/* Date column */}
        <Box
          sx={{
            textAlign: 'center',
            minWidth: 54,
            background: `${cfg.bg}`,
            border: `1px solid ${cfg.border}`,
            borderRadius: 1.5,
            py: 1,
            px: 0.5,
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: '2rem',
              lineHeight: 1,
              color: cfg.color,
            }}
          >
            {format(parseISO(appointment.date), 'd')}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {format(parseISO(appointment.date), 'MMM', { locale: es })}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            {format(parseISO(appointment.date), 'yyyy')}
          </Typography>
        </Box>

        {/* Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: '1.2rem',
              letterSpacing: '0.04em',
              lineHeight: 1.2,
              mb: 0.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {appointment.service}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.85rem',
              color: '#ffffff',
              mb: 1,
            }}
          >
            {appointment.time}
            <Box component="span" sx={{ color: 'rgba(255,255,255,0.3)', mx: 0.5 }}>·</Box>
            <Box component="span" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
              {appointment.duration}min
            </Box>
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label={appointment.status}
              size="small"
              sx={{
                background: cfg.bg,
                color: cfg.color,
                border: `1px solid ${cfg.border}`,
                fontSize: '0.65rem',
                height: 22,
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            />
            <Chip
              label={`${appointment.price}€`}
              size="small"
              sx={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          </Box>
        </Box>

        {/* Actions */}
        {appointment.status !== 'CANCELADA' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
            <IconButton
              size="small"
              onClick={() => onEdit(appointment)}
              sx={{
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 1,
                p: 0.75,
                '&:hover': { color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(appointment)}
              sx={{
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 1,
                p: 0.75,
                '&:hover': { color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)' },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

// ── ManageAppointmentsPage ─────────────────────────────────────────
function ManageAppointmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadAppointments = useCallback(() => {
    if (!user?.phone) return;
    const all = bookingService.getByPhone(user.phone).sort(
      (a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)
    );
    setAppointments(all);
  }, [user]);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  const handleEdit = (appt) => {
    navigate('/booking', { state: { editAppointment: appt } });
  };

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    bookingService.remove(deleteTarget.id);
    setDeleteTarget(null);
    loadAppointments();
    setSnackbar({ open: true, message: 'Cita eliminada correctamente.', severity: 'success' });
  }, [deleteTarget, loadAppointments]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0a0a0a',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 50%)',
        pb: { xs: 10, md: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 1,
            p: 0.75,
            '&:hover': { color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' },
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box>
          <Typography variant="overline" sx={{ color: '#ffffff', letterSpacing: '0.18em', fontSize: '0.65rem' }}>
            PARADISE BARBER
          </Typography>
          <Typography variant="h4" sx={{ fontSize: '1.6rem', lineHeight: 1 }}>
            MIS CITAS
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          height: 1,
          mx: { xs: 2, sm: 3 },
          background: 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.05) 100%)',
          mb: 3,
          boxShadow: '0 0 6px rgba(255,255,255,0.3)',
        }}
      />

      <Box sx={{ px: { xs: 2, sm: 3 }, maxWidth: 640, mx: 'auto' }}>
        {/* Loading */}
        {appointments === null && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" height={110} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        )}

        {/* List */}
        {appointments !== null && appointments.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace" }}>
                {appointments.length} CITA{appointments.length !== 1 ? 'S' : ''}
              </Typography>
              <Button variant="outlined" size="small" onClick={() => navigate('/booking')} sx={{ fontSize: '0.8rem', py: 0.5 }}>
                + NUEVA
              </Button>
            </Box>
            <AnimatePresence>
              {appointments.map((appt, idx) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  index={idx}
                  onEdit={handleEdit}
                  onDelete={(a) => setDeleteTarget(a)}
                />
              ))}
            </AnimatePresence>
          </Box>
        )}

        {/* Empty state */}
        {appointments !== null && appointments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Box sx={{ mb: 3, opacity: 0.6 }}>
                <ScissorsIllustration />
              </Box>
              <Typography variant="h4" sx={{ fontSize: '1.6rem', mb: 1 }}>
                SIN CITAS
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', mb: 4, fontSize: '0.9rem' }}>
                Aún no tienes citas registradas. ¡Reserva ahora!
              </Typography>
              <Button variant="contained" onClick={() => navigate('/booking')}>
                HACER UNA RESERVA
              </Button>
            </Box>
          </motion.div>
        )}
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>¿Eliminar cita?</DialogTitle>
        <DialogContent>
          {deleteTarget && (
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              Se eliminará tu cita de{' '}
              <Box component="span" sx={{ color: '#ffffff', fontWeight: 600 }}>
                {deleteTarget.service}
              </Box>{' '}
              el{' '}
              <Box component="span" sx={{ color: '#ffffff' }}>
                {format(parseISO(deleteTarget.date), "d 'de' MMMM", { locale: es })}
              </Box>{' '}
              a las{' '}
              <Box component="span" sx={{ fontFamily: "'JetBrains Mono', monospace", color: '#ffffff' }}>
                {deleteTarget.time}
              </Box>
              . Esta acción no se puede deshacer.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="text" onClick={() => setDeleteTarget(null)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleDeleteConfirm} color="error">
            ELIMINAR
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <BottomNav />
    </Box>
  );
}

export default ManageAppointmentsPage;
