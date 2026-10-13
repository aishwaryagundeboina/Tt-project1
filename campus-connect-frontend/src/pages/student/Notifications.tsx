import React, { useEffect, useState } from 'react';
import { getMyNotifications, markAsRead, Notification } from '../../services/notificationService';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, readStatus: true } : n));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading notifications...</div>;
  }

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Notifications</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">You have no notifications.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-6 ${notification.readStatus ? 'bg-white' : 'bg-blue-50'} transition-colors`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-semibold ${notification.readStatus ? 'text-gray-800' : 'text-blue-900'}`}>{notification.title}</h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                    {!notification.readStatus && (
                      <button 
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors bg-white px-3 py-1 rounded-full shadow-sm"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
