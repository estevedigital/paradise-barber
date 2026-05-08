import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Skeleton, Chip, Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useAuth } from '../store/AuthContext';
import bookingService from '../services/bookingService';
import GlowCard from '../components/GlowCard';
import BottomNav from '../components/BottomNav';

const SERVICE_ICONS = { '💈': true };

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [nextAppt, setNextAppt] = useState(undefined); // undefined = loading
  const [apptCount, setApptCount] = useState(0);

  useEffect(() => {
    if (!user?.phone) return;
    const next = bookingService.getNextAppointment(user.phone);
    const all = bookingService.getByPhone(user.phone);
    setNextAppt(next);
    setApptCount(all.length);
  }, [user]);

  const formattedDate = nextAppt
    ? format(parseISO(nextAppt.date), "EEEE d 'de' MMMM", { locale: es })
    : '';

  const isLoading = nextAppt === undefined;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0a0a0a',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 55%)',
        pb: { xs: 10, md: 4 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          pt: 4,
          pb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Typography
            variant="overline"
            sx={{ color: '#ffffff', letterSpacing: '0.2em', fontSize: '0.7rem' }}
          >
            BIENVENIDO
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.9rem', sm: '2.4rem' }, lineHeight: 1.1 }}>
            {user?.name?.toUpperCase()}
          </Typography>
        </motion.div>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(255,255,255,0.3)',
              fontSize: '0.7rem',
            }}
          >
            {user?.phone}
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={logout}
            sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', p: 0.5, minWidth: 0 }}
          >
            Salir
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 3 }, maxWidth: 600, mx: 'auto' }}>
        {/* Divider line */}
        <Box
          sx={{
            height: 1,
            background: 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.1) 100%)',
            mb: 4,
            boxShadow: '0 0 8px rgba(255,255,255,0.3)',
          }}
        />

        {/* Loading state */}
        {isLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="rounded" height={180} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
          </Box>
        )}

        {/* Has upcoming appointment */}
        {!isLoading && nextAppt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Typography
              variant="overline"
              sx={{ color: 'rgba(255,255,255,0.4)', mb: 1.5, display: 'block' }}
            >
              TU PRÓXIMA CITA
            </Typography>

            <GlowCard pulse sx={{ p: 2.5, mb: 3 }}>
              {/* Date block */}
              <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: 1.5,
                    px: 2,
                    py: 1.5,
                    textAlign: 'center',
                    minWidth: 72,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Bebas Neue', cursive",
                      fontSize: '2.8rem',
                      lineHeight: 1,
                      color: '#ffffff',
                      textShadow: '0 0 12px rgba(255,255,255,0.5)',
                    }}
                  >
                    {format(parseISO(nextAppt.date), 'd')}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Bebas Neue', cursive",
                      fontSize: '0.85rem',
                      letterSpacing: '0.12em',
                      color: 'rgba(255,255,255,0.6)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {format(parseISO(nextAppt.date), 'MMM', { locale: es })}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, pt: 0.5 }}>
                  <Typography
                    sx={{
                      fontFamily: "'Bebas Neue', cursive",
                      fontSize: '1.4rem',
                      letterSpacing: '0.05em',
                      lineHeight: 1.2,
                      mb: 0.5,
                    }}
                  >
                    {nextAppt.service}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }} />
                      <Typography
                        sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '0.8rem',
                          color: 'rgba(255,255,255,0.55)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {formattedDate}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }} />
                      <Typography
                        sx={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.85rem',
                          color: '#ffffff',
                          fontWeight: 700,
                        }}
                      >
                        {nextAppt.time}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${nextAppt.duration} min`}
                      size="small"
                      sx={{
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.7rem',
                        height: 24,
                      }}
                    />
                    <Chip
                      label={`${nextAppt.price}€`}
                      size="small"
                      sx={{
                        background: 'rgba(255,255,255,0.12)',
                        color: '#ffffff',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.7rem',
                        height: 24,
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    />
                    <Chip
                      label={nextAppt.status}
                      size="small"
                      sx={{
                        background: nextAppt.status === 'CONFIRMADA'
                          ? 'rgba(255,255,255,0.12)'
                          : 'rgba(255,255,255,0.12)',
                        color: nextAppt.status === 'CONFIRMADA' ? '#ffffff' : '#e0e0e0',
                        fontSize: '0.65rem',
                        height: 24,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </GlowCard>

            {apptCount > 1 && (
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: '0.8rem',
                  mb: 2.5,
                  textAlign: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                +{apptCount - 1} cita{apptCount - 1 > 1 ? 's' : ''} más en tu historial
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<EventAvailableIcon />}
                onClick={() => navigate('/appointments')}
              >
                GESTIONAR CITAS
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ContentCutIcon />}
                onClick={() => navigate('/booking')}
              >
                NUEVA CITA
              </Button>
            </Box>
          </motion.div>
        )}

        {/* No appointments */}
        {!isLoading && !nextAppt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {/* Barber pole SVG */}
              <Box sx={{ mb: 3 }}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="38" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                  <circle cx="40" cy="40" r="28" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <path d="M40 18 C40 18 28 28 28 40 C28 52 40 62 40 62 C40 62 52 52 52 40 C52 28 40 18 40 18Z"
                    stroke="#ffffff" strokeWidth="1.5" fill="rgba(255,255,255,0.05)" />
                  <path d="M30 23 L50 57" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M35 20 L55 54" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
                  <circle cx="40" cy="40" r="5" fill="#ffffff" opacity="0.8" />
                </svg>
              </Box>

              <Typography
                variant="h3"
                sx={{ fontSize: '1.8rem', mb: 1.5, lineHeight: 1.2 }}
              >
                ESTILO QUE<br />
                <Box component="span" sx={{ color: '#ffffff', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
                  HABLA POR TI
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.45)',
                  mb: 4,
                  fontSize: '0.95rem',
                  maxWidth: 300,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                No tienes citas pendientes. Reserva ahora y luce impecable.
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<ContentCutIcon />}
                onClick={() => navigate('/booking')}
                sx={{
                  px: 5,
                  py: 1.8,
                  fontSize: '1.15rem',
                }}
              >
                RESERVAR AHORA
              </Button>
            </Box>
          </motion.div>
        )}
      </Box>

      <BottomNav />
    </Box>
  );
}

export default DashboardPage;
