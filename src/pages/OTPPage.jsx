import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Alert, CircularProgress,
  TextField, LinearProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import { verifyOTP, sendOTP, checkLockStatus } from '../services/otpService';

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 60;
const BRAND_FONT = "'Cinzel', 'Times New Roman', serif";
const MONO_ALERT_SX = {
  mb: 2,
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.25)',
  color: '#ffffff',
  '& .MuiAlert-icon': { color: '#ffffff' },
};

function OTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone, name, mode, from } = location.state || {};
  const { loginAsRegistered } = useAuth();

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  const inputsRef = useRef([]);

  // Check lock on mount
  useEffect(() => {
    if (!phone) { navigate('/auth'); return; }
    const status = checkLockStatus(phone);
    if (status.locked) {
      setLocked(true);
      setLockTimer(Math.ceil((status.lockedUntil - Date.now()) / 1000));
    }
  }, [phone, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  // Lock countdown
  useEffect(() => {
    if (!locked || lockTimer <= 0) return;
    if (lockTimer === 0) { setLocked(false); return; }
    const id = setTimeout(() => setLockTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [locked, lockTimer]);

  // Focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = useCallback((idx, value) => {
    // Allow only digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[idx] = digit;
    setDigits(newDigits);
    setError('');

    if (digit && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  }, [digits]);

  const handleKeyDown = useCallback((idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  }, [digits]);

  // Handle paste — fill all 6 digits
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newDigits = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { newDigits[i] = ch; });
    setDigits(newDigits);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIdx]?.focus();
  }, []);

  const handleVerify = useCallback(async () => {
    const code = digits.join('');
    if (code.length < OTP_LENGTH) { setError('Introduce los 6 dígitos.'); return; }
    setLoading(true);
    setError('');

    const result = verifyOTP(phone, code);
    setLoading(false);

    if (result.lockedUntil) {
      setLocked(true);
      setLockTimer(Math.ceil((result.lockedUntil - Date.now()) / 1000));
    }

    if (!result.valid) {
      setError(result.message);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
      return;
    }

    setSuccess(true);
    loginAsRegistered(name, phone);
    setTimeout(() => navigate(from || '/dashboard', { replace: true }), 800);
  }, [digits, phone, name, mode, loginAsRegistered, navigate, from]);

  const handleResend = useCallback(() => {
    const result = sendOTP(phone);
    if (!result.success) { setError(result.message); return; }
    setCanResend(false);
    setCountdown(RESEND_COUNTDOWN);
    setDigits(Array(OTP_LENGTH).fill(''));
    setError('');
    inputsRef.current[0]?.focus();
  }, [phone]);

  // Auto-verify when all filled
  useEffect(() => {
    if (digits.every((d) => d !== '') && !loading && !success) {
      handleVerify();
    }
  }, [digits]); // eslint-disable-line

  const progressValue = ((RESEND_COUNTDOWN - countdown) / RESEND_COUNTDOWN) * 100;

  if (!phone) return null;

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
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 60%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '0.58rem',
              letterSpacing: '0.22em',
              fontFamily: BRAND_FONT,
              mb: 0.6,
            }}
          >
            BY PEDRO B.GOMEZ
          </Typography>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.45)', pt: 1 }}>
            <Typography
              variant="h2"
              sx={{
                color: '#ffffff',
                fontFamily: BRAND_FONT,
                fontWeight: 700,
                letterSpacing: '0.08em',
                lineHeight: 1,
                fontSize: { xs: '2.2rem', sm: '2.6rem' },
              }}
            >
              PARADISE
            </Typography>
            <Typography
              sx={{
                color: '#ffffff',
                fontFamily: BRAND_FONT,
                letterSpacing: '0.36em',
                fontSize: '0.94rem',
                lineHeight: 1.2,
                ml: '0.36em',
                mt: 0.1,
              }}
            >
              BARBER
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 1, fontSize: '0.875rem' }}>
            Código enviado a{' '}
            <Box
              component="span"
              sx={{
                fontFamily: "'JetBrains Mono', monospace",
                color: '#ffffff',
              }}
            >
              +34 {phone}
            </Box>
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: '0.75rem',
              mt: 0.5,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            [DEMO: usa 123456]
          </Typography>
        </Box>

        {/* Card */}
        <Box
          sx={{
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 2,
            p: 3,
          }}
        >
          {success ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <motion.path
                      d="M6 18L14 26L30 10"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </svg>
                </Box>
              </motion.div>
              <Typography variant="h5" sx={{ color: '#ffffff' }}>
                ¡VERIFICADO!
              </Typography>
            </Box>
          ) : (
            <>
              {locked && (
                <Alert severity="error" sx={MONO_ALERT_SX}>
                  Bloqueado — espera {Math.floor(lockTimer / 60)}:{String(lockTimer % 60).padStart(2, '0')}
                </Alert>
              )}
              {error && !locked && <Alert severity="error" sx={MONO_ALERT_SX}>{error}</Alert>}

              {/* OTP inputs */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  justifyContent: 'center',
                  mb: 3,
                }}
                onPaste={handlePaste}
              >
                {digits.map((digit, idx) => (
                  <Box
                    key={idx}
                    component="input"
                    ref={(el) => { inputsRef.current[idx] = el; }}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    disabled={locked || loading}
                    maxLength={1}
                    inputMode="numeric"
                    sx={{
                      width: 48,
                      height: 56,
                      textAlign: 'center',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      background: '#1a1a1a',
                      border: digit
                        ? '2px solid #ffffff'
                        : '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '4px',
                      color: '#ffffff',
                      outline: 'none',
                      boxShadow: digit ? '0 0 10px rgba(255,255,255,0.25)' : 'none',
                      transition: 'all 0.15s ease',
                      caretColor: '#ffffff',
                      '&:focus': {
                        borderColor: '#ffffff',
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.2)',
                      },
                      '&:disabled': { opacity: 0.4 },
                    }}
                  />
                ))}
              </Box>

              {/* Verify button */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleVerify}
                disabled={loading || locked || digits.join('').length < OTP_LENGTH}
                sx={{
                  mb: 2,
                  background: '#ffffff',
                  color: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.4)',
                  '&:hover': { background: 'rgba(255,255,255,0.9)' },
                  '&.Mui-disabled': {
                    background: 'rgba(255,255,255,0.2)',
                    color: 'rgba(0,0,0,0.6)',
                  },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'VERIFICAR'}
              </Button>

              {/* Countdown / Resend */}
              <Box sx={{ textAlign: 'center' }}>
                {canResend ? (
                  <Button
                    variant="text"
                    onClick={handleResend}
                    sx={{
                      fontSize: '0.85rem',
                      color: '#ffffff',
                      '&:hover': { background: 'rgba(255,255,255,0.08)' },
                    }}
                  >
                    Reenviar código
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={progressValue}
                        size={32}
                        thickness={4}
                        sx={{ color: '#ffffff' }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.6rem',
                            color: '#ffffff',
                          }}
                        >
                          {countdown}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                      Reenviar código en {countdown}s
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>

        {/* Back link */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="text"
            onClick={() => navigate('/auth')}
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.8rem',
              '&:hover': { background: 'rgba(255,255,255,0.08)' },
            }}
          >
            ← Volver
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}

export default OTPPage;
