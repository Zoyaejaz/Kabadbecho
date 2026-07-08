import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Recycle, Leaf, Info, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

const DEMO_CREDENTIALS = {
  email: 'admin@kabadbecho.com',
  password: 'admin123'
};

const KabadBechoLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      fetch('http://localhost:8080/api/auth/login', {
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

  return (
    <div className="min-h-screen bg-[#F1F8E9] flex items-center justify-center p-4 pt-28 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#AED581]/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-[#81C784]/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] bg-[#4DB6AC]/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 sm:p-10 relative overflow-hidden">

          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#66BB6A] via-[#9CCC65] to-[#26A69A]"></div>

          {/* Subtle Leaf Decoration */}
          <Leaf className="absolute -top-6 -right-6 text-[#E8F5E9] transform rotate-12" size={120} />

          {/* Header */}
          <div className="text-center mb-10 relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-tr from-[#66BB6A] to-[#AED581] rounded-2xl mb-6 shadow-lg shadow-green-200 transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <Recycle className="text-white drop-shadow-md" size={40} />
            </div>
            <h2 className="text-3xl font-extrabold text-[#2E7D32] mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 font-medium">
              Log in to your Kabad Becho account
            </p>
          </div>

          {/* Demo Credentials Alert - Styled nicer */}
          <div className="mb-8 p-4 bg-[#E3F2FD] border border-[#BBDEFB] rounded-2xl flex items-start space-x-3 transition-opacity duration-300 hover:opacity-100">
            <Info className="text-[#1976D2] shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-[#0D47A1] text-sm mb-1">Admin Access</h3>
              <div className="text-xs text-[#1565C0] font-medium space-y-1">
                <div className="flex items-center gap-2">
                  <span className="opacity-70">Email:</span>
                  <code className="bg-white/60 px-2 py-0.5 rounded text-[#0D47A1]">{DEMO_CREDENTIALS.email}</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="opacity-70">Pass:</span>
                  <code className="bg-white/60 px-2 py-0.5 rounded text-[#0D47A1]">{DEMO_CREDENTIALS.password}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#558B2F] ml-1">Email Address</label>
              <div className={`
                relative group transition-all duration-300 rounded-xl
                ${focusedInput === 'email' ? 'shadow-[0_0_0_4px_rgba(102,187,106,0.2)]' : ''}
              `}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`transition-colors duration-300 ${focusedInput === 'email' ? 'text-[#66BB6A]' : 'text-gray-400'}`} size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="name@example.com"
                  className={`
                    w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-300 font-medium text-gray-700 placeholder-gray-400
                    ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-100 hover:border-gray-200'}
                    ${focusedInput === 'email' && !errors.email ? 'border-[#66BB6A] bg-white' : ''}
                  `}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-semibold ml-1 flex items-center animate-shake">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#558B2F] ml-1">Password</label>
              <div className={`
                relative group transition-all duration-300 rounded-xl
                ${focusedInput === 'password' ? 'shadow-[0_0_0_4px_rgba(102,187,106,0.2)]' : ''}
              `}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`transition-colors duration-300 ${focusedInput === 'password' ? 'text-[#66BB6A]' : 'text-gray-400'}`} size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Enter your password"
                  className={`
                    w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-300 font-medium text-gray-700 placeholder-gray-400
                    ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-100 hover:border-gray-200'}
                    ${focusedInput === 'password' && !errors.password ? 'border-[#66BB6A] bg-white' : ''}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#66BB6A] transition-colors duration-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-semibold ml-1 flex items-center animate-shake">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer group select-none">
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                  ${rememberMe ? 'bg-[#66BB6A] border-[#66BB6A]' : 'border-gray-300 bg-white group-hover:border-[#66BB6A]'}
                `}>
                  {rememberMe && <ArrowRight size={12} className="text-white transform -rotate-45" />}
                </div>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="hidden"
                />
                <span className="ml-2 text-sm text-gray-600 font-medium group-hover:text-[#2E7D32] transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-[#66BB6A] hover:text-[#2E7D32] font-bold transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-linear-to-r from-[#66BB6A] to-[#43A047] text-white font-bold text-lg rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Logging In...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Sign In</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform relative z-10" size={20} />
                  <div className="absolute inset-0 bg-linear-to-r from-[#43A047] to-[#2E7D32] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-xs font-semibold text-gray-400 uppercase tracking-widest">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group">
              <span className="text-xl group-hover:scale-110 transition-transform">G</span>
              <span className="text-sm font-semibold text-gray-600">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group">
              <span className="text-xl group-hover:scale-110 transition-transform">📱</span>
              <span className="text-sm font-semibold text-gray-600">Phone</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-gray-500 font-medium">
            Don't have an account?{' '}
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="text-[#66BB6A] hover:text-[#2E7D32] font-bold hover:underline transition-all"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default KabadBechoLogin;