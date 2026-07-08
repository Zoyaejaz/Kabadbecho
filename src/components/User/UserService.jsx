import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle, X, Send, CheckCircle } from 'lucide-react';

const UserService = () => {
  const navigate = useNavigate();
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  const handleSchedulePickup = () => {
    navigate('/dashboard/book-pickup');
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    setComplaintSubmitted(true);
    setTimeout(() => {
      setShowComplaintModal(false);
      setComplaintSubmitted(false);
    }, 2000);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Service Center</h1>
        <p className="text-gray-500 mb-10">How can we help you today?</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Schedule Pickup Card */}
          <div 
            onClick={handleSchedulePickup}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-green-200 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
              <Calendar size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Schedule Pickup</h2>
            <p className="text-gray-500">
              Book a scrap collection request securely at your doorstep. Fast, reliable, and entirely hassle-free.
            </p>
          </div>

          {/* File a Complaint Card */}
          <div 
            onClick={() => setShowComplaintModal(true)}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-red-200 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">File a Complaint</h2>
            <p className="text-gray-500">
              Did something go wrong? Report an issue with your pickup request, collector behavior, or payment.
            </p>
          </div>
        </div>
      </div>

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowComplaintModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Report an Issue</h2>
            
            {complaintSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">Complaint Submitted</h3>
                <p className="text-gray-500 text-center mt-2">We will review your issue and get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Category</label>
                  <select className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-shadow">
                    <option>Pickup Delay</option>
                    <option>Payment Issue</option>
                    <option>Collector Behavior</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea 
                    required
                    rows="4" 
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-shadow"
                    placeholder="Please detail your issue..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <Send size={18} /> Submit Complaint
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserService;