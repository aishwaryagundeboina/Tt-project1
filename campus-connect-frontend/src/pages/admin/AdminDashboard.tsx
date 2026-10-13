import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Bell, 
  Calendar, 
  BookOpen, 
  ShieldCheck, 
  Trash2, 
  UserCheck, 
  UserX, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Activity,
  Layers
} from 'lucide-react';

import { getPublishedAnnouncements, createAnnouncement, type Announcement } from '../../services/announcementService';
import { getPublishedEvents, type Event } from '../../services/eventService';
import { getAllResources, type Resource } from '../../services/resourceService';

interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  department: string;
  status: 'ACTIVE' | 'SUSPENDED';
  joinedDate: string;
}

const DEFAULT_USERS: SystemUser[] = [
  { id: '1', fullName: 'Campus Administrator', email: 'admin@campus.edu', role: 'ADMIN', department: 'Administration', status: 'ACTIVE', joinedDate: '2026-08-01' },
  { id: '2', fullName: 'Dr. Sunadha Rao', email: 'sunadha@gmail.com', role: 'FACULTY', department: 'Computer Science', status: 'ACTIVE', joinedDate: '2026-08-15' },
  { id: '3', fullName: 'Prof. Sharma', email: 'sharma@campus.edu', role: 'FACULTY', department: 'Information Technology', status: 'ACTIVE', joinedDate: '2026-09-01' },
  { id: '4', fullName: 'Rahul Sharma', email: '24eg105g19@anurag.edu.in', role: 'STUDENT', department: 'Computer Science', status: 'ACTIVE', joinedDate: '2026-09-10' },
  { id: '5', fullName: 'Priya Patel', email: 'priya.student@campus.edu', role: 'STUDENT', department: 'Electronics', status: 'ACTIVE', joinedDate: '2026-09-12' },
  { id: '6', fullName: 'Ananya Deshmukh', email: 'ananya.p@campus.edu', role: 'STUDENT', department: 'Computer Science', status: 'ACTIVE', joinedDate: '2026-09-18' }
];

const LOCAL_USERS_KEY = 'campus_connect_admin_users';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'announcements' | 'events' | 'resources' | 'broadcast'>('users');
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'STUDENT' | 'FACULTY' | 'ADMIN'>('ALL');
  
  // New User Form State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'STUDENT' | 'FACULTY' | 'ADMIN'>('STUDENT');
  const [newUserDept, setNewUserDept] = useState('');

  // Emergency Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('');

  // Load Data
  const loadData = async () => {
    // 1. Users
    const storedUsers = localStorage.getItem(LOCAL_USERS_KEY);
    if (!storedUsers) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      setUsers(DEFAULT_USERS);
    } else {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch {
        setUsers(DEFAULT_USERS);
      }
    }

    // 2. Announcements, Events, Resources
    try {
      const [annData, evData, resData] = await Promise.all([
        getPublishedAnnouncements(),
        getPublishedEvents(),
        getAllResources()
      ]);
      setAnnouncements(annData || []);
      setEvents(evData || []);
      setResources(resData || []);
    } catch (e) {
      console.error('Error loading admin data', e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('announcementsUpdated', loadData);
    window.addEventListener('eventsUpdated', loadData);
    window.addEventListener('resourcesUpdated', loadData);
    return () => {
      window.removeEventListener('announcementsUpdated', loadData);
      window.removeEventListener('eventsUpdated', loadData);
      window.removeEventListener('resourcesUpdated', loadData);
    };
  }, []);

  const saveUsers = (updatedUsers: SystemUser[]) => {
    setUsers(updatedUsers);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updatedUsers));
  };

  const handleToggleUserStatus = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'ACTIVE' ? ('SUSPENDED' as const) : ('ACTIVE' as const) };
      }
      return u;
    });
    saveUsers(updated);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to remove this user from the system?')) {
      const updated = users.filter(u => u.id !== userId);
      saveUsers(updated);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: SystemUser = {
      id: Date.now().toString(),
      fullName: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept || 'General',
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    saveUsers([newUser, ...users]);
    localStorage.setItem(`user_role_${newUserEmail.toLowerCase()}`, newUserRole);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserDept('');
  };

  // Content deletion helpers
  const handleDeleteAnnouncement = (id: number) => {
    if (window.confirm('Delete this announcement across the campus?')) {
      const stored = JSON.parse(localStorage.getItem('campus_connect_announcements') || '[]');
      const filtered = stored.filter((a: Announcement) => a.id !== id);
      localStorage.setItem('campus_connect_announcements', JSON.stringify(filtered));
      window.dispatchEvent(new Event('announcementsUpdated'));
      setAnnouncements(filtered);
    }
  };

  const handleDeleteEvent = (id: number) => {
    if (window.confirm('Delete this campus event?')) {
      const stored = JSON.parse(localStorage.getItem('campus_connect_events') || '[]');
      const filtered = stored.filter((e: Event) => e.id !== id);
      localStorage.setItem('campus_connect_events', JSON.stringify(filtered));
      window.dispatchEvent(new Event('eventsUpdated'));
      setEvents(filtered);
    }
  };

  const handleDeleteResource = (id: number) => {
    if (window.confirm('Remove this academic resource?')) {
      const stored = JSON.parse(localStorage.getItem('campus_connect_resources') || '[]');
      const filtered = stored.filter((r: Resource) => r.id !== id);
      localStorage.setItem('campus_connect_resources', JSON.stringify(filtered));
      window.dispatchEvent(new Event('resourcesUpdated'));
      setResources(filtered);
    }
  };

  // Emergency Broadcast
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAnnouncement({
        title: `🚨 [ADMIN ALERT] ${broadcastTitle}`,
        description: broadcastMessage,
        category: 'Important',
        authorName: 'College Administration'
      });
      setAlertStatus('Campus broadcast published successfully to all dashboards!');
      setBroadcastTitle('');
      setBroadcastMessage('');
      setTimeout(() => setAlertStatus(''), 4000);
    } catch {
      setAlertStatus('Failed to publish alert.');
    }
  };

  const filteredUsers = users
    .filter(u => roleFilter === 'ALL' || u.role === roleFilter)
    .filter(u => 
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-rose-600 text-white p-3.5 rounded-2xl shadow-md">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Admin Authority
                </span>
                <span className="text-xs text-slate-500 font-medium">CampusConnect v2.0</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Admin Control Center
              </h1>
            </div>
          </div>

          {/* Quick Portal Switchers */}
          <div className="flex flex-wrap gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors border border-blue-200"
            >
              Student View <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
            <Link
              to="/faculty-dashboard"
              className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors border border-emerald-200"
            >
              Faculty Center <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
              <Users className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{users.length}</div>
            <div className="text-xs text-slate-400 mt-1">Students, Faculty & Staff</div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Announcements</span>
              <Bell className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{announcements.length}</div>
            <div className="text-xs text-slate-400 mt-1">Published updates</div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Campus Events</span>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{events.length}</div>
            <div className="text-xs text-slate-400 mt-1">Workshops & festivals</div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Study Notes</span>
              <BookOpen className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{resources.length}</div>
            <div className="text-xs text-slate-400 mt-1">Academic resources</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex flex-wrap border-b border-slate-200 bg-slate-50/50 p-2 gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'users'
                  ? 'bg-white text-rose-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="h-4 w-4" />
              User Directory ({users.length})
            </button>

            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'announcements'
                  ? 'bg-white text-rose-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="h-4 w-4" />
              Manage Announcements ({announcements.length})
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'events'
                  ? 'bg-white text-rose-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Manage Events ({events.length})
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'resources'
                  ? 'bg-white text-rose-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Manage Resources ({resources.length})
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'broadcast'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              Emergency Broadcast
            </button>
          </div>

          <div className="p-6">
            {/* 1. USERS DIRECTORY TAB */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search name, email, dept..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <select
                      value={roleFilter}
                      onChange={e => setRoleFilter(e.target.value as any)}
                      className="py-2 px-3 border border-slate-200 rounded-xl text-sm outline-none bg-white font-medium text-slate-700"
                    >
                      <option value="ALL">All Roles</option>
                      <option value="STUDENT">Students Only</option>
                      <option value="FACULTY">Faculty Only</option>
                      <option value="ADMIN">Admins Only</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Add User
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider text-left">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400">
                            No users found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(user => (
                          <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{user.fullName}</div>
                              <div className="text-xs text-slate-500">{user.email}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                user.role === 'ADMIN'
                                  ? 'bg-rose-100 text-rose-800'
                                  : user.role === 'FACULTY'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">{user.department}</td>
                            <td className="py-3.5 px-4">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                user.status === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleUserStatus(user.id)}
                                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    user.status === 'ACTIVE'
                                      ? 'text-amber-600 hover:bg-amber-50'
                                      : 'text-emerald-600 hover:bg-emerald-50'
                                  }`}
                                  title={user.status === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
                                >
                                  {user.status === 'ACTIVE' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. MANAGE ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-lg">Published Campus Announcements</h3>
                </div>

                <div className="space-y-3">
                  {announcements.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
                      No active announcements found.
                    </div>
                  ) : (
                    announcements.map(ann => (
                      <div key={ann.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-4 shadow-2xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded">
                              {ann.category || 'General'}
                            </span>
                            <span className="text-xs text-slate-400">By {ann.authorName}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 mt-1 text-base">{ann.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ann.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          title="Delete announcement"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 3. MANAGE EVENTS */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg">Active Campus Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.length === 0 ? (
                    <div className="col-span-2 p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
                      No events currently registered.
                    </div>
                  ) : (
                    events.map(ev => (
                      <div key={ev.id} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-2xs">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">
                              {ev.category || 'Event'}
                            </span>
                            <button
                              onClick={() => handleDeleteEvent(ev.id)}
                              className="text-rose-600 hover:bg-rose-50 p-1 rounded"
                              title="Delete event"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <h4 className="font-bold text-slate-900 mt-2 text-base">{ev.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{ev.venue} • Capacity: {ev.capacity}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                          <span>Registrations: {ev.currentRegistrations || 0}</span>
                          <span>{new Date(ev.startDateTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 4. MANAGE RESOURCES */}
            {activeTab === 'resources' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg">Academic Notes & Materials</h3>
                <div className="space-y-3">
                  {resources.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
                      No academic resources available.
                    </div>
                  ) : (
                    resources.map(res => (
                      <div key={res.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                              {res.subject}
                            </span>
                            <span className="text-xs text-slate-400">By {res.uploaderName}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 mt-1">{res.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{res.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteResource(res.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          title="Delete resource"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 5. EMERGENCY BROADCAST */}
            {activeTab === 'broadcast' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-rose-900 text-sm">Emergency System Broadcast</h4>
                    <p className="text-xs text-rose-700 mt-0.5">
                      This will send an immediate, high-priority alert to all student and faculty dashboards across campus.
                    </p>
                  </div>
                </div>

                {alertStatus && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-sm font-semibold rounded-xl border border-emerald-200">
                    {alertStatus}
                  </div>
                )}

                <form onSubmit={handleSendBroadcast} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Alert Headline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Campus Closed Due to Weather / Exam Schedule Updated"
                      value={broadcastTitle}
                      onChange={e => setBroadcastTitle(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Broadcast Details</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Enter detailed notice, instructions, contact points..."
                      value={broadcastMessage}
                      onChange={e => setBroadcastMessage(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      Broadcast Now
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New System User</h3>
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jdoe@campus.edu"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">System Role</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty Member</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={newUserDept}
                  onChange={e => setNewUserDept(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
