import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const NAV_ITEMS = [
  { label: 'Inicio', icon: <HomeIcon />, path: '/dashboard' },
  { label: 'Citas', icon: <EventNoteIcon />, path: '/appointments' },
  { label: 'Nueva', icon: <AddCircleOutlineIcon />, path: '/booking' },
];

/**
 * BottomNav — Mobile bottom navigation bar
 */
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentValue = NAV_ITEMS.findIndex((item) => location.pathname.startsWith(item.path));

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: { xs: 'block', md: 'none' },
        background: 'transparent',
        boxShadow: 'none',
      }}
      elevation={0}
    >
      <BottomNavigation
        value={currentValue === -1 ? false : currentValue}
        onChange={(_, newValue) => {
          navigate(NAV_ITEMS[newValue].path);
        }}
        showLabels
      >
        {NAV_ITEMS.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
