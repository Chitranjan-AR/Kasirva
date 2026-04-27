import React, { useRef, useEffect, useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const TYPE_ICON = {
  order:        '📦',
  order_update: '🚚',
  approval:     '✅',
  default:      '🔔',
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>

      {/* Bell Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2.5 rounded-xl text-stone-500 hover:text-amber-700 hover:bg-amber-50 transition-all"
        title="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-stone-50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-amber-700 font-semibold hover:underline"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-xs text-stone-400 hover:text-red-500 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-sm font-semibold text-stone-700">All caught up!</p>
                <p className="text-xs text-stone-400 mt-1">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-amber-50 ${!n.read ? 'bg-amber-50/60' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${!n.read ? 'bg-amber-100' : 'bg-stone-100'}`}>
                    {TYPE_ICON[n.type] || TYPE_ICON.default}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${!n.read ? 'text-stone-900' : 'text-stone-600'}`}>
                      {n.title || 'Notification'}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                    <p className="text-xs text-stone-400 mt-1">
                      {new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-stone-100 bg-stone-50 text-center">
              <p className="text-xs text-stone-400">{notifications.length} total notification{notifications.length > 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
