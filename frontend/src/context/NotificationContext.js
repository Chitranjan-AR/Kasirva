import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        // Initialize socket connection with proper URL
        const socketURL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';
        const newSocket = io(socketURL, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5
        });
        
        setSocket(newSocket);

        // Handle connection errors
        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });

        // Join user room for real-time notifications
        newSocket.emit('join-room', user.id);

        // Listen for notifications
        newSocket.on('new_order', (data) => {
          if (user.role === 'farmer' && data && data.orderNumber) {
            toast.success(`New order received: #${data.orderNumber}`);
            addNotification({
              type: 'order',
              title: 'New Order',
              message: `Order #${data.orderNumber} for ₹${data.total}`,
              data: data
            });
          }
        });

        newSocket.on('order_update', (data) => {
          if (user.role === 'consumer' && data && data.message) {
            toast.success(data.message);
            addNotification({
              type: 'order_update',
              title: 'Order Update',
              message: data.message,
              data: data
            });
          }
        });

        newSocket.on('farmer_approved', () => {
          if (user.role === 'farmer') {
            toast.success('Your farmer profile has been approved!');
            addNotification({
              type: 'approval',
              title: 'Profile Approved',
              message: 'Your farmer profile has been approved. You can now start selling!'
            });
          }
        });

        return () => {
          newSocket.off('new_order');
          newSocket.off('order_update');
          newSocket.off('farmer_approved');
          newSocket.off('connect_error');
          newSocket.close();
        };
      } catch (error) {
        console.error('Notification setup error:', error);
      }
    }
  }, [isAuthenticated, user]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    socket
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
