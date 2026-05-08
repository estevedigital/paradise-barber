import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export const SERVICES = [
  {
    id: 'corte',
    name: 'Corte',
    duration: 30,
    price: 15,
    icon: '✂️',
    description: 'Corte de cabello personalizado',
  },
  {
    id: 'barba',
    name: 'Barba',
    duration: 20,
    price: 10,
    icon: '🪒',
    description: 'Arreglo y perfilado de barba',
  },
  {
    id: 'corte-barba',
    name: 'Corte + Barba',
    duration: 45,
    price: 22,
    icon: '💈',
    description: 'Pack completo: corte y barba',
  },
  {
    id: 'arreglo',
    name: 'Arreglo',
    duration: 15,
    price: 7,
    icon: '✨',
    description: 'Perfilado y repaso de acabados',
  },
];

/**
 * ServiceSelector — Grid of service cards
 * @param {Object} props
 * @param {string|null} props.selectedId
 * @param {Function} props.onSelect - callback(service)
 */
function ServiceSelector({ selectedId, onSelect }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
        gap: 1.5,
      }}
    >
      {SERVICES.map((service, idx) => {
        const isSelected = selectedId === service.id;
        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
          >
            <Box
              onClick={() => onSelect(service)}
              sx={{
                background: isSelected ? 'rgba(255,255,255,0.12)' : '#111111',
                border: isSelected
                  ? '1.5px solid rgba(255,255,255,0.7)'
                  : '1px solid rgba(255,255,255,0.07)',
                borderRadius: 2,
                p: 2,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                boxShadow: isSelected
                  ? '0 0 16px rgba(255,255,255,0.3), 0 0 32px rgba(255,255,255,0.12)'
                  : 'none',
                '&:hover': {
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.4)',
                },
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
              }}
            >
              <Typography sx={{ fontSize: '1.8rem', lineHeight: 1 }}>{service.icon}</Typography>
              <Typography
                sx={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: '1rem',
                  letterSpacing: '0.06em',
                  color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)',
                  lineHeight: 1.2,
                }}
              >
                {service.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography
                  sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.9rem',
                    color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.6)',
                    fontWeight: 700,
                  }}
                >
                  {service.price}€
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.3)',
                    lineHeight: 1.7,
                  }}
                >
                  · {service.duration}min
                </Typography>
              </Box>
              {isSelected && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                  }}
                />
              )}
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
}

export default ServiceSelector;
