import React, { useState, useEffect } from 'react';
import { 
  Truck,
  Package,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  AlertCircle,
  Navigation,
  Star,
  MessageSquare,
  X
} from 'lucide-react';

const KabadBechoTrackPickup = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPickup, setSelectedPickup] = useState(null);

  const [pickups, setPickups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem('email') || '';
    if (userEmail) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:8080/api/pickups/user?email=${encodeURIComponent(userEmail)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            const formatted = data.map(item => {
              // Map scrap type to emoji
              let emoji = '🗃️';
              const type = item.scrapType ? item.scrapType.toLowerCase() : '';
              if (type.includes("metal")) emoji = '🔩';
              else if (type.includes("plastic")) emoji = '♻️';
              else if (type.includes("electronic") || type.includes("e-waste") || type.includes("ewaste")) emoji = '📱';
              else if (type.includes("paper")) emoji = '📄';
              else if (type.includes("glass")) emoji = '🥛';
              else if (type.includes("wood")) emoji = '🪵';

              // Map status
              let status = 'scheduled'; // 'scheduled', 'in-progress', 'completed'
              if (item.status === 'ACCEPTED') status = 'in-progress';
              else if (item.status === 'COMPLETED') status = 'completed';

              // Timeline
              const history = [
                { status: 'Booked', time: '10:00 AM', date: item.date, completed: true },
                { status: 'Confirmed', time: '10:15 AM', date: item.date, completed: true },
                { status: 'Driver Assigned', time: '11:00 AM', date: item.date, completed: item.status !== 'PENDING' },
                { status: 'Out for Pickup', time: '11:30 AM', date: item.date, completed: item.status !== 'PENDING' },
                { status: 'Collected', time: item.status === 'COMPLETED' ? 'Done' : '', date: item.status === 'COMPLETED' ? item.date : '', completed: item.status === 'COMPLETED' },
                { status: 'Payment Done', time: item.status === 'COMPLETED' ? 'Done' : '', date: item.status === 'COMPLETED' ? item.date : '', completed: item.status === 'COMPLETED' }
              ];

              return {
                id: 'KB' + item.id,
                date: item.date,
                time: item.time === 'morning' ? '09:00 AM - 12:00 PM' : item.time === 'afternoon' ? '12:00 PM - 03:00 PM' : '03:00 PM - 06:00 PM',
                scrapType: item.scrapType,
                emoji,
                weight: item.status === 'COMPLETED' ? `${item.actualWeight} kg` : `${item.weight} kg (Est.)`,
                amount: item.status === 'COMPLETED' ? `₹${item.collectedAmount}` : `₹${item.estimatedAmount} (Est.)`,
                status,
                address: item.address,
                customer: item.name,
                phone: item.phone,
                driverName: item.collector ? item.collector.name : 'Searching...',
                driverPhone: item.collector ? item.collector.phone : '-',
                rating: item.status === 'COMPLETED' ? 5 : null,
                statusHistory: history
              };
            });
            setPickups(formatted);
          }
        })
        .catch(err => console.log("Failed to load user pickups", err))
        .finally(() => setIsLoading(false));
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'from-[#66BB6A] to-[#4CAF50]';
      case 'in-progress':
        return 'from-[#FFA726] to-[#FF9800]';
      case 'scheduled':
        return 'from-[#42A5F5] to-[#2196F3]';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', icon: <CheckCircle size={16} />, bg: 'bg-green-100', text_color: 'text-green-700' };
      case 'in-progress':
        return { text: 'In Progress', icon: <Truck size={16} />, bg: 'bg-orange-100', text_color: 'text-orange-700' };
      case 'scheduled':
        return { text: 'Scheduled', icon: <Clock size={16} />, bg: 'bg-blue-100', text_color: 'text-blue-700' };
      default:
        return { text: 'Unknown', icon: <AlertCircle size={16} />, bg: 'bg-gray-100', text_color: 'text-gray-700' };
    }
  };

  const filteredPickups = pickups.filter(pickup => {
    const matchesSearch = (pickup.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (pickup.scrapType || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || pickup.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#E8F5E9] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#66BB6A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5D4037] font-semibold text-lg">Loading your pickups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#E8F5E9] to-white">
      {/* Header */}
      <section className="relative py-12 bg-linear-to-br from-[#66BB6A] to-[#4CAF50] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Navigation size={18} />
                <span className="font-semibold text-sm">Dashboard</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                Track Your Pickups
              </h1>
              <p className="text-xl text-green-50">
                Monitor your scrap collection status in real-time
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="text-sm text-green-100">Total Pickups</div>
                <div className="text-2xl font-bold">{pickups.length}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="text-sm text-green-100">Completed</div>
                <div className="text-2xl font-bold">{pickups.filter(p => p.status === 'completed').length}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by Booking ID or Scrap Type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#66BB6A] transition-all duration-300"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'scheduled', 'in-progress', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 capitalize ${
                    filterStatus === status
                      ? 'bg-linear-to-r from-[#66BB6A] to-[#4CAF50] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pickups Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPickups.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E8F5E9] rounded-full mb-4">
                <Package className="text-[#66BB6A]" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-[#5D4037] mb-2">No Pickups Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredPickups.map((pickup) => {
                const statusBadge = getStatusBadge(pickup.status);
                return (
                  <div
                    key={pickup.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-[#66BB6A]"
                  >
                    {/* Header */}
                    <div className={`bg-linear-to-r ${getStatusColor(pickup.status)} p-6 text-white`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-4xl">{pickup.emoji}</div>
                          <div>
                            <div className="text-sm opacity-90">Booking ID</div>
                            <div className="text-xl font-bold">{pickup.id}</div>
                          </div>
                        </div>
                        <div className={`${statusBadge.bg} ${statusBadge.text_color} px-4 py-2 rounded-full flex items-center space-x-2 font-semibold`}>
                          {statusBadge.icon}
                          <span className="text-sm">{statusBadge.text}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>{pickup.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={16} />
                          <span>{pickup.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                      {/* Scrap Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#E8F5E9] p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">Scrap Type</div>
                          <div className="font-bold text-[#5D4037]">{pickup.scrapType}</div>
                        </div>
                        <div className="bg-[#E8F5E9] p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">Weight</div>
                          <div className="font-bold text-[#5D4037]">{pickup.weight}</div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                        <MapPin className="text-[#66BB6A] shrink-0 mt-1" size={18} />
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Pickup Address</div>
                          <div className="text-sm font-medium text-gray-700">{pickup.address}</div>
                        </div>
                      </div>

                      {/* Driver Info */}
                      {pickup.status !== 'scheduled' && (
                        <div className="flex items-center space-x-3 p-4 bg-linear-to-r from-[#E8F5E9] to-white rounded-xl border-l-4 border-[#66BB6A]">
                          <div className="w-12 h-12 bg-linear-to-br from-[#66BB6A] to-[#4CAF50] rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {(pickup.driverName || 'S').charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-600">Driver</div>
                            <div className="font-bold text-[#5D4037]">{pickup.driverName}</div>
                            {pickup.driverPhone !== '-' && (
                              <div className="text-sm text-gray-600">{pickup.driverPhone}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Amount */}
                      <div className="flex items-center justify-between p-4 bg-linear-to-r from-[#66BB6A]/10 to-[#4CAF50]/10 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="text-[#66BB6A]" size={20} />
                          <span className="text-gray-700 font-medium">Total Amount</span>
                        </div>
                        <div className="text-2xl font-bold text-[#66BB6A]">{pickup.amount}</div>
                      </div>

                      {/* Rating (for completed) */}
                      {pickup.status === 'completed' && pickup.rating && (
                        <div className="flex items-center justify-center space-x-2 p-3 bg-yellow-50 rounded-xl">
                          <span className="text-sm text-gray-700 font-medium">Your Rating:</span>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, idx) => (
                              <Star
                                key={idx}
                                size={18}
                                className={idx < pickup.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedPickup(pickup)}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-linear-to-r from-[#66BB6A] to-[#4CAF50] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <Eye size={18} />
                          <span>View Details</span>
                        </button>
                        {pickup.status !== 'scheduled' && (
                          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-[#66BB6A] text-[#66BB6A] font-semibold rounded-xl hover:bg-[#E8F5E9] transition-all duration-300">
                            <Phone size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedPickup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`bg-linear-to-r ${getStatusColor(selectedPickup.status)} p-8 text-white relative`}>
              <button
                onClick={() => setSelectedPickup(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
              >
                <X size={20} />
              </button>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-6xl">{selectedPickup.emoji}</div>
                <div>
                  <div className="text-sm opacity-90">Booking Details</div>
                  <div className="text-3xl font-bold">{selectedPickup.id}</div>
                  <div className="text-sm opacity-90 mt-1">{selectedPickup.scrapType}</div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {/* Pickup Info */}
              <div>
                <h3 className="text-xl font-bold text-[#5D4037] mb-4">Pickup Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#E8F5E9] p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Date</div>
                    <div className="font-bold text-[#5D4037]">{selectedPickup.date}</div>
                  </div>
                  <div className="bg-[#E8F5E9] p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Time Slot</div>
                    <div className="font-bold text-[#5D4037]">{selectedPickup.time}</div>
                  </div>
                  <div className="bg-[#E8F5E9] p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Weight</div>
                    <div className="font-bold text-[#5D4037]">{selectedPickup.weight}</div>
                  </div>
                  <div className="bg-[#E8F5E9] p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Amount</div>
                    <div className="font-bold text-[#66BB6A] text-xl">{selectedPickup.amount}</div>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h3 className="text-xl font-bold text-[#5D4037] mb-4">Tracking Status</h3>
                <div className="space-y-4">
                  {selectedPickup.statusHistory.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.completed 
                            ? 'bg-linear-to-br from-[#66BB6A] to-[#4CAF50] text-white'
                            : 'bg-gray-200 text-gray-400'
                        } shadow-lg`}>
                          {item.completed ? <CheckCircle size={20} /> : <Clock size={20} />}
                        </div>
                        {idx < selectedPickup.statusHistory.length - 1 && (
                          <div className={`absolute top-10 left-5 w-0.5 h-12 ${
                            item.completed ? 'bg-[#66BB6A]' : 'bg-gray-200'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-bold ${item.completed ? 'text-[#5D4037]' : 'text-gray-400'}`}>
                          {item.status}
                        </div>
                        {item.completed && (
                          <div className="text-sm text-gray-600">
                            {item.date} at {item.time}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-xl font-bold text-[#5D4037] mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <User className="text-[#66BB6A]" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Customer</div>
                      <div className="font-medium text-gray-700">{selectedPickup.customer}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Phone className="text-[#66BB6A]" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium text-gray-700">{selectedPickup.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="text-[#66BB6A] shrink-0 mt-1" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Address</div>
                      <div className="font-medium text-gray-700">{selectedPickup.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-linear-to-r from-[#66BB6A] to-[#4CAF50] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300">
                  <Download size={20} />
                  <span>Download Invoice</span>
                </button>
                {selectedPickup.status === 'completed' && !selectedPickup.rating && (
                  <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-[#66BB6A] text-[#66BB6A] font-bold rounded-xl hover:bg-[#E8F5E9] transition-all duration-300">
                    <Star size={20} />
                    <span>Rate Service</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default KabadBechoTrackPickup;