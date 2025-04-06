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
  Tabs,
  Tab,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../components/NotificationSystem';
import Webcam from 'react-webcam';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`verification-tabpanel-${index}`}
      aria-labelledby={`verification-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const VoterVerification: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [tabValue, setTabValue] = useState(0);
  const [voterId, setVoterId] = useState('');
  const [qrData, setQrData] = useState('');
  const webcamRef = React.useRef<Webcam>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQRVerification = async () => {
    try {
      const response = await fetch('/api/qr/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrData }),
      });

      if (!response.ok) {
        throw new Error('QR verification failed');
      }

      showNotification(t('verify.qrSuccess'), 'success');
    } catch (error) {
      console.error('QR verification error:', error);
      showNotification(t('verify.qrError'), 'error');
    }
  };

  const handleFaceVerification = async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        throw new Error('No image captured');
      }

      const response = await fetch('/api/verify/face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: imageSrc, voterId }),
      });

      if (!response.ok) {
        throw new Error('Face verification failed');
      }

      showNotification(t('verify.faceSuccess'), 'success');
    } catch (error) {
      console.error('Face verification error:', error);
      showNotification(t('verify.faceError'), 'error');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('verify.title')}
      </Typography>

      <Card>
        <CardContent>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label={t('verify.qrTab')} />
              <Tab label={t('verify.faceTab')} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('verify.qrData')}
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleQRVerification}
                    disabled={!qrData}
                  >
                    {t('verify.verifyQR')}
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('verify.voterId')}
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width={480}
                      height={360}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleFaceVerification}
                    disabled={!voterId}
                  >
                    {t('verify.verifyFace')}
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VoterVerification; 