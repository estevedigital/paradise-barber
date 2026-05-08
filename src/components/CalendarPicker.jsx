import React, { useState, useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth,
  isSameDay, isToday, isPast, getDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const NEON_RED = '#ffffff';

// Monday = 1, Sunday = 0 → closed days
function isClosedDay(date) {
  const day = getDay(date); // 0=Sun, 1=Mon
  return day === 0 || day === 1;
}

// Diagonal red strikethrough SVG overlay
function ClosedOverlay() {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 40 40" preserveAspectRatio="none">
        <line x1="4" y1="36" x2="36" y2="4" stroke={NEON_RED} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      </svg>
    </Box>
  );
}

/**
 * CalendarPicker — Custom mobile-first calendar with swipe, Framer Motion animations
 * @param {Object} props
 * @param {Date|null} props.selected - selected date
 * @param {Function} props.onSelect - callback(date)
 */
function CalendarPicker({ selected, onSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0); // 1=next, -1=prev
  const touchStartX = useRef(null);

  const goNext = () => { setDirection(1); setCurrentMonth((m) => addMonths(m, 1)); };
  const goPrev = () => {
    const prev = subMonths(currentMonth, 1);
    const now = new Date();
    if (prev.getFullYear() < now.getFullYear() || (prev.getFullYear() === now.getFullYear() && prev.getMonth() < now.getMonth())) return;
    setDirection(-1);
    setCurrentMonth(prev);
  };

  // Build calendar grid (Mon-Sun weeks)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  // Touch swipe handlers
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
    touchStartX.current = null;
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
  };

  const today = new Date();

  return (
    <Box
      sx={{ width: '100%', userSelect: 'none' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Month navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 0.5 }}>
        <IconButton
          onClick={goPrev}
          size="small"
          sx={{
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 1,
            p: 0.75,
            minWidth: 44,
            minHeight: 44,
            '&:hover': { color: NEON_RED, borderColor: 'rgba(255,255,255,0.4)' },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={format(currentMonth, 'yyyy-MM')}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: '1.3rem',
                textAlign: 'center',
                textTransform: 'capitalize',
              }}
            >
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </Typography>
          </motion.div>
        </AnimatePresence>

        <IconButton
          onClick={goNext}
          size="small"
          sx={{
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 1,
            p: 0.75,
            minWidth: 44,
            minHeight: 44,
            '&:hover': { color: NEON_RED, borderColor: 'rgba(255,255,255,0.4)' },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Weekday headers */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          mb: 0.5,
          gap: 0.25,
        }}
      >
        {WEEKDAYS.map((d) => (
          <Typography
            key={d}
            sx={{
              textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: d === 'L' || d === 'D' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
              py: 0.5,
              letterSpacing: '0.05em',
            }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      {/* Calendar grid with slide animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={format(currentMonth, 'yyyy-MM') + '-grid'}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 0.5,
            }}
          >
            {days.map((day) => {
              const inMonth = isSameMonth(day, currentMonth);
              const closed = isClosedDay(day);
              const past = isPast(day) && !isToday(day);
              const isSelected = selected && isSameDay(day, selected);
              const todayFlag = isToday(day);
              const disabled = closed || past || !inMonth;

              return (
                <Box
                  key={day.toISOString()}
                  onClick={() => !disabled && onSelect(day)}
                  sx={{
                    position: 'relative',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    border: todayFlag && !isSelected ? `2px solid ${NEON_RED}` : '1px solid transparent',
                    background: isSelected
                      ? NEON_RED
                      : 'transparent',
                    boxShadow: isSelected
                      ? '0 0 14px rgba(255,255,255,0.65), 0 0 28px rgba(255,255,255,0.3)'
                      : 'none',
                    opacity: !inMonth ? 0.12 : past ? 0.2 : 1,
                    transition: 'all 0.15s ease',
                    minHeight: 44,
                    minWidth: 44,
                    '&:hover': !disabled
                      ? {
                          background: isSelected ? NEON_RED : 'rgba(255,255,255,0.12)',
                          borderColor: 'rgba(255,255,255,0.4)',
                        }
                      : {},
                    ...(isSelected && {
                      animation: 'glowPulse 2s ease-in-out infinite',
                    }),
                  }}
                >
                  {closed && <ClosedOverlay />}
                  <Typography
                    sx={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      fontWeight: isSelected || todayFlag ? 700 : 400,
                      color: isSelected
                        ? '#ffffff'
                        : closed || past
                        ? 'rgba(255,255,255,0.2)'
                        : todayFlag
                        ? NEON_RED
                        : 'rgba(255,255,255,0.85)',
                      lineHeight: 1,
                      textShadow: isSelected ? `0 0 8px rgba(255,255,255,0.5)` : 'none',
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2.5, mt: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: NEON_RED }} />
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>
            Hoy
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: 0.25,
              background: 'rgba(255,255,255,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 10 10">
              <line x1="1" y1="9" x2="9" y2="1" stroke={NEON_RED} strokeWidth="1.5" opacity="0.5" />
            </svg>
          </Box>
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>
            Cerrado
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default CalendarPicker;
