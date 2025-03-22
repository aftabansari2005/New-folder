import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Queue as QueueIcon,
  VerifiedUser as VerifiedUserIcon,
  QrCode as QrCodeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getMenuItems = () => {
    if (user.role === 'admin') {
      return [
        { text: 'Admin Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Queue Management', icon: <QueueIcon />, path: '/admin/queues' },
        { text: 'Voter Verification', icon: <VerifiedUserIcon />, path: '/admin/verify' },
      ];
    }
    return [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
      { text: 'Generate QR', icon: <QrCodeIcon />, path: '/' },
    ];
  };

  const menuItems = getMenuItems();

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItemButton
          key={item.text}
          onClick={() => {
            navigate(item.path);
            if (isMobile) handleDrawerToggle();
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      ))}
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Voting System
        </Typography>
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                }}
              >
                {item.text}
              </Button>
            ))}
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 