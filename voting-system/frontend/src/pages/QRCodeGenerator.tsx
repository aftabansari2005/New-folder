import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../components/NotificationSystem';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [voterId, setVoterId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleGenerateQR = async () => {
    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voterId, roomNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      showNotification(t('qr.generateSuccess'), 'success');
    } catch (error) {
      console.error('QR generation error:', error);
      showNotification(t('qr.generateError'), 'error');
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `voter-qr-${voterId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('qr.title')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('qr.generateQR')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('qr.voterId')}
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('qr.roomNumber')}
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleGenerateQR}
                    disabled={!voterId || !roomNumber}
                  >
                    {t('qr.generate')}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('qr.preview')}
              </Typography>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {qrCode ? (
                  <>
                    <QRCodeSVG value={qrCode} size={200} />
                    <Button
                      variant="outlined"
                      onClick={handleDownload}
                      sx={{ mt: 2 }}
                    >
                      {t('qr.download')}
                    </Button>
                  </>
                ) : (
                  <Typography color="text.secondary">
                    {t('qr.noPreview')}
                  </Typography>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QRCodeGenerator; 