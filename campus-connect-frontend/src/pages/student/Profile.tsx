import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { getRegisteredEvents, type Event } from '../../services/eventService';
import { 
  User, 
  Mail, 
  Hash, 
  Building, 
  Calendar, 
  Phone, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Edit3, 
  ArrowLeft, 
  Save, 
  X, 
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';

interface StudentProfileData {
  id?: number | string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  studentOrEmployeeId: string;
  semester: string;
  phone: string;
  bio: string;
  cgpa: string;
  batch: string;
  skills: string[];
}

const LOCAL_PROFILE_KEY = 'campus_connect_student_profile';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfileData>({
    fullName: localStorage.getItem('user_name') || 'Rahul Sharma',
    email: localStorage.getItem('user_email') || '24eg105g19@anurag.edu.in',
    role: 'STUDENT',
    department: localStorage.getItem('user_dept') || 'Computer Science & Engineering',
    studentOrEmployeeId: localStorage.getItem('user_id_num') || '24EG105G19',
    semester: '4th Semester (Year 2)',
    phone: '+91 98765 43210',
    bio: 'Computer Science student passionate about Full-Stack Web Development, Data Structures, and Cloud Computing.',
    cgpa: '8.85',
    batch: '2024 - 2028',
    skills: ['Java', 'React', 'TypeScript', 'SQL', 'Python', 'Spring Boot']
  });

  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'edit'>('overview');
  const [formData, setFormData] = useState<StudentProfileData>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  // Load Profile and Registered Events
  useEffect(() => {
    // 1. Try local storage first
    const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
    let initialProfile = profile;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        initialProfile = { ...profile, ...parsed };
        setProfile(initialProfile);
        setFormData(initialProfile);
      } catch {
        // use default
      }
    }

    // 2. Try fetching from backend /api/users/me
    const fetchBackendProfile = async () => {
      try {
        const response = await api.get('/users/me');
        if (response.data) {
          const merged: StudentProfileData = {
            ...initialProfile,
            fullName: response.data.fullName || initialProfile.fullName,
            email: response.data.email || initialProfile.email,
            department: response.data.department || initialProfile.department,
            studentOrEmployeeId: response.data.studentOrEmployeeId || initialProfile.studentOrEmployeeId,
            role: response.data.role || 'STUDENT'
          };
          setProfile(merged);
          setFormData(merged);
          localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(merged));
        }
      } catch {
        // Backend offline or non-token mode: gracefully rely on localStorage
      }
    };

    fetchBackendProfile();

    // 3. Load Registered Events
    const loadEvents = async () => {
      try {
        const events = await getRegisteredEvents();
        setRegisteredEvents(events || []);
      } catch {
        setRegisteredEvents([]);
      }
    };

    loadEvents();
  }, []);

  const showNotification = (text: string, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (formData.skills.includes(newSkill.trim())) {
      setNewSkill('');
      return;
    }
    const updated = [...formData.skills, newSkill.trim()];
    setFormData({ ...formData, skills: updated });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save locally
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(formData));
      localStorage.setItem('user_name', formData.fullName);
      localStorage.setItem('user_dept', formData.department);
      localStorage.setItem('user_id_num', formData.studentOrEmployeeId);

      // Attempt to save to backend API
      try {
        await api.put('/users/me', {
          fullName: formData.fullName,
          department: formData.department,
          studentOrEmployeeId: formData.studentOrEmployeeId
        });
      } catch {
        // Backend error / offline; local update still persists
      }

      setProfile(formData);
      setActiveTab('overview');
      showNotification('Profile updated successfully!');
    } catch {
      showNotification('Failed to update profile.', true);
    } finally {
      setLoading(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'ST';
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Student Dashboard
          </Link>

          <div className="flex gap-2">
            <Link
              to="/events"
              className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors border border-blue-200"
            >
              Browse Events
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors border border-emerald-200"
            >
              Study Notes
            </Link>
          </div>
        </div>

        {/* Success / Error Notification */}
        {message && (
          <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 border animate-fadeIn ${
            message.isError
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {message.text}
          </div>
        )}

        {/* Hero Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Top Banner Gradient */}
          <div className="h-36 sm:h-44 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative p-6">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Active Student
            </div>
          </div>

          {/* Profile Identity Details */}
          <div className="px-6 sm:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                {/* Avatar with Initials */}
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-3xl sm:text-4xl flex items-center justify-center border-4 border-white shadow-lg ring-4 ring-blue-50">
                  {getInitials(profile.fullName)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{profile.fullName}</h1>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Student
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{profile.department}</p>
                  <p className="text-xs text-slate-400 font-mono">Roll No: {profile.studentOrEmployeeId}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setFormData(profile);
                    setActiveTab(activeTab === 'edit' ? 'overview' : 'edit');
                  }}
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    activeTab === 'edit'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Edit3 className="h-4 w-4" />
                  {activeTab === 'edit' ? 'Cancel Editing' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Quick Academic Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Semester</span>
                <p className="text-base font-extrabold text-slate-800 mt-0.5">{profile.semester}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">CGPA</span>
                <p className="text-base font-extrabold text-emerald-600 mt-0.5">{profile.cgpa} / 10.0</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Batch</span>
                <p className="text-base font-extrabold text-slate-800 mt-0.5">{profile.batch}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Registered Events</span>
                <p className="text-base font-extrabold text-indigo-600 mt-0.5">{registeredEvents.length} Events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <User className="h-4 w-4" /> Academic Overview
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Registered Events
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'events' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {registeredEvents.length}
            </span>
          </button>

          <button
            onClick={() => {
              setFormData(profile);
              setActiveTab('edit');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'edit'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Edit3 className="h-4 w-4" /> Edit Details
          </button>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Personal & Academic Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">Personal & Academic Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Full Legal Name</span>
                    <p className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" /> {profile.fullName}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Institutional Email</span>
                    <p className="text-base font-semibold text-slate-900 flex items-center gap-2 break-all">
                      <Mail className="h-4 w-4 text-slate-400 shrink-0" /> {profile.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Roll / Student ID</span>
                    <p className="text-base font-mono font-bold text-slate-900 flex items-center gap-2">
                      <Hash className="h-4 w-4 text-slate-400" /> {profile.studentOrEmployeeId}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Department / Branch</span>
                    <p className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Building className="h-4 w-4 text-slate-400" /> {profile.department}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Current Semester</span>
                    <p className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" /> {profile.semester}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Contact Number</span>
                    <p className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" /> {profile.phone}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">About Me / Bio</span>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {profile.bio || 'No bio added yet. Click "Edit Details" to add your summary.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Skills & Quick Actions */}
            <div className="space-y-6">
              {/* Skills & Technical Tags Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Skills & Interests</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-indigo-50 text-indigo-700 font-semibold text-xs px-3 py-1.5 rounded-xl border border-indigo-100"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No skills added yet.</p>
                  )}
                </div>
              </div>

              {/* Campus Portal Shortcuts */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-300" />
                  <h3 className="text-base font-bold">Student Hub</h3>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Participate in college technical hackathons, access faculty lecture notes, and track registrations.
                </p>
                <div className="space-y-2 pt-2">
                  <Link
                    to="/dashboard"
                    className="w-full block text-center bg-white text-blue-700 font-bold py-2.5 rounded-xl text-xs hover:bg-blue-50 transition-colors shadow-xs"
                  >
                    Open Student Dashboard
                  </Link>
                  <Link
                    to="/events"
                    className="w-full block text-center bg-blue-500/50 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Explore Campus Events
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. REGISTERED EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Events You Registered For</h3>
                <p className="text-xs text-slate-500 mt-0.5">Your official campus registrations and participation schedule.</p>
              </div>
              <Link
                to="/events"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3.5 py-2 rounded-xl"
              >
                + Register More Events
              </Link>
            </div>

            {registeredEvents.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-700">No registered events yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse through technical workshops, cultural celebrations, and sports events to participate!
                </p>
                <Link
                  to="/events"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Explore Upcoming Events
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registeredEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Registered
                        </span>
                        <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {event.category || 'Workshop'}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">{event.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{event.description}</p>
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-slate-200/70 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        <span>{new Date(event.startDateTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. EDIT PROFILE TAB */}
        {activeTab === 'edit' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit Student Profile</h3>
              <p className="text-xs text-slate-500 mt-0.5">Update your personal information, department, and contact details.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Roll / Student ID</label>
                  <input
                    type="text"
                    name="studentOrEmployeeId"
                    value={formData.studentOrEmployeeId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Department / Branch</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Current Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    placeholder="e.g. 4th Semester (Year 2)"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Contact Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Batch / Year</label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    placeholder="e.g. 2024 - 2028"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">About Me / Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Share your interests, academic goals, or achievements..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Skills Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-700">Skills & Interests</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 font-semibold text-xs px-3 py-1.5 rounded-xl border border-indigo-100"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a new skill (e.g. Python, Machine Learning)..."
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    Add Skill
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
