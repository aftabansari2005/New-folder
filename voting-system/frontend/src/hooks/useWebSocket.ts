import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNotification } from '../components/NotificationSystem';

interface WebSocketHook {
  socket: Socket | null;
  isConnected: boolean;
  joinQueue: (roomNumber: string) => void;
  leaveQueue: (roomNumber: string) => void;
  refreshQueues: () => void;
}

export const useWebSocket = (): WebSocketHook => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      showNotification('Connected to server', 'success');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      showNotification('Disconnected from server', 'warning');
    });

    socket.on('queueUpdate', (data) => {
      showNotification('Queue updated', 'info');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      showNotification('Connection error', 'error');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [showNotification]);

  const joinQueue = useCallback((roomNumber: string) => {
    if (socketRef.current) {
      socketRef.current.emit('joinQueue', roomNumber);
    }
  }, []);

  const leaveQueue = useCallback((roomNumber: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leaveQueue', roomNumber);
    }
  }, []);

  const refreshQueues = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('refreshQueues');
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    joinQueue,
    leaveQueue,
    refreshQueues,
  };
}; 