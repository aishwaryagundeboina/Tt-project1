import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Lock, Mail, GraduationCap, School, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState<'STUDENT' | 'FACULTY' | 'ADMIN'>('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user_email', email);
      if (response.data?.fullName) {
        localStorage.setItem('user_name', response.data.fullName);
      }

      // Check role from backend, localStorage cache, or active portal selection
      const savedRole = localStorage.getItem(`user_role_${email.toLowerCase()}`);
      const backendRole = response.data?.role;
      
      const effectiveRole = backendRole || savedRole || targetRole;
      localStorage.setItem('user_role', effectiveRole);
      localStorage.setItem(`user_role_${email.toLowerCase()}`, effectiveRole);

      if (effectiveRole === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (effectiveRole === 'FACULTY') {
        navigate('/faculty-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Sign in to Campus Connect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Select your portal and enter your credentials
          </p>
        </div>

        {/* Portal Role Selector (Student, Faculty, Admin) */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setTargetRole('STUDENT')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg font-bold text-xs transition-all ${
              targetRole === 'STUDENT'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Student
          </button>

          <button
            type="button"
            onClick={() => setTargetRole('FACULTY')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg font-bold text-xs transition-all ${
              targetRole === 'FACULTY'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <School className="h-4 w-4" />
            Faculty
          </button>

          <button
            type="button"
            onClick={() => setTargetRole('ADMIN')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg font-bold text-xs transition-all ${
              targetRole === 'ADMIN'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleLogin}>
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address (e.g. admin@campus.edu)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 text-sm font-bold rounded-xl text-white shadow-md transition-all ${
                targetRole === 'ADMIN'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : targetRole === 'FACULTY'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {loading 
                ? 'Signing in...' 
                : targetRole === 'ADMIN'
                ? 'Sign in to Admin Dashboard'
                : targetRole === 'FACULTY' 
                ? 'Sign in to Faculty Center' 
                : 'Sign in to Student Dashboard'}
            </button>
          </div>

          <div className="text-center text-sm pt-2">
            <span className="text-gray-500">Don't have an account? </span>
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
