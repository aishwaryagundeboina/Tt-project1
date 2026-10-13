import api from './api';

export interface Announcement {
  id: number;
  title: string;
  description: string;
  category: string;
  authorName: string;
  publicationStatus: string;
  attachmentUrl?: string;
  createdAt: string;
}

const LOCAL_STORAGE_KEY = 'campus_connect_announcements';

const getLocalAnnouncements = (): Announcement[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getPublishedAnnouncements = async (): Promise<Announcement[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return getLocalAnnouncements();
};

export const createAnnouncement = async (data: Partial<Announcement>): Promise<Announcement> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const currentAnnouncements = getLocalAnnouncements();
  const newAnnouncement: Announcement = {
    id: Date.now(),
    title: data.title || '',
    description: data.description || '',
    category: data.category || 'General',
    authorName: data.authorName || 'Faculty Member',
    publicationStatus: data.publicationStatus || 'PUBLISHED',
    createdAt: new Date().toISOString()
  };
  
  const updatedAnnouncements = [newAnnouncement, ...currentAnnouncements];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAnnouncements));
  
  // Dispatch custom event so other components can refresh immediately
  window.dispatchEvent(new Event('announcementsUpdated'));
  
  return newAnnouncement;
};
