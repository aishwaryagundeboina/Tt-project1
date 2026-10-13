import api from './api';

export interface Event {
  id: number;
  title: string;
  description: string;
  venue: string;
  startDateTime: string;
  endDateTime: string;
  registrationDeadline: string;
  capacity: number;
  organizerName: string;
  category: string;
  publicationStatus: string;
  posterUrl?: string;
  currentRegistrations: number;
}

const LOCAL_STORAGE_KEY = 'campus_connect_events';
const LOCAL_STORAGE_REG_KEY = 'campus_connect_registered_event_ids';

const DEFAULT_EVENTS: Event[] = [
  {
    id: 1,
    title: 'Annual Tech Hackathon 2026',
    description: 'A 24-hour hackathon for building innovative solutions for campus and beyond. Great prizes and mentorship available!',
    venue: 'Main Auditorium & Innovation Lab',
    startDateTime: '2026-10-20T09:00:00',
    endDateTime: '2026-10-21T17:00:00',
    registrationDeadline: '2026-10-18T23:59:59',
    capacity: 100,
    organizerName: 'CSE Department',
    category: 'Workshop',
    publicationStatus: 'PUBLISHED',
    currentRegistrations: 42,
    posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    title: 'AI & Cloud Computing Workshop',
    description: 'Hands-on session covering generative AI applications and scalable microservices in modern cloud infrastructure.',
    venue: 'Seminar Hall 2',
    startDateTime: '2026-10-25T14:00:00',
    endDateTime: '2026-10-25T17:30:00',
    registrationDeadline: '2026-10-24T12:00:00',
    capacity: 60,
    organizerName: 'Tech Club',
    category: 'Seminar',
    publicationStatus: 'PUBLISHED',
    currentRegistrations: 28,
    posterUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60'
  }
];

const getLocalEvents = (): Event[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
    return DEFAULT_EVENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_EVENTS;
  }
};

const getLocalRegisteredIds = (): number[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_REG_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const getPublishedEvents = async (): Promise<Event[]> => {
  try {
    const response = await api.get('/events');
    if (Array.isArray(response.data) && response.data.length > 0) {
      // Merge with any locally added events that might not exist in backend yet
      const localEvents = getLocalEvents();
      const backendIds = new Set(response.data.map((e: Event) => e.id));
      const newLocals = localEvents.filter(e => !backendIds.has(e.id));
      const combined = [...newLocals, ...response.data];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combined));
      return combined;
    }
  } catch {
    // Backend offline or unauthorized, gracefully return local storage
  }
  return getLocalEvents();
};

export const getRegisteredEvents = async (): Promise<Event[]> => {
  let serverRegistrations: Event[] = [];
  try {
    const response = await api.get('/events/my-registrations');
    if (Array.isArray(response.data) && response.data.length > 0) {
      serverRegistrations = response.data;
    }
  } catch {
    // Backend offline or unauthorized, gracefully continue
  }

  const regIds = getLocalRegisteredIds();
  const allEvents = getLocalEvents();

  const registeredMap = new Map<number, Event>();

  // 1. Add server registrations
  serverRegistrations.forEach(e => registeredMap.set(Number(e.id), e));

  // 2. Add local registrations
  regIds.forEach(id => {
    const found = allEvents.find(e => Number(e.id) === Number(id));
    if (found) {
      registeredMap.set(Number(found.id), found);
    }
  });

  return Array.from(registeredMap.values());
};

export const registerForEvent = async (eventId: number): Promise<string> => {
  const numericId = Number(eventId);
  const registeredIds = getLocalRegisteredIds();

  if (!registeredIds.some(id => Number(id) === numericId)) {
    registeredIds.push(numericId);
    localStorage.setItem(LOCAL_STORAGE_REG_KEY, JSON.stringify(registeredIds));
  }

  // Update registration count on the event
  const events = getLocalEvents();
  const event = events.find(e => Number(e.id) === numericId);
  if (event) {
    event.currentRegistrations = (event.currentRegistrations || 0) + 1;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }

  try {
    await api.post(`/events/${eventId}/registrations`);
  } catch {
    // Local registration still succeeds
  }

  // Broadcast event so StudentDashboard and other components refresh immediately
  window.dispatchEvent(new Event('eventsUpdated'));

  return 'Successfully registered for the event';
};

export const createEvent = async (data: Partial<Event>): Promise<Event> => {
  const currentEvents = getLocalEvents();
  const newEvent: Event = {
    id: Date.now(),
    title: data.title || 'Untitled Event',
    description: data.description || '',
    venue: data.venue || 'Campus Venue',
    startDateTime: data.startDateTime || new Date().toISOString(),
    endDateTime: data.endDateTime || new Date().toISOString(),
    registrationDeadline: data.registrationDeadline || data.startDateTime || new Date().toISOString(),
    capacity: data.capacity || 50,
    organizerName: data.organizerName || 'Faculty Organizer',
    category: data.category || 'Workshop',
    publicationStatus: data.publicationStatus || 'PUBLISHED',
    posterUrl: data.posterUrl || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=60',
    currentRegistrations: 0
  };

  try {
    const response = await api.post('/events', data);
    if (response.data && response.data.id) {
      newEvent.id = response.data.id;
    }
  } catch (apiError) {
    console.warn('Backend event creation warning (saved locally):', apiError);
  }

  // Save to localStorage regardless of backend status
  const updatedEvents = [newEvent, ...currentEvents];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEvents));

  // Notify all listeners
  window.dispatchEvent(new Event('eventsUpdated'));

  return newEvent;
};
