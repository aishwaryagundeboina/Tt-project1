import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { createAnnouncement } from '../../services/announcementService';
import { createEvent } from '../../services/eventService';
import { createResource } from '../../services/resourceService';

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'events' | 'resources'>('announcements');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Announcement State
  const [aTitle, setATitle] = useState('');
  const [aDesc, setADesc] = useState('');
  const [aCategory, setACategory] = useState('General');

  // Event State
  const [eTitle, setETitle] = useState('');
  const [eDesc, setEDesc] = useState('');
  const [eVenue, setEVenue] = useState('');
  const [eStart, setEStart] = useState('');
  const [eEnd, setEEnd] = useState('');
  const [eCap, setECap] = useState(50);
  const [eCat, setECat] = useState('Workshop');

  // Resource State
  const [rTitle, setRTitle] = useState('');
  const [rDesc, setRDesc] = useState('');
  const [rCourse, setRCourse] = useState('');
  const [rUrl, setRUrl] = useState('');
  const [rNotes, setRNotes] = useState('');

  const displayMessage = (msg: string, isError = false) => {
    setMessage(isError ? `Error: ${msg}` : msg);
    setTimeout(() => setMessage(''), 5000);
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAnnouncement({
        title: aTitle, description: aDesc, category: aCategory, publicationStatus: 'PUBLISHED'
      });
      displayMessage('Announcement posted successfully!');
      setATitle(''); setADesc('');
    } catch (err: any) {
      displayMessage(err.message || 'Failed to post announcement', true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEvent({
        title: eTitle, description: eDesc, venue: eVenue, 
        startDateTime: eStart, endDateTime: eEnd, capacity: eCap, category: eCat, publicationStatus: 'PUBLISHED'
      });
      displayMessage('Event created successfully!');
      setETitle(''); setEDesc(''); setEVenue(''); setEStart(''); setEEnd('');
    } catch (err: any) {
      displayMessage(err.response?.data?.message || 'Failed to create event', true);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createResource({
        title: rTitle, 
        description: rDesc, 
        subject: rCourse, 
        fileUrl: rUrl, 
        category: 'DOCUMENT',
        notesContent: rNotes || rDesc
      });
      displayMessage('Resource uploaded successfully!');
      setRTitle(''); setRDesc(''); setRCourse(''); setRUrl(''); setRNotes('');
    } catch (err: any) {
      displayMessage(err.response?.data?.message || 'Failed to upload resource', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Faculty Control Center</h1>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin-dashboard"
              className="inline-flex items-center text-sm font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors border border-rose-200"
            >
              Admin Center →
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors border border-blue-200"
            >
              View Student Dashboard →
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b">
            <button onClick={() => setActiveTab('announcements')} className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'announcements' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}>Announcements</button>
            <button onClick={() => setActiveTab('events')} className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'events' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}>Events</button>
            <button onClick={() => setActiveTab('resources')} className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'resources' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}>Resources</button>
          </div>

          <div className="p-8">
            {message && (
              <div className={`p-4 rounded-lg mb-6 ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message}
              </div>
            )}

            {activeTab === 'announcements' && (
              <form onSubmit={handlePostAnnouncement} className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Post Announcement</h2>
                <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={aTitle} onChange={e => setATitle(e.target.value)} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                <div><label className="block text-sm font-medium mb-1">Category</label>
                  <select value={aCategory} onChange={e => setACategory(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>General</option><option>Academic</option><option>Event</option><option>Important</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={aDesc} onChange={e => setADesc(e.target.value)} required rows={4} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                <div className="text-right"><button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">Publish</button></div>
              </form>
            )}

            {activeTab === 'events' && (
              <form onSubmit={handleCreateEvent} className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Create Event</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="block text-sm font-medium mb-1">Event Title</label><input type="text" value={eTitle} onChange={e => setETitle(e.target.value)} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                  <div><label className="block text-sm font-medium mb-1">Start Date & Time</label><input type="datetime-local" value={eStart} onChange={e => setEStart(e.target.value)} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                  <div><label className="block text-sm font-medium mb-1">End Date & Time</label><input type="datetime-local" value={eEnd} onChange={e => setEEnd(e.target.value)} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                  <div><label className="block text-sm font-medium mb-1">Venue</label><input type="text" value={eVenue} onChange={e => setEVenue(e.target.value)} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                  <div><label className="block text-sm font-medium mb-1">Capacity</label><input type="number" value={eCap} onChange={e => setECap(Number(e.target.value))} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                  <div className="col-span-2"><label className="block text-sm font-medium mb-1">Category</label>
                    <select value={eCat} onChange={e => setECat(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>Workshop</option><option>Seminar</option><option>Cultural</option><option>Sports</option>
                    </select>
                  </div>
                  <div className="col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={eDesc} onChange={e => setEDesc(e.target.value)} required rows={3} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                </div>
                <div className="text-right"><button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">Create Event</button></div>
              </form>
            )}

            {activeTab === 'resources' && (
              <form onSubmit={handleUploadResource} className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Upload Resource & Study Notes</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Resource Title</label>
                  <input type="text" value={rTitle} onChange={e => setRTitle(e.target.value)} placeholder="e.g. Unit 1 to 5 Comprehensive Lecture Notes" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course Name / Code</label>
                  <input type="text" value={rCourse} onChange={e => setRCourse(e.target.value)} placeholder="e.g. CS301 - Data Structures" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brief Summary</label>
                  <input type="text" value={rDesc} onChange={e => setRDesc(e.target.value)} placeholder="Brief summary of what these notes cover..." required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject Notes & Content (Read directly in portal)</label>
                  <textarea 
                    value={rNotes} 
                    onChange={e => setRNotes(e.target.value)} 
                    rows={6} 
                    placeholder="Enter or paste full subject notes, syllabus topics, formulas, definitions, code snippets, or review material..." 
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Students will be able to read these complete notes directly inside the interactive Notes Reader.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Direct File Link <span className="text-gray-400 font-normal">(Optional - Google Drive, Dropbox, PDF link)</span></label>
                  <input type="url" value={rUrl} onChange={e => setRUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
                </div>
                <div className="text-right">
                  <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm">
                    Publish Notes & Resource
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
