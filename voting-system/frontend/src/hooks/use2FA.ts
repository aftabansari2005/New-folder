import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useNotification } from '../components/NotificationSystem';
import { useTranslation } from 'react-i18next';

interface TwoFactorState {
  isEnabled: boolean;
  secret: string | null;
  qrCode: string | null;
}

export const use2FA = () => {
  const { user, token } = useAuth();
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const [twoFactorState, setTwoFactorState] = useState<TwoFactorState>({
    isEnabled: false,
    secret: null,
    qrCode: null,
  });

  const enable2FA = useCallback(async () => {
    if (!user || !token) return;

    try {
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to enable 2FA');
      }

      const { secret, qrCode } = await response.json();
      setTwoFactorState({
        isEnabled: true,
        secret,
        qrCode,
      });
      showNotification(t('auth.2faEnabled'), 'success');
    } catch (error) {
      console.error('2FA enable error:', error);
      showNotification(t('auth.2faEnableError'), 'error');
    }
  }, [user, token, t, showNotification]);

  const disable2FA = useCallback(async () => {
    if (!user || !token) return;

    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to disable 2FA');
      }

      setTwoFactorState({
        isEnabled: false,
        secret: null,
        qrCode: null,
      });
      showNotification(t('auth.2faDisabled'), 'success');
    } catch (error) {
      console.error('2FA disable error:', error);
      showNotification(t('auth.2faDisableError'), 'error');
    }
  }, [user, token, t, showNotification]);

  const verify2FA = useCallback(async (code: string) => {
    if (!user || !token) return false;

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Invalid 2FA code');
      }

      showNotification(t('auth.2faVerified'), 'success');
      return true;
    } catch (error) {
      console.error('2FA verification error:', error);
      showNotification(t('auth.2faVerificationError'), 'error');
      return false;
    }
  }, [user, token, t, showNotification]);

  const check2FAStatus = useCallback(async () => {
    if (!user || !token) return;

    try {
      const response = await fetch('/api/auth/2fa/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check 2FA status');
      }

      const { isEnabled } = await response.json();
      setTwoFactorState((prev) => ({
        ...prev,
        isEnabled,
      }));
    } catch (error) {
      console.error('2FA status check error:', error);
    }
  }, [user, token]);

  return {
    ...twoFactorState,
    enable2FA,
    disable2FA,
    verify2FA,
    check2FAStatus,
  };
}; 