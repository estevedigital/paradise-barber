import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Alert, Snackbar, Divider,
  LinearProgress, IconButton,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../store/AuthContext';
import CalendarPicker from '../components/CalendarPicker';
import TimeSlotPicker from '../components/TimeSlotPicker';
import ServiceSelector, { SERVICES } from '../components/ServiceSelector';
import BottomNav from '../components/BottomNav';

const STEPS = ['Servicio', 'Fecha', 'Hora'];

function StepIndicator({ step }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', mb: 0.5 }}>
      {STEPS.map((label, idx) => (
        <React.Fragment key={label}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: idx <= step ? '#ffffff' : 'rgba(255,255,255,0.06)',
                border: idx === step ? '2px solid rgba(255,255,255,0.3)' : '1.5px solid transparent',
                boxShadow: idx <= step ? '0 0 8px rgba(255,255,255,0.4)' : 'none',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  color: idx <= step ? '#ffffff' : 'rgba(255,255,255,0.3)',
                  fontWeight: 700,
                }}
              >
                {idx + 1}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.75rem',
                color: idx === step ? '#ffffff' : 'rgba(255,255,255,0.3)',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {label}
            </Typography>
          </Box>
          {idx < STEPS.length - 1 && (
            <Box
              sx={{
                flex: 1,
                height: 1,
                background: idx < step ? '#ffffff' : 'rgba(255,255,255,0.08)',
                transition: 'background 0.3s',
                boxShadow: idx < step ? '0 0 6px rgba(255,255,255,0.3)' : 'none',
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
}

function NewBookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editAppointment = location.state?.editAppointment || null;

  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [error, setError] = useState('');

  // Pre-fill when editing
  useEffect(() => {
    if (editAppointment) {
      const svc = SERVICES?.find?.((s) => s.name === editAppointment.service);
      if (svc) setService(svc);
      if (editAppointment.date) setSelectedDate(new Date(editAppointment.date + 'T12:00:00'));
      if (editAppointment.time) setSelectedTime(editAppointment.time);
    }
  }, [editAppointment]);

  const handleServiceSelect = (svc) => {
    setService(svc);
    setError('');
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setError('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setError('');
  };

  const handleNext = () => {
    if (step === 0 && !service) { setError('Selecciona un servicio para continuar.'); return; }
    if (step === 1 && !selectedDate) { setError('Selecciona una fecha para continuar.'); return; }
    if (step === 2) {
      if (!selectedTime) { setError('Selecciona un horario para continuar.'); return; }
      // Navigate to summary
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      navigate('/booking/summary', {
        state: {
          service,
          date: dateStr,
          time: selectedTime,
          clientName: user.name,
          phone: user.phone,
          editId: editAppointment?.id || null,
        },
      });
      return;
    }
    setStep((s) => s + 1);
    setError('');
  };

  const handleBack = () => {
    if (step === 0) { navigate(-1); return; }
    setStep((s) => s - 1);
    setError('');
  };

  const formattedDate = selectedDate
    ? format(selectedDate, "EEEE d 'de' MMMM", { locale: es })
    : null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0a0a0a',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 55%)',
        pb: { xs: 10, md: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 1,
            p: 0.75,
            minWidth: 44,
            minHeight: 44,
            '&:hover': { color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' },
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box>
          <Typography variant="overline" sx={{ color: '#ffffff', letterSpacing: '0.18em', fontSize: '0.65rem' }}>
            {editAppointment ? 'MODIFICAR CITA' : 'NUEVA RESERVA'}
          </Typography>
          <Typography variant="h4" sx={{ fontSize: '1.6rem', lineHeight: 1 }}>
            PARADISE BARBER
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
        {/* Step indicator */}
        <Box sx={{ mb: 3 }}>
          <StepIndicator step={step} />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
          >
            {step === 0 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 2, fontSize: '1.2rem' }}>
                  ¿QUÉ SERVICIO NECESITAS?
                </Typography>
                <ServiceSelector selectedId={service?.id} onSelect={handleServiceSelect} />
              </Box>
            )}

            {step === 1 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 2, fontSize: '1.2rem' }}>
                  ELIGE TU FECHA
                </Typography>
                <Box
                  sx={{
                    background: '#111111',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 2,
                    p: { xs: 2, sm: 3 },
                  }}
                >
                  <CalendarPicker selected={selectedDate} onSelect={handleDateSelect} />
                </Box>
                {selectedDate && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff', flexShrink: 0 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                      {formattedDate}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {step === 2 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 0.5, fontSize: '1.2rem' }}>
                  ELIGE TU HORA
                </Typography>
                {selectedDate && (
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '0.8rem',
                      mb: 2.5,
                      textTransform: 'capitalize',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {formattedDate}
                  </Typography>
                )}
                <TimeSlotPicker
                  selectedDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null}
                  selectedTime={selectedTime}
                  onSelect={handleTimeSelect}
                  editingId={editAppointment?.id}
                />
              </Box>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Summary bar */}
        {(service || selectedDate || selectedTime) && (
          <Box
            sx={{
              mt: 3,
              p: 1.5,
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 1.5,
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {service && (
              <Box>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>SERVICIO</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#ffffff', fontFamily: "'Bebas Neue', cursive", letterSpacing: '0.06em' }}>{service.name} · {service.price}€</Typography>
              </Box>
            )}
            {selectedDate && (
              <Box>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>FECHA</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize', fontFamily: "'DM Sans', sans-serif" }}>
                  {formattedDate}
                </Typography>
              </Box>
            )}
            {selectedTime && (
              <Box>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>HORA</Typography>
                <Typography sx={{ fontSize: '0.95rem', color: '#ffffff', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{selectedTime}</Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Navigation */}
        <Box sx={{ mt: 3, display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ flex: step === 0 ? 0 : 1, display: step === 0 ? 'none' : 'flex' }}
          >
            ATRÁS
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            fullWidth={step === 0}
            sx={{ flex: 1 }}
          >
            {step === 2 ? 'VER RESUMEN' : 'SIGUIENTE'}
          </Button>
        </Box>
      </Box>

      <BottomNav />
    </Box>
  );
}

export default NewBookingPage;
