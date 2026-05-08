import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DownloadIcon from '@mui/icons-material/Download';

// Generate .ics calendar file content
function generateICS({ service, date, time, clientName }) {
  const [h, m] = time.split(':').map(Number);
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + service.duration * 60 * 1000);

  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Paradise Barber//ES',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Paradise Barber - ${service.name}`,
    `DESCRIPTION:Cita de ${service.name} para ${clientName}. Duración: ${service.duration}min. Precio: ${service.price}€`,
    'LOCATION:Paradise Barber',
    `UID:${crypto.randomUUID()}@paradisebarber`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

// Particle component
function Particle({ x, y, color, size, delay }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}`,
      }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 0.8, 0],
        y: [0, -60, -120, -180],
        x: [(Math.random() - 0.5) * 80],
      }}
      transition={{
        duration: 2 + Math.random(),
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, date, time, clientName, phone } = location.state || {};
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#ffffff' : '#f2f2f2',
      size: Math.floor(Math.random() * 6) + 3,
      delay: Math.random() * 0.8,
    }))
  );

  if (!service || !date || !time) {
    navigate('/dashboard');
    return null;
  }

  const formattedDate = format(parseISO(date + 'T00:00:00'), "EEEE d 'de' MMMM", { locale: es });

  const handleDownloadICS = () => {
    const ics = generateICS({ service, date, time, clientName });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paradise-barber-${date}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Particles */}
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}

      {/* Background glow */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120, damping: 14 }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
      >
        {/* Checkmark */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
            style={{ display: 'inline-block' }}
          >
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.15)',
                mx: 'auto',
              }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <motion.path
                  d="M8 24 L20 36 L40 12"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, ease: 'easeOut', delay: 0.35 }}
                />
              </svg>
            </Box>
          </motion.div>
        </Box>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Box
            sx={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              mb: 2.5,
            }}
          >
            <Typography variant="h3" sx={{ fontSize: '2rem', mb: 0.5, color: '#ffffff' }}>
              ¡RESERVA CONFIRMADA!
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 2,
                background: '#ffffff',
                boxShadow: '0 0 8px rgba(255,255,255,0.5)',
                mx: 'auto',
                mb: 2.5,
              }}
            />

            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', mb: 2 }}>
              Te esperamos en Paradise Barber
            </Typography>

            {/* Booking summary */}
            <Box
              sx={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 1.5,
                p: 2,
                textAlign: 'left',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>SERVICIO</Typography>
                <Typography sx={{ color: '#ffffff', fontSize: '0.9rem', fontFamily: "'Bebas Neue', cursive", letterSpacing: '0.05em' }}>{service.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>FECHA</Typography>
                <Typography sx={{ color: '#ffffff', fontSize: '0.85rem', textTransform: 'capitalize' }}>{formattedDate}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>HORA</Typography>
                <Typography sx={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700 }}>{time}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>TOTAL</Typography>
                <Typography sx={{ color: '#ffffff', fontFamily: "'Bebas Neue', cursive", fontSize: '1.2rem' }}>{service.price}€</Typography>
              </Box>
            </Box>

            <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
              Ref: <Box component="span" sx={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.4)' }}>{phone}</Box>
            </Typography>
          </Box>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.35 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<DownloadIcon />}
              onClick={handleDownloadICS}
              sx={{
                borderColor: '#ffffff',
                color: '#ffffff',
                '&:hover': {
                  borderColor: '#ffffff',
                  background: 'rgba(255,255,255,0.08)',
                  boxShadow: '0 0 16px rgba(255,255,255,0.3)',
                },
              }}
            >
              AÑADIR AL CALENDARIO
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<HomeIcon />}
              onClick={() => navigate('/dashboard', { replace: true })}
            >
              VOLVER AL INICIO
            </Button>
            <Button
              variant="text"
              startIcon={<EventNoteIcon />}
              onClick={() => navigate('/appointments', { replace: true })}
              sx={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Ver mis citas
            </Button>
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
}

export default ConfirmationPage;
