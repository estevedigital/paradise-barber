import React, { useState } from 'react';
import {
  Box, Tab, Tabs, TextField, Button, Typography, Alert,
  CircularProgress, InputAdornment,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import { sendOTP } from '../services/otpService';
import bookingService from '../services/bookingService';

// Zod schemas
const phoneSchema = z
  .string()
  .regex(/^[679]\d{8}$/, 'Teléfono español: 9 dígitos empezando por 6, 7 o 9');

const guestSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(60),
  phone: phoneSchema,
});

const registerSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(60),
  phone: phoneSchema,
});

const loginSchema = z.object({
  phone: phoneSchema,
});

// ── Shared phone field ──────────────────────────────────────────
function PhoneField({ register, errors }) {
  return (
    <TextField
      fullWidth
      label="Teléfono"
      placeholder="612345678"
      inputProps={{ inputMode: 'tel', maxLength: 9 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PhoneIcon sx={{ color: '#ffffff', fontSize: 18 }} />
            <Typography
              sx={{
                fontFamily: "'JetBrains Mono', monospace",
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.85rem',
                ml: 0.5,
              }}
            >
              +34
            </Typography>
          </InputAdornment>
        ),
      }}
      error={!!errors.phone}
      helperText={errors.phone?.message}
      {...register('phone')}
    />
  );
}

// ── Guest Tab ────────────────────────────────────────────────────
function GuestTab({ onSuccess }) {
  const { loginAsGuest } = useAuth();
  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(guestSchema) });

  const onSubmit = async (data) => {
    loginAsGuest(data.name, data.phone);
    onSuccess('booking');
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
        Reserva sin crear cuenta. Tus datos se guardan localmente.
      </Typography>
      <TextField
        fullWidth
        label="Nombre"
        placeholder="Tu nombre"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon sx={{ color: '#ffffff', fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register('name')}
      />
      <PhoneField register={register} errors={errors} />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        sx={{ mt: 1 }}
      >
        {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'RESERVAR COMO INVITADO'}
      </Button>
    </Box>
  );
}

// ── Register Tab ─────────────────────────────────────────────────
function RegisterTab({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register, handleSubmit, formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    const result = sendOTP(data.phone);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    onSuccess('otp', { phone: data.phone, name: data.name, mode: 'register' });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
        Crea tu cuenta para gestionar tus citas desde cualquier dispositivo.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        fullWidth
        label="Nombre"
        placeholder="Tu nombre"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon sx={{ color: '#ffffff', fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register('name')}
      />
      <PhoneField register={register} errors={errors} />
      <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 1 }}>
        {loading ? <CircularProgress size={20} color="inherit" /> : 'REGISTRARSE'}
      </Button>
    </Box>
  );
}

// ── Login Tab ─────────────────────────────────────────────────────
function LoginTab({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { checkRegistered } = useAuth();
  const {
    register, handleSubmit, formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    const name = checkRegistered(data.phone);
    const result = sendOTP(data.phone);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    onSuccess('otp', { phone: data.phone, name: name || 'Usuario', mode: 'login' });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
        Introduce tu teléfono y te enviamos un código de verificación.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <PhoneField register={register} errors={errors} />
      <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 1 }}>
        {loading ? <CircularProgress size={20} color="inherit" /> : 'ENVIAR CÓDIGO'}
      </Button>
    </Box>
  );
}

// ── AuthPage ──────────────────────────────────────────────────────
function AuthPage() {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSuccess = (destination, state = {}) => {
    if (destination === 'booking') {
      navigate('/booking', { replace: true });
    } else if (destination === 'otp') {
      navigate('/otp', { state: { ...state, from } });
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: '#0a0a0a',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 60%)',
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: 32 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2.8rem', sm: '3.5rem' },
            color: '#ffffff',
            letterSpacing: '0.08em',
            lineHeight: 1,
          }}
        >
          PARADISE
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem' },
            color: '#ffffff',
            letterSpacing: '0.25em',
            lineHeight: 1,
            textShadow: '0 0 20px rgba(255,255,255,0.6)',
          }}
        >
          BARBER
        </Typography>
        <Box
          sx={{
            width: 60,
            height: 2,
            background: '#ffffff',
            boxShadow: '0 0 10px rgba(255,255,255,0.6)',
            mx: 'auto',
            mt: 1.5,
          }}
        />
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        <Box
          sx={{
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Tab label="Invitado" />
            <Tab label="Registro" />
            <Tab label="Iniciar Sesión" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tab === 0 && <GuestTab onSuccess={handleSuccess} />}
            {tab === 1 && <RegisterTab onSuccess={handleSuccess} />}
            {tab === 2 && <LoginTab onSuccess={handleSuccess} />}
          </Box>
        </Box>

        <Typography
          sx={{
            textAlign: 'center',
            mt: 3,
            color: 'rgba(255,255,255,0.25)',
            fontSize: '0.75rem',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          © 2025 PARADISE BARBER — TODOS LOS DERECHOS RESERVADOS
        </Typography>
      </motion.div>
    </Box>
  );
}

export default AuthPage;
