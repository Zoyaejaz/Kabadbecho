import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Loader2, Info, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'password123'
};

// InputField moved outside the component to prevent re-renders losing focus
const InputField = ({ icon: Icon, type, placeholder, label, value, onChange, error, isPassword, showPass, togglePass }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon size={18} className="text-[#66BB6A]" />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-3 py-2 border rounded-sm focus:ring-[#66BB6A] focus:border-[#66BB6A] text-sm transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
        placeholder={placeholder}
      />
      {isPassword && (
        <button type="button" onClick={togglePass} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#66BB6A]">
          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const AuthModal = ({ isOpen, onClose, redirectPath }) => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
  const navigate = useNavigate();

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Signup State
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [role, setRole] = useState('USER'); // 'USER', 'SCRAP_COLLECTOR'
  const [signupErrors, setSignupErrors] = useState({});
  const [signupSuccessMessage, setSignupSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) newErrors.email = 'Email address required';
    if (!password) newErrors.password = 'Password required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          localStorage.setItem('email', data.email);
          localStorage.setItem('name', data.name);
          onClose(); // Close modal
          
          // Role-based routing
          if (data.role === 'ADMIN') {
            navigate('/admin');
          } else if (data.role === 'SCRAP_COLLECTOR') {
            navigate('/Kabadi');
          } else {
            navigate('/dashboard');
          }
        } else {
          setErrors({
            email: data.message || 'Invalid credentials',
            password: 'Try admin@kabadbecho.com / admin123 or register a new account.'
          });
        }
      })
      .catch((err) => {
        setErrors({
          email: 'Connection error. Make sure your Spring Boot backend is running.',
          password: err.message
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name) newErrors.name = 'Full name is required';
    if (!signupEmail) newErrors.email = 'Email is required';
    if (!phone) newErrors.phone = 'Phone number is required';
    if (!address) newErrors.address = 'Address is required';
    if (!signupPassword) newErrors.password = 'Password is required';
    else if (signupPassword.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setSignupErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: signupEmail,
          phone,
          address,
          password: signupPassword,
          role
        }),
      })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setSignupSuccessMessage('Registration successful! Logging you in...');
          
          // Auto-login after successful registration
          fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: signupEmail, password: signupPassword }),
          })
          .then(async (loginRes) => {
            const loginData = await loginRes.json();
            if (loginRes.ok) {
              localStorage.setItem('token', loginData.token);
              localStorage.setItem('role', loginData.role);
              localStorage.setItem('email', loginData.email);
              localStorage.setItem('name', loginData.name);
              
              setName('');
              setSignupEmail('');
              setPhone('');
              setAddress('');
              setSignupPassword('');
              
              onClose(); // Close modal
              
              // Role-based routing
              if (loginData.role === 'ADMIN') {
                navigate('/admin');
              } else if (loginData.role === 'SCRAP_COLLECTOR') {
                navigate('/Kabadi');
              } else {
                navigate('/dashboard');
              }
            } else {
              // Fallback to login view
              setTimeout(() => {
                setView('login');
                setSignupSuccessMessage('');
              }, 1500);
            }
          })
          .catch(() => {
            setTimeout(() => {
              setView('login');
              setSignupSuccessMessage('');
            }, 1500);
          });
        } else {
          setSignupErrors({
            email: data.message || 'Registration failed'
          });
        }
      })
      .catch((err) => {
        setSignupErrors({
          email: 'Connection error. Make sure your Spring Boot backend is running.'
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-sm bg-white shadow-2xl transition-all animate-fade-in-up">

        {/* Header Gradient */}
        <div className="bg-linear-to-br from-[#2E7D32] to-[#66BB6A] p-6 text-center text-white relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold mb-1">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Account'}
            {view === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-white/90 text-sm">
            {view === 'login' && 'Please login to continue'}
            {view === 'signup' && 'Join the green revolution'}
            {view === 'forgot' && "We'll help you reset it"}
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

          {/* Demo Creds Hint (Only for login) */}
          {view === 'login' && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-sm flex items-start gap-3">
              <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-blue-800 w-full">
                <p className="font-semibold mb-1">Admin Access:</p>
                <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                  <span className="opacity-70">Email:</span> <code className="font-mono">admin@kabadbecho.com</code>
                  <span className="opacity-70">Pass:</span> <code className="font-mono">admin123</code>
                </div>
              </div>
            </div>
          )}

          {view === 'login' && (
            <form onSubmit={handleLogin}>
              <InputField
                icon={Mail}
                type="email"
                label="Email Address"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <InputField
                icon={Lock}
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                isPassword
                showPass={showPassword}
                togglePass={() => setShowPassword(!showPassword)}
              />

              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-xs font-semibold text-[#66BB6A] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#66BB6A] hover:bg-[#43A047] text-white font-bold rounded-sm transition-all shadow-lg hover:shadow-green-200 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
              </button>
            </form>
          )}

          {view === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-1">
              {signupSuccessMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-sm text-center animate-pulse">
                  {signupSuccessMessage}
                </div>
              )}
              <InputField icon={User} type="text" label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} error={signupErrors.name} />
              <InputField icon={Mail} type="email" label="Email Address" placeholder="john@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} error={signupErrors.email} />
              <InputField icon={Phone} type="tel" label="Phone Number" placeholder="+91 0000000000" value={phone} onChange={(e) => setPhone(e.target.value)} error={signupErrors.phone} />
              <InputField icon={MapPin} type="text" label="Address" placeholder="Your City, Area" value={address} onChange={(e) => setAddress(e.target.value)} error={signupErrors.address} />
              <InputField icon={Lock} type="password" label="Password" placeholder="••••••••" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} error={signupErrors.password} />

              {/* Role Selection Option */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Register As</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setRole('USER')}
                    className={`flex flex-col items-center justify-center p-3 border-2 rounded-sm cursor-pointer transition-all ${
                      role === 'USER'
                        ? 'border-[#66BB6A] bg-[#E8F5E9] text-[#2E7D32]'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <User size={24} className={role === 'USER' ? 'text-[#66BB6A]' : 'text-gray-400'} />
                    <span className="text-sm font-bold mt-1">Customer</span>
                    <span className="text-[10px] text-center opacity-80 mt-0.5">I want to sell scrap</span>
                  </div>

                  <div
                    onClick={() => setRole('SCRAP_COLLECTOR')}
                    className={`flex flex-col items-center justify-center p-3 border-2 rounded-sm cursor-pointer transition-all ${
                      role === 'SCRAP_COLLECTOR'
                        ? 'border-[#66BB6A] bg-[#E8F5E9] text-[#2E7D32]'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Truck size={24} className={role === 'SCRAP_COLLECTOR' ? 'text-[#66BB6A]' : 'text-gray-400'} />
                    <span className="text-sm font-bold mt-1">Collector</span>
                    <span className="text-[10px] text-center opacity-80 mt-0.5">I collect scrap</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#66BB6A] hover:bg-[#43A047] text-white font-bold rounded-sm transition-all shadow-lg hover:shadow-green-200 disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
              </button>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={(e) => e.preventDefault()}>
              <InputField icon={Mail} type="email" label="Email Address" placeholder="registered-email@example.com" />
              <button className="w-full py-3 bg-[#66BB6A] hover:bg-[#43A047] text-white font-bold rounded-sm transition-all shadow-lg mt-4">
                Send Reset Link
              </button>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="text-center text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100">
            {view === 'login' ? (
              <p>Don't have an account? <button onClick={() => setView('signup')} className="text-[#66BB6A] font-bold hover:underline">Sign Up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setView('login')} className="text-[#66BB6A] font-bold hover:underline">Login</button></p>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;