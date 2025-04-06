import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { use2FA } from '../hooks/use2FA';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';

interface TwoFactorAuthProps {
  open: boolean;
  onClose: () => void;
  mode: 'setup' | 'verify';
}

export const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  open,
  onClose,
  mode,
}) => {
  const { t } = useTranslation();
  const {
    isEnabled,
    secret,
    qrCode,
    enable2FA,
    disable2FA,
    verify2FA,
    check2FAStatus,
  } = use2FA();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && mode === 'setup') {
      check2FAStatus();
    }
  }, [open, mode, check2FAStatus]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (mode === 'setup') {
        if (!isEnabled) {
          await enable2FA();
        } else {
          const verified = await verify2FA(code);
          if (verified) {
            onClose();
          } else {
            setError(t('auth.invalidCode'));
          }
        }
      } else {
        const verified = await verify2FA(code);
        if (verified) {
          onClose();
        } else {
          setError(t('auth.invalidCode'));
        }
      }
    } catch (err) {
      setError(t('auth.verificationError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      await disable2FA();
      onClose();
    } catch (err) {
      setError(t('auth.disableError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'setup' ? t('auth.setup2FA') : t('auth.verify2FA')}
      </DialogTitle>
      <DialogContent>
        {mode === 'setup' && !isEnabled && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              {t('auth.setup2FADescription')}
            </Typography>
            {qrCode && (
              <Box sx={{ my: 2 }}>
                <QRCodeSVG value={qrCode} size={200} />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {t('auth.scanQRCode')}
                </Typography>
              </Box>
            )}
            {secret && (
              <Typography variant="body2" color="text.secondary">
                {t('auth.backupCode')}: {secret}
              </Typography>
            )}
          </Box>
        )}
        {mode === 'verify' && (
          <Typography variant="body1" gutterBottom>
            {t('auth.enterVerificationCode')}
          </Typography>
        )}
        <TextField
          fullWidth
          label={t('auth.verificationCode')}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          error={!!error}
          helperText={error}
          disabled={loading}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        {mode === 'setup' && isEnabled && (
          <Button
            onClick={handleDisable}
            color="error"
            disabled={loading}
          >
            {t('auth.disable2FA')}
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !code}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : mode === 'setup' && !isEnabled ? (
            t('auth.enable2FA')
          ) : (
            t('auth.verify')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 