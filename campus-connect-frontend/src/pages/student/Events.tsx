import React, { useEffect, useState } from 'react';
import { getPublishedEvents, getRegisteredEvents, Event } from '../../services/eventService';
import EventCard from '../../components/dashboard/EventCard';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'registered'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [published, registered] = await Promise.all([
          getPublishedEvents(),
          getRegisteredEvents()
        ]);
        setEvents(published);
        setRegisteredEvents(registered);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    window.addEventListener('eventsUpdated', fetchEvents);
    return () => {
      window.removeEventListener('eventsUpdated', fetchEvents);
    };
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading events...</div>;
  }

  const displayedEvents = (activeTab === 'all' ? events : registeredEvents)
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b pb-4 gap-4">
           <div>
             <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Campus Events</h1>
             <p className="text-gray-500">Discover and register for upcoming events and workshops.</p>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <input
               type="text"
               placeholder="Search events..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
             <div className="flex bg-gray-100 rounded-lg p-1">
               <button
                 onClick={() => setActiveTab('all')}
                 className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
               >
                 All Events
               </button>
               <button
                 onClick={() => setActiveTab('registered')}
                 className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'registered' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
               >
                 My Registrations
               </button>
             </div>
           </div>
        </div>
        
        {displayedEvents.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center text-gray-500 border border-gray-100 shadow-sm">
              {searchTerm ? 'No events found matching your search.' : activeTab === 'registered' ? 'You have not registered for any events yet.' : 'No upcoming events found.'}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Events;
