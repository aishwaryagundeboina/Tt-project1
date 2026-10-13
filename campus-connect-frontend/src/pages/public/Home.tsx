import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center">
        <GraduationCap className="h-24 w-24 text-blue-600 mb-6" />
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Welcome to Campus Connect
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
            The ultimate smart campus management and student community portal. Connect with faculty, access academic resources, and stay updated with campus events.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition transform hover:-translate-y-0.5">
                Sign In
            </Link>
            <Link to="/register" className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold shadow-md border border-gray-200 hover:bg-gray-50 transition transform hover:-translate-y-0.5">
                Register
            </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-indigo-200/60 flex flex-wrap justify-center gap-3 text-xs font-semibold">
            <Link to="/dashboard" className="px-3.5 py-2 bg-white/80 hover:bg-white text-blue-700 rounded-lg shadow-xs transition-colors">
                🎓 Student Dashboard
            </Link>
            <Link to="/faculty-dashboard" className="px-3.5 py-2 bg-white/80 hover:bg-white text-emerald-700 rounded-lg shadow-xs transition-colors">
                🏛️ Faculty Center
            </Link>
            <Link to="/admin-dashboard" className="px-3.5 py-2 bg-white/80 hover:bg-white text-rose-700 rounded-lg shadow-xs transition-colors">
                🛡️ Admin Control Center
            </Link>
        </div>
    </div>
  );
};

export default Home;
