import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    
    socket.emit('join', user._id);

    socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
      toast.success(notification.message);
    });

    socket.on('orderUpdate', (data) => {
      const message = `Order #${data.orderNumber} status: ${data.status}`;
      setNotifications(prev => [{
        _id: Date.now(),
        message,
        type: 'order',
        createdAt: new Date()
      }, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
      toast.success(message);
    });

    return () => socket.disconnect();
  }, [user]);

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAsRead();
        }}
        className="relative p-2 text-gray-700 hover:text-green-600"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map(notification => (
                <div key={notification._id} className="p-3 border-b hover:bg-gray-50">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;