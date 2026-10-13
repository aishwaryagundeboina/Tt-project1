import React, { useState } from 'react';
import { Event, registerForEvent } from '../../services/eventService';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface Props {
  event: Event;
}

const EventCard: React.FC<Props> = ({ event }) => {
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');

  const checkIsRegistered = () => {
    try {
      const ids: number[] = JSON.parse(localStorage.getItem('campus_connect_registered_event_ids') || '[]');
      return ids.some(id => Number(id) === Number(event.id));
    } catch {
      return false;
    }
  };

  const isAlreadyRegistered = checkIsRegistered();
  const isFull = (event.currentRegistrations || 0) >= event.capacity;
  const isPastDeadline = event.registrationDeadline 
    ? (!isNaN(new Date(event.registrationDeadline).getTime()) && new Date() > new Date(event.registrationDeadline))
    : false;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'TBA';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await registerForEvent(event.id);
      setMessage('Successfully registered!');
      event.currentRegistrations = (event.currentRegistrations || 0) + 1;
    } catch (err: any) {
      setMessage(err.response?.data || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {event.posterUrl && (
        <img src={event.posterUrl} alt={event.title} className="w-full h-44 object-cover" />
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
           <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
           <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-medium">{event.category || 'Event'}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{event.description}</p>
        
        <div className="space-y-2 mb-5 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-indigo-500" /> {formatDate(event.startDateTime)}</div>
          <div className="flex items-center"><Clock className="h-4 w-4 mr-2 text-indigo-500" /> {formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}</div>
          <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-indigo-500" /> {event.venue}</div>
          <div className="flex items-center"><Users className="h-4 w-4 mr-2 text-indigo-500" /> {event.currentRegistrations || 0} / {event.capacity} Registered</div>
        </div>
        
        {message && (
          <div className={`text-sm mb-4 p-2.5 rounded-lg text-center font-medium ${message.includes('Success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        <button 
          onClick={handleRegister} 
          disabled={isFull || isPastDeadline || registering || isAlreadyRegistered || message.includes('Success')}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
            isAlreadyRegistered || message.includes('Success')
              ? 'bg-emerald-100 text-emerald-800 cursor-default'
              : isFull || isPastDeadline
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
          }`}
        >
          {isAlreadyRegistered || message.includes('Success') ? '✓ Registered' : isFull ? 'Event Full' : isPastDeadline ? 'Registration Closed' : registering ? 'Registering...' : 'Register Now'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
