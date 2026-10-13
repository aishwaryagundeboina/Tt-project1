import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/public/Home';
import StudentDashboard from './pages/student/StudentDashboard';
import Events from './pages/student/Events';
import Resources from './pages/student/Resources';
import Community from './pages/student/Community';
import Profile from './pages/student/Profile';
import Notifications from './pages/student/Notifications';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
