import { createTheme } from '@mui/material/styles';

const ACCENT = '#ffffff';
const ACCENT_GLOW = 'rgba(255, 255, 255, 0.6)';
const BG = '#0a0a0a';
const SURFACE = '#111111';
const SURFACE_2 = '#1a1a1a';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = 'rgba(255,255,255,0.6)';

const neonShadow = `0 0 8px ${ACCENT_GLOW}, 0 0 20px rgba(255,255,255,0.3)`;
const neonShadowStrong = `0 0 12px ${ACCENT_GLOW}, 0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.15)`;

/**
 * Paradise Barber MUI Theme
 * Estilo monocromo blanco/negro
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: ACCENT,
      light: '#ffffff',
      dark: '#d9d9d9',
      contrastText: '#0a0a0a',
    },
    secondary: {
      main: '#ffffff',
      contrastText: '#0a0a0a',
    },
    background: {
      default: BG,
      paper: SURFACE,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    success: { main: '#ffffff' },
    warning: { main: '#e0e0e0' },
    error: { main: ACCENT },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: { fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' },
    h2: { fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' },
    h3: { fontFamily: "'Cinzel', serif", letterSpacing: '0.04em' },
    h4: { fontFamily: "'Cinzel', serif", letterSpacing: '0.04em' },
    h5: { fontFamily: "'Cinzel', serif", letterSpacing: '0.03em' },
    h6: { fontFamily: "'Cinzel', serif", letterSpacing: '0.03em' },
    overline: {
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: '0.15em',
      fontSize: '0.7rem',
    },
    caption: {
      fontFamily: "'JetBrains Mono', monospace",
    },
    button: {
      fontFamily: "'Bebas Neue', cursive",
      letterSpacing: '0.12em',
      fontSize: '1rem',
    },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BG,
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 2,
          padding: '12px 28px',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontFamily: "'Bebas Neue', cursive",
          fontSize: '1.05rem',
          minHeight: 48,
          transition: 'all 0.2s ease',
        },
        contained: {
          background: `linear-gradient(135deg, ${ACCENT} 0%, #d9d9d9 100%)`,
          color: '#0a0a0a',
          boxShadow: neonShadow,
          '&:hover': {
            boxShadow: neonShadowStrong,
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
          '&.Mui-disabled': {
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.3)',
          },
        },
        outlined: {
          borderColor: ACCENT,
          color: ACCENT,
          borderWidth: 1.5,
          '&:hover': {
            borderColor: ACCENT,
            background: 'rgba(255,255,255,0.08)',
            boxShadow: neonShadow,
          },
        },
        text: {
          color: ACCENT,
          '&:hover': { background: 'rgba(255,255,255,0.08)' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontFamily: "'DM Sans', sans-serif",
            background: SURFACE_2,
            borderRadius: 4,
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.15)',
              transition: 'border-color 0.2s',
            },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
            '&.Mui-focused fieldset': {
              borderColor: ACCENT,
              boxShadow: `0 0 0 2px rgba(255,255,255,0.2)`,
            },
          },
          '& .MuiInputLabel-root': {
            color: TEXT_SECONDARY,
            '&.Mui-focused': { color: ACCENT },
          },
          '& input': { color: TEXT_PRIMARY },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: SURFACE,
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          borderRadius: 4,
          height: 36,
          minWidth: 72,
          fontSize: '0.875rem',
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            background: 'rgba(255,255,255,0.15)',
            color: ACCENT,
            border: `1px solid rgba(255,255,255,0.4)`,
            '&.selected': {
              background: ACCENT,
              color: '#0a0a0a',
              boxShadow: neonShadow,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: SURFACE,
          border: `1px solid rgba(255,255,255,0.3)`,
          boxShadow: neonShadowStrong,
          borderRadius: 8,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: "'Bebas Neue', cursive",
          letterSpacing: '0.05em',
          fontSize: '1.5rem',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: '#0d0d0d',
          borderTop: `1px solid rgba(255,255,255,0.2)`,
          height: 64,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.4)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.7rem',
          minWidth: 60,
          '&.Mui-selected': {
            color: ACCENT,
            filter: `drop-shadow(0 0 6px ${ACCENT_GLOW})`,
          },
        },
        label: {
          fontSize: '0.65rem',
          '&.Mui-selected': { fontSize: '0.65rem' },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "'Bebas Neue', cursive",
          letterSpacing: '0.08em',
          fontSize: '1rem',
          color: TEXT_SECONDARY,
          minHeight: 48,
          '&.Mui-selected': { color: ACCENT },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: ACCENT,
          boxShadow: `0 0 8px ${ACCENT_GLOW}`,
          height: 2,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontFamily: "'DM Sans', sans-serif",
        },
        standardError: {
          background: 'rgba(255,255,255,0.1)',
          border: `1px solid rgba(255,255,255,0.3)`,
          color: '#f2f2f2',
        },
        standardSuccess: {
          background: 'rgba(255,255,255,0.1)',
          border: `1px solid rgba(255,255,255,0.3)`,
          color: '#ffffff',
        },
        standardWarning: {
          background: 'rgba(255,255,255,0.1)',
          border: `1px solid rgba(255,255,255,0.3)`,
          color: '#e0e0e0',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 },
        bar: { backgroundColor: ACCENT },
      },
    },
    MuiCircularProgress: {
      defaultProps: { color: 'primary' },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.06)',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.08)' },
      },
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: "'DM Sans', sans-serif",
        },
        input: {
          '&::placeholder': { color: 'rgba(255,255,255,0.3)', opacity: 1 },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: { backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.7)' },
      },
    },
  },
});

export default theme;
export { ACCENT, ACCENT_GLOW, BG, SURFACE, SURFACE_2, neonShadow, neonShadowStrong };
