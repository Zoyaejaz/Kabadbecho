import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Users,
  Lock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import KabadBechoFooter from "../components/Footer";
import AuthModal from "../components/AuthModal";
import API_URL from '../config';

const KabadBechoContact = () => {
  const navigate = useNavigate();
  // We compute this on every render. Changing states (like closing the modal) will re-evaluate this.
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const [formData, setFormData] = useState({
    name: localStorage.getItem('name') || '',
    email: localStorage.getItem('email') || '',
    message: ''
  });
  
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check auth immediately on submit
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setIsAuthModalOpen(true);
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ ...formData, message: '' });
      } else {
        setStatus('error');
      }
    } catch(err) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white pt-20">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false);
          // If they just logged in, update the form data with their name/email
          if (localStorage.getItem('token')) {
            setFormData(prev => ({
              ...prev,
              name: localStorage.getItem('name') || prev.name,
              email: localStorage.getItem('email') || prev.email
            }));
          }
        }} 
      />

      {/* Header */}
      <section className="py-20 bg-linear-to-b from-white to-[#E8F5E9]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow mb-6 animate-fadeIn">
            <Users className="text-[#66BB6A]" size={20} />
            <span className="font-semibold text-[#5D4037]">
              Get In Touch
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-[#5D4037] mb-4">
            Contact <span className="text-[#66BB6A]">Kabad Becho</span>
          </h2>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Have questions or want to schedule a scrap pickup?  
            We’d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-sm shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#E8F5E9] rounded-sm text-[#66BB6A]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#5D4037]">Phone</h4>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-sm shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#E8F5E9] rounded-sm text-[#66BB6A]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#5D4037]">Email</h4>
                    <p className="text-gray-600">support@kabadbecho.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-sm shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#E8F5E9] rounded-sm text-[#66BB6A]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#5D4037]">Address</h4>
                    <p className="text-gray-600">
                      Bhopal, Madhya Pradesh, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-sm shadow-xl relative">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {status === 'success' && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-sm border border-green-200 flex items-center gap-3">
                    <CheckCircle size={20} />
                    <span>Thank you! Your message has been sent successfully.</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-sm border border-red-200 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <span>An error occurred while sending your message.</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-[#66BB6A] to-[#4CAF50] text-white font-bold rounded-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                  {!status && <Send size={20} />}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
      {/*Footer */}
      <KabadBechoFooter/>
      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
      
    </div>
    
  );
};

export default KabadBechoContact;
