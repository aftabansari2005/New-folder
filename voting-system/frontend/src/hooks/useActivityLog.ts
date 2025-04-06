import { useCallback } from 'react';
import { useAuth } from './useAuth';

interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  details: string;
  timestamp: string;
}

export const useActivityLog = () => {
  const { user, token } = useAuth();

  const logActivity = useCallback(async (action: string, details: string) => {
    if (!user || !token) return;

    try {
      const response = await fetch('/api/activity-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          action,
          details,
        }),
      });

      if (!response.ok) {
        console.error('Failed to log activity:', await response.text());
      }
    } catch (error) {
      console.error('Activity logging error:', error);
    }
  }, [user, token]);

  const getActivityLogs = useCallback(async (): Promise<ActivityLog[]> => {
    if (!user || !token) return [];

    try {
      const response = await fetch('/api/activity-logs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  }, [user, token]);

  return {
    logActivity,
    getActivityLogs,
  };
}; 