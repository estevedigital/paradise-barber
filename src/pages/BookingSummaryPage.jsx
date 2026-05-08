import React, { useState } from 'react';
import {
  Box, Typography, Button, Divider, IconButton,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import EuroIcon from '@mui/icons-material/Euro';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import bookingService from '../services/bookingService';

function SummaryRow({ icon, label, value, mono = false }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25 }}>
      <Box sx={{ color: 'rgba(255,255,255,0.6)', display: 'flex', flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace", mb: 0.25 }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.95rem',
            color: '#ffffff',
            fontFamily: mono ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
            fontWeight: mono ? 600 : 400,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

// Checkmark animation
function CheckmarkAnimation({ onDone }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        onAnimationComplete={onDone}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            border: '2px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(255,255,255,0.4)',
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <motion.path
              d="M10 30 L24 44 L50 16"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 }}
            />
          </svg>
        </Box>
      </motion.div>
    </Box>
  );
}

function BookingSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, date, time, clientName, phone, editId } = location.state || {};

  const [confirming, setConfirming] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  if (!service || !date || !time) {
    navigate('/booking');
    return null;
  }

  const formattedDate = format(parseISO(date + 'T00:00:00'), "EEEE d 'de' MMMM yyyy", { locale: es });

  const handleConfirm = async () => {
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 400));

    let appointmentId;
    if (editId) {
      const updated = bookingService.update(editId, {
        service: service.name,
        date,
        time,
        duration: service.duration,
        price: service.price,
        status: 'PENDIENTE',
      });
      appointmentId = updated?.id;
    } else {
      const created = bookingService.create({
        clientName,
        phone,
        service: service.name,
        date,
        time,
        duration: service.duration,
        price: service.price,
      });
      appointmentId = created?.id;
    }

    setShowCheckmark(true);
    setTimeout(() => {
      navigate('/booking/confirmation', {
        state: { service, date, time, clientName, phone, appointmentId },
        replace: true,
      });
    }, 1200);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0a0a0a',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 55%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {showCheckmark && (
        <CheckmarkAnimation onDone={() => {}} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 480 }}
      >
        {/* Title */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="overline" sx={{ color: '#ffffff', mb: 0.5, display: 'block', letterSpacing: '0.2em' }}>
            PARADISE BARBER
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem' } }}>
            {editId ? 'MODIFICAR CITA' : 'RESUMEN DE RESERVA'}
          </Typography>
        </Box>

        {/* Summary card */}
        <Box
          sx={{
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 2.5,
          }}
        >
          {/* Card header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.15)',
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 1.5,
                background: 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
              }}
            >
              {service.icon}
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontSize: '1.4rem', lineHeight: 1 }}>
                {service.name}
              </Typography>
              <Typography sx={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700 }}>
                {service.price}€
              </Typography>
            </Box>
          </Box>

          {/* Details */}
          <Box sx={{ px: 2.5 }}>
            <SummaryRow icon={<PersonIcon sx={{ fontSize: 18 }} />} label="CLIENTE" value={clientName} />
            <Divider />
            <SummaryRow icon={<Box sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', mt: 0.25 }}>📱</Box>} label="TELÉFONO" value={phone} mono />
            <Divider />
            <SummaryRow
              icon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
              label="FECHA"
              value={<Box sx={{ textTransform: 'capitalize' }}>{formattedDate}</Box>}
            />
            <Divider />
            <SummaryRow icon={<AccessTimeIcon sx={{ fontSize: 18 }} />} label="HORA" value={time} mono />
            <Divider />
            <SummaryRow icon={<TimerIcon sx={{ fontSize: 18 }} />} label="DURACIÓN" value={`${service.duration} minutos`} mono />
            <Divider />
            <Box sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>TOTAL</Typography>
              <Typography
                sx={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: '2rem',
                  color: '#ffffff',
                  textShadow: '0 0 12px rgba(255,255,255,0.5)',
                  letterSpacing: '0.05em',
                }}
              >
                {service.price}€
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckCircleOutlineIcon />}
            onClick={handleConfirm}
            disabled={confirming}
            sx={{
              py: 1.8,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #d9d9d9 100%)',
              color: '#0a0a0a',
              boxShadow: '0 0 16px rgba(255,255,255,0.3)',
              '&:hover': { boxShadow: '0 0 28px rgba(255,255,255,0.5)' },
              animation: 'glowPulseMono 2s ease-in-out infinite',
            }}
          >
            {confirming ? 'PROCESANDO...' : 'CONFIRMAR RESERVA'}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<EditIcon />}
            onClick={() => navigate(-1)}
            disabled={confirming}
          >
            MODIFICAR
          </Button>
        </Box>

        <Typography
          sx={{
            textAlign: 'center',
            mt: 2.5,
            color: 'rgba(255,255,255,0.2)',
            fontSize: '0.7rem',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Pago en local · Sin tarjeta requerida
        </Typography>
      </motion.div>
    </Box>
  );
}

export default BookingSummaryPage;
