import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Calendar, Clock, Phone, CheckCircle, ArrowRight, Truck, ArrowLeft, Mail, MapPin, Scale, Camera, X } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import API_URL from '../config';

const BookPickup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const serviceName = searchParams.get('serviceName');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    weight: '',
    scrapType: [],
    date: '',
    time: '',
    notes: ''
  });

  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const scrapTypes = [
    { id: 'paper', label: 'Paper Scrap', icon: '📄', desc: 'Newspapers, Cardboard' },
    { id: 'plastic', label: 'Plastic Scrap', icon: '🥤', desc: 'Bottles, Containers' },
    { id: 'metal', label: 'Metal Scrap', icon: '🔩', desc: 'Iron, Copper, Aluminum' },
    { id: 'wood', label: 'Wood Scrap', icon: '🪵', desc: 'Furniture, Crates' },
    { id: 'E-Waste', label: 'E-Waste', icon: '💻', desc: 'Electronics, Gadgets' },
    { id: 'mixed', label: 'Mixed Scrap', icon: '🗃️', desc: 'Other / Combined' },
  ];

  const isDashboard = location.pathname.startsWith('/dashboard');

  // Autofill login details and fetch last booking info
  useEffect(() => {
    const userEmail = localStorage.getItem('email') || '';
    const userName = localStorage.getItem('name') || '';

    setFormData(prev => ({
      ...prev,
      email: userEmail,
      name: userName
    }));

    if (userEmail) {
      const token = localStorage.getItem('token');
      fetch(`${API_URL}/api/pickups/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(async (res) => {
          if (res.ok) {
            const bookings = await res.json();
            if (bookings && bookings.length > 0) {
              const lastBooking = bookings[0];
              setFormData(prev => ({
                ...prev,
                name: lastBooking.name || prev.name,
                phone: lastBooking.phone || prev.phone,
                address: lastBooking.address || prev.address
              }));
            }
          }
        })
        .catch(err => console.log("Failed to fetch last booking", err));
    }
  }, []);

  // Pre-select scrap category from query parameter if present
  useEffect(() => {
    if (serviceName) {
      const matched = scrapTypes.find(t => t.label.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(t.id.toLowerCase()));
      if (matched) {
        setFormData(prev => ({
          ...prev,
          scrapType: [matched.id]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          scrapType: ['mixed']
        }));
      }
    }
  }, [serviceName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleScrapType = (id) => {
    setFormData(prev => {
      const isSelected = prev.scrapType.includes(id);
      return {
        ...prev,
        scrapType: isSelected
          ? prev.scrapType.filter(item => item !== id)
          : [...prev.scrapType, id]
      };
    });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.scrapType.length === 0) {
      alert("Please select at least one scrap category.");
      return;
    }

    setIsLoading(true);

    const selectedLabels = formData.scrapType
      .map(id => {
        const found = scrapTypes.find(t => t.id === id);
        return found ? found.label : id;
      })
      .join(', ');

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      scrapType: selectedLabels,
      weight: parseFloat(formData.weight) || 10.0,
      date: formData.date,
      time: formData.time,
      notes: formData.notes
    };

    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/pickups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setIsLoading(false);
          setShowSuccessOverlay(true);
          setTimeout(() => {
            navigate('/dashboard/pickup');
          }, 3000);
        } else {
          alert("Failed to confirm booking. Please try again.");
          setIsLoading(false);
        }
      })
      .catch(err => {
        alert("Connection error. Make sure your backend server is running.");
        setIsLoading(false);
      });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={isDashboard ? "pb-16" : "min-h-screen bg-[#F1F8E9] pb-16"}>
      {!isDashboard && (
        <>
          <Navbar />
          {/* Spacer for Fixed Navbar */}
          <div className="h-24"></div>
        </>
      )}

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-[#5D4037] hover:text-[#66BB6A] font-bold mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        {/* Form Container */}
        <div className="bg-white rounded-sm border border-gray-100 p-6 md:p-10 shadow-xl relative overflow-hidden">
          {/* Top border decor */}
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#66BB6A] via-[#9CCC65] to-[#26A69A]"></div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] mb-4">
              <Truck size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Doorstep Collection</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#5D4037]">
              Schedule Your <span className="text-[#66BB6A]">Pickup</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              We weigh digitally and pay instantly on your doorstep
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Contact Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#5D4037] flex items-center gap-2 border-b pb-2">
                <span className="w-6 h-6 rounded-full bg-[#66BB6A] text-white flex items-center justify-center text-xs font-bold">1</span>
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-sm bg-gray-50 border-2 border-gray-100 outline-none focus:border-[#66BB6A] transition-all font-medium text-sm text-gray-700"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 0000000000"
                    className="w-full px-4 py-3 rounded-sm bg-gray-50 border-2 border-gray-100 outline-none focus:border-[#66BB6A] transition-all font-medium text-sm text-gray-700"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-sm bg-gray-50 border-2 border-gray-100 outline-none focus:border-[#66BB6A] transition-all font-medium text-sm text-gray-700"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 ml-1">Est. Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Approximated weight in kg"
                    className="w-full px-4 py-3 rounded-sm bg-gray-50 border-2 border-gray-100 outline-none focus:border-[#66BB6A] transition-all font-medium text-sm text-gray-700"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 ml-1">Pickup Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete address with landmarks"
                    rows="3"
                    className="w-full px-4 py-3 rounded-sm bg-gray-50 border-2 border-gray-100 outline-none focus:border-[#66BB6A] transition-all font-medium text-sm text-gray-700 resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#5D4037] flex items-center gap-2 border-b pb-2">
                <span className="w-6 h-6 rounded-full bg-[#66BB6A] text-white flex items-center justify-center text-xs font-bold">2</span>
                Select Scrap Categories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {scrapTypes.map((type) => {
                  const isSelected = formData.scrapType.includes(type.id);
                  return (
                    <div
                      key={type.id}
                      onClick={() => toggleScrapType(type.id)}
                      className={`cursor-pointer p-4 rounded-sm border-2 transition-all flex flex-col items-center text-center relative ${
                        isSelected 
                          ? 'border-[#66BB6A] bg-[#E8F5E9] text-[#2E7D32]' 
                          : 'border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-[#66BB6A]' : 'bg-gray-200'
                      }`}>
                        {isSelected && <CheckCircle size={12} className="text-white" />}
                      </div>
                      <span className="text-3xl mb-2">{type.icon}</span>
                      <span className="text-sm font-bold">{type.label}</span>
                      <span className="text-[10px] opacity-75 mt-0.5">{type.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#5D4037] flex items-center gap-2 border-b pb-2">
                <span className="w-6 h-6 rounded-full bg-[#66BB6A] text-white flex items-center justify-center text-xs font-bold">3</span>
                Schedule Date & Time
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 ml-1">Preferred Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    min={today}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-sm bg-gray-50 border-2 border-gray-100 outline-none focus:border-[#66BB6A] transition-all font-medium text-sm text-gray-700"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 ml-1">Preferred Time Slot</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-sm bg-gray-50 border-2 border-gray-100 outline-none focus:border-[#66BB6A] transition-all font-medium text-sm text-gray-700"
                    required
                  >
                    <option value="">Choose Time Slot</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                    <option value="evening">Evening (3 PM - 6 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Upload Photos */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#5D4037] flex items-center gap-2 border-b pb-2">
                <span className="w-6 h-6 rounded-full bg-[#66BB6A] text-white flex items-center justify-center text-xs font-bold">4</span>
                Upload Scrap Photos (Optional)
              </h3>
              <div className="border-2 border-dashed border-gray-200 hover:border-[#66BB6A] rounded-sm p-6 text-center bg-gray-50 transition-colors cursor-pointer group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="scrap-photos"
                />
                <label htmlFor="scrap-photos" className="cursor-pointer block space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#66BB6A] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Camera size={24} />
                  </div>
                  <div className="text-sm font-bold text-[#5D4037]">Click to select images</div>
                  <div className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</div>
                </label>
              </div>
              {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group rounded-sm overflow-hidden shadow-sm aspect-square border bg-white">
                      <img src={photo.url} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                      >
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">Additional Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special instructions for driver (e.g. lift available, items sorted)"
                rows="2"
                className="w-full px-4 py-3 rounded-sm bg-gray-50 border-2 border-gray-100 outline-none focus:border-[#66BB6A] transition-all font-medium text-sm text-gray-700 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#66BB6A] text-white rounded-sm font-extrabold text-lg hover:bg-[#43A047] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200 disabled:opacity-75"
            >
              {isLoading ? 'Processing Booking...' : 'Confirm Pickup Request'}
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Success Drawing Checkmark Modal Overlay */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 animate-scaleUp">
            {/* Circular Pulse and Draw Checkmark */}
            <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6 relative animate-pulseCircle">
              <svg 
                className="w-16 h-16 text-[#66BB6A]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path 
                  d="M20 6L9 17L4 12" 
                  style={{
                    strokeDasharray: 50,
                    strokeDashoffset: 50,
                    animation: 'drawCheck 0.7s cubic-bezier(0.65, 0, 0.45, 1) forwards 0.2s'
                  }}
                />
              </svg>
            </div>

            <h2 className="text-2xl font-extrabold text-[#5D4037] mb-3">
              Request Sent!
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Your doorstep pickup has been successfully booked. Our nearest scrap collector is being notified!
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F1F8E9] text-[#2E7D32] rounded-full text-xs font-bold border border-[#E8F5E9]">
              <Truck size={14} className="animate-bounce" />
              <span>Redirecting to tracking...</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes scaleUp {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes pulseCircle {
          0% {
            box-shadow: 0 0 0 0 rgba(102, 187, 106, 0.5);
          }
          70% {
            box-shadow: 0 0 0 18px rgba(102, 187, 106, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(102, 187, 106, 0);
          }
        }
        .animate-scaleUp {
          animation: scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-pulseCircle {
          animation: pulseCircle 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default BookPickup;