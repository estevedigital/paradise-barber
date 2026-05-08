import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { format, parseISO } from 'date-fns';
import bookingService from '../services/bookingService';

// Generate time slots 9:00–19:30 every 30min, excluding 14:00–16:00
function generateSlots() {
  const slots = [];
  for (let h = 9; h <= 19; h++) {
    for (const m of [0, 30]) {
      if (h === 14 || h === 15 || (h === 13 && m === 30)) {
        // Exclude 13:30–16:00 → actually exclude 14:00–15:30
        if (h === 14 || h === 15) continue;
      }
      if (h === 19 && m === 30) continue; // Last slot 19:00
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
}

// Recalculate: 9:00 to 19:00 every 30min, skip 14:00-16:00
function generateTimeSlots() {
  const slots = [];
  for (let totalMins = 9 * 60; totalMins <= 19 * 60; totalMins += 30) {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    // Skip lunch break 14:00–16:00
    if (totalMins >= 14 * 60 && totalMins < 16 * 60) continue;
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    slots.push(time);
  }
  return slots;
}

const ALL_SLOTS = generateTimeSlots();

/**
 * TimeSlotPicker — chips for each available time slot
 * @param {Object} props
 * @param {string|null} props.selectedDate - YYYY-MM-DD
 * @param {string|null} props.selectedTime
 * @param {string|null} props.editingId - appointment id being edited (excluded from unavailable check)
 * @param {Function} props.onSelect - callback(time)
 */
function TimeSlotPicker({ selectedDate, selectedTime, onSelect, editingId = null }) {
  if (!selectedDate) {
    return (
      <Box
        sx={{
          border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
          Selecciona una fecha para ver los horarios disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {ALL_SLOTS.map((time) => {
          const available = bookingService.isSlotAvailable(selectedDate, time, editingId);
          const isSelected = selectedTime === time;
          const isLunch = false; // already excluded from slots

          return (
            <Chip
              key={time}
              label={time}
              clickable={available}
              onClick={() => available && onSelect(time)}
              sx={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.85rem',
                height: 40,
                minWidth: 76,
                borderRadius: 1,
                cursor: available ? 'pointer' : 'not-allowed',
                opacity: available ? 1 : 0.4,
                background: isSelected
                  ? '#ffffff'
                  : available
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(255,255,255,0.03)',
                color: isSelected
                  ? '#ffffff'
                  : available
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(255,255,255,0.25)',
                border: isSelected
                  ? '1px solid #ffffff'
                  : available
                  ? '1px solid rgba(255,255,255,0.12)'
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isSelected
                  ? '0 0 12px rgba(255,255,255,0.5), 0 0 24px rgba(255,255,255,0.25)'
                  : 'none',
                transition: 'all 0.15s ease',
                '&:hover': available && !isSelected
                  ? {
                      background: 'rgba(255,255,255,0.12)',
                      borderColor: 'rgba(255,255,255,0.4)',
                      color: '#ffffff',
                    }
                  : {},
                textDecoration: !available ? 'line-through' : 'none',
              }}
            />
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 0.25, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)' }} />
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>
            Seleccionado
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 0.25, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', opacity: 0.4 }} />
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>
            Ocupado
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default TimeSlotPicker;
