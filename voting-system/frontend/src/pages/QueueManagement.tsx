import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../components/NotificationSystem';

interface Queue {
  id: number;
  roomNumber: string;
  currentQueue: number;
  estimatedWaitTime: number;
}

const QueueManagement: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      const response = await fetch('/api/queues');
      const data = await response.json();
      setQueues(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching queues:', error);
      showNotification(t('queue.fetchError'), 'error');
      setLoading(false);
    }
  };

  const handleUpdateQueue = async (queue: Queue) => {
    try {
      const response = await fetch('/api/queues/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queue),
      });

      if (!response.ok) {
        throw new Error('Failed to update queue');
      }

      showNotification(t('queue.updateSuccess'), 'success');
      fetchQueues();
    } catch (error) {
      console.error('Error updating queue:', error);
      showNotification(t('queue.updateError'), 'error');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('queue.title')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  {t('queue.currentQueues')}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {/* TODO: Implement add queue */}}
                >
                  {t('queue.addQueue')}
                </Button>
              </Box>

              {loading ? (
                <Typography>{t('common.loading')}</Typography>
              ) : (
                <List>
                  {queues.map((queue) => (
                    <Paper key={queue.id} sx={{ mb: 2 }}>
                      <ListItem>
                        <ListItemText
                          primary={`${t('queue.room')} ${queue.roomNumber}`}
                          secondary={`${t('queue.currentNumber')}: ${queue.currentQueue} | ${t('queue.waitTime')}: ${queue.estimatedWaitTime} ${t('queue.minutes')}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => {/* TODO: Implement edit */}}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {/* TODO: Implement delete */}}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QueueManagement; 