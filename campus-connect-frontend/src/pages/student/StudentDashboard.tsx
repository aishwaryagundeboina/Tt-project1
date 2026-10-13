import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedAnnouncements, Announcement } from '../../services/announcementService';
import { getPublishedEvents, getRegisteredEvents, Event } from '../../services/eventService';
import { getAllResources, Resource } from '../../services/resourceService';
import AnnouncementCard from '../../components/dashboard/AnnouncementCard';
import EventCard from '../../components/dashboard/EventCard';
import ResourceCard from '../../components/dashboard/ResourceCard';
import { Bell, Calendar, CheckCircle2, BookOpen, ArrowRight, User } from 'lucide-react';

const StudentDashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'announcements' | 'events' | 'resources' | 'registered'>('announcements');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [announcementsData, publishedEvents, userRegistrations, academicResources] = await Promise.all([
        getPublishedAnnouncements(),
        getPublishedEvents(),
        getRegisteredEvents(),
        getAllResources()
      ]);
      setAnnouncements(announcementsData || []);
      setEvents(publishedEvents || []);
      setRegisteredEvents(userRegistrations || []);
      setResources(academicResources || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    window.addEventListener('announcementsUpdated', fetchDashboardData);
    window.addEventListener('eventsUpdated', fetchDashboardData);
    window.addEventListener('resourcesUpdated', fetchDashboardData);
    return () => {
      window.removeEventListener('announcementsUpdated', fetchDashboardData);
      window.removeEventListener('eventsUpdated', fetchDashboardData);
      window.removeEventListener('resourcesUpdated', fetchDashboardData);
    };
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading your dashboard...</div>;
  }

  const displayedAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedRegisteredEvents = registeredEvents.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Stay updated with campus announcements, events, and study resources.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link 
              to="/profile" 
              className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-lg transition-colors border border-blue-200"
            >
              <User className="h-4 w-4 mr-1.5" />
              My Profile
            </Link>
            <Link 
              to="/admin-dashboard" 
              className="inline-flex items-center text-sm font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-lg transition-colors border border-rose-200"
            >
              Admin Center <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
            <Link 
              to="/faculty-dashboard" 
              className="inline-flex items-center text-sm font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-lg transition-colors border border-purple-200"
            >
              Faculty Center <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
            <Link 
              to="/resources" 
              className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3.5 py-2 rounded-lg transition-colors"
            >
              All Resources <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
            <Link 
              to="/events" 
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3.5 py-2 rounded-lg transition-colors"
            >
              All Events <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dashboard Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setActiveTab('announcements')}
                className={`flex items-center justify-center py-2.5 px-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'announcements'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Bell className="h-4 w-4 mr-1.5 shrink-0" />
                <span className="truncate">Announcements</span>
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'announcements' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {announcements.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center justify-center py-2.5 px-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'events'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Calendar className="h-4 w-4 mr-1.5 shrink-0" />
                <span className="truncate">Events</span>
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'events' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {events.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`flex items-center justify-center py-2.5 px-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'resources'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <BookOpen className="h-4 w-4 mr-1.5 shrink-0" />
                <span className="truncate">Resources</span>
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'resources' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {resources.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('registered')}
                className={`flex items-center justify-center py-2.5 px-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'registered'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5 shrink-0" />
                <span className="truncate">Registered</span>
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'registered' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {registeredEvents.length}
                </span>
              </button>
            </div>

            {/* Section Header & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-4">
              <h2 className="text-xl font-bold text-gray-800">
                {activeTab === 'announcements' && 'Latest Announcements'}
                {activeTab === 'events' && 'Upcoming Campus Events'}
                {activeTab === 'resources' && 'Academic Resources & Study Materials'}
                {activeTab === 'registered' && 'Events You Registered For'}
              </h2>
              <input
                type="text"
                placeholder={
                  activeTab === 'announcements'
                    ? 'Search announcements...'
                    : activeTab === 'resources'
                    ? 'Search subject or title...'
                    : 'Search events...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-64"
              />
            </div>

            {/* Announcements View */}
            {activeTab === 'announcements' && (
              displayedAnnouncements.length === 0 ? (
                <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-100 shadow-sm">
                  {searchTerm ? 'No announcements found matching your search.' : 'No announcements available right now.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedAnnouncements.map((announcement) => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                  ))}
                </div>
              )
            )}

            {/* Campus Events View */}
            {activeTab === 'events' && (
              displayedEvents.length === 0 ? (
                <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-100 shadow-sm">
                  {searchTerm ? 'No events found matching your search.' : 'No upcoming events found.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )
            )}

            {/* Academic Resources View */}
            {activeTab === 'resources' && (
              displayedResources.length === 0 ? (
                <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-100 shadow-sm">
                  {searchTerm ? 'No resources found matching your search.' : 'No academic resources available right now.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )
            )}

            {/* Registered Events View */}
            {activeTab === 'registered' && (
              displayedRegisteredEvents.length === 0 ? (
                <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-100 shadow-sm">
                  {searchTerm ? 'No registered events found matching your search.' : 'You have not registered for any events yet.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedRegisteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Student Profile Quick Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-sm">
                  {(localStorage.getItem('user_name') || 'Rahul Sharma').charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 text-sm truncate">
                    {localStorage.getItem('user_name') || 'Rahul Sharma'}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    {localStorage.getItem('user_dept') || 'Computer Science & Engineering'}
                  </p>
                  <span className="inline-block text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mt-0.5 border border-blue-100">
                    {localStorage.getItem('user_id_num') || '24EG105G19'}
                  </span>
                </div>
              </div>
              <Link
                to="/profile"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
              >
                <User className="h-3.5 w-3.5" /> View Full Student Profile
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('events')}
                  className="w-full flex justify-between items-center p-3.5 bg-blue-50 hover:bg-blue-100/70 transition-colors rounded-xl text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-900 font-semibold text-sm">Upcoming Events</span>
                  </div>
                  <span className="text-blue-600 font-bold bg-white px-2.5 py-1 rounded-md shadow-sm text-sm">
                    {events.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('registered')}
                  className="w-full flex justify-between items-center p-3.5 bg-green-50 hover:bg-green-100/70 transition-colors rounded-xl text-left"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-900 font-semibold text-sm">Registered Events</span>
                  </div>
                  <span className="text-green-600 font-bold bg-white px-2.5 py-1 rounded-md shadow-sm text-sm">
                    {registeredEvents.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('resources')}
                  className="w-full flex justify-between items-center p-3.5 bg-emerald-50 hover:bg-emerald-100/70 transition-colors rounded-xl text-left"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                    <span className="text-emerald-900 font-semibold text-sm">Academic Resources</span>
                  </div>
                  <span className="text-emerald-600 font-bold bg-white px-2.5 py-1 rounded-md shadow-sm text-sm">
                    {resources.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('announcements')}
                  className="w-full flex justify-between items-center p-3.5 bg-purple-50 hover:bg-purple-100/70 transition-colors rounded-xl text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <span className="text-purple-900 font-semibold text-sm">Announcements</span>
                  </div>
                  <span className="text-purple-600 font-bold bg-white px-2.5 py-1 rounded-md shadow-sm text-sm">
                    {announcements.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Navigation Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-lg mb-2">Campus Hub</h3>
              <p className="text-blue-100 text-sm mb-4">
                Access study notes, upcoming hackathons, and connect with faculty and students.
              </p>
              <div className="flex gap-2">
                <Link
                  to="/events"
                  className="flex-1 text-center bg-white text-blue-700 font-medium px-3 py-2 rounded-lg text-xs hover:bg-blue-50 transition-colors shadow-sm"
                >
                  Events Hub
                </Link>
                <Link
                  to="/resources"
                  className="flex-1 text-center bg-blue-500 text-white font-medium px-3 py-2 rounded-lg text-xs hover:bg-blue-400 transition-colors shadow-sm"
                >
                  Resources Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
