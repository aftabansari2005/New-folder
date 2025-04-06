import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { use2FA } from '../hooks/use2FA';
import { TwoFactorAuth } from './TwoFactorAuth';
import { useAuth } from '../hooks/useAuth';

export const UserSettings: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isEnabled, check2FAStatus } = use2FA();
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handle2FAToggle = () => {
    setShow2FADialog(true);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // TODO: Implement dark mode toggle
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('settings.title')}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('settings.account')}
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary={t('settings.email')}
                secondary={user?.email}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t('settings.role')}
                secondary={t(`settings.roles.${user?.role}`)}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('settings.security')}
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary={t('settings.twoFactorAuth')}
                secondary={t('settings.twoFactorAuthDescription')}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={isEnabled}
                  onChange={handle2FAToggle}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={t('settings.changePassword')}
                secondary={t('settings.changePasswordDescription')}
              />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  onClick={() => {/* TODO: Implement password change */}}
                >
                  {t('settings.change')}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('settings.preferences')}
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary={t('settings.darkMode')}
                secondary={t('settings.darkModeDescription')}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={darkMode}
                  onChange={handleDarkModeToggle}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={t('settings.language')}
                secondary={t('settings.languageDescription')}
              />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  onClick={() => {/* TODO: Implement language change */}}
                >
                  {t('settings.change')}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <TwoFactorAuth
        open={show2FADialog}
        onClose={() => {
          setShow2FADialog(false);
          check2FAStatus();
        }}
        mode="setup"
      />
    </Box>
  );
}; 