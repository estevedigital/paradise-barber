import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const NEON_RED_GLOW = 'rgba(255, 255, 255, 0.6)';

/**
 * GlowCard — Card with animated neon red glow border
 */
function GlowCard({ children, sx = {}, pulse = false, ...props }) {
  return (
    <Box
      component={motion.div}
      animate={
        pulse
          ? {
              boxShadow: [
                `0 0 12px ${NEON_RED_GLOW}, 0 0 30px rgba(255,255,255,0.3), inset 0 0 0 1px rgba(255,255,255,0.4)`,
                `0 0 24px ${NEON_RED_GLOW}, 0 0 60px rgba(255,255,255,0.5), inset 0 0 0 1px rgba(255,255,255,0.8)`,
                `0 0 12px ${NEON_RED_GLOW}, 0 0 30px rgba(255,255,255,0.3), inset 0 0 0 1px rgba(255,255,255,0.4)`,
              ],
            }
          : {}
      }
      transition={pulse ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
      sx={{
        background: '#111111',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: `0 0 12px ${NEON_RED_GLOW}, 0 0 30px rgba(255,255,255,0.2)`,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default GlowCard;
