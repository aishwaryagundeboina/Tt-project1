import api from './api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  notificationType: string;
  readStatus: boolean;
  createdAt: string;
}

export const getMyNotifications = async (): Promise<Notification[]> => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markAsRead = async (id: number): Promise<void> => {
  await api.put(`/notifications/${id}/read`);
};
