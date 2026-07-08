import React, { useState, useEffect } from "react";
import {
  History,
  Wallet,
  Leaf,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Award,
  TrendingUp,
  X
} from "lucide-react";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [pickups, setPickups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalWeight: 0, totalEarnings: 0 });
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('email');
        const res = await fetch(`http://localhost:8080/api/pickups/user?email=${encodeURIComponent(userEmail)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map(item => {
            let statusBadge = 'Pending';
            if (item.status === 'ACCEPTED') statusBadge = 'In Progress (Accepted)';
            else if (item.status === 'COMPLETED') statusBadge = 'Completed';
            
            return {
              id: item.id,
              date: item.date || 'N/A',
              type: item.scrapType || 'Mixed',
              weight: item.actualWeight ? `${item.actualWeight} kg` : `${item.weight} kg (Est.)`,
              amount: item.collectedAmount ? `₹${item.collectedAmount}` : `₹${item.estimatedAmount} (Est.)`,
              status: statusBadge,
              receipt: `REC-${item.id}`
            };
          });
          setPickups(formatted);

          // Calculate stats
          const activePickups = data.filter(item => item.status !== 'CANCELLED');
          const totalWeight = activePickups.reduce((sum, item) => sum + (item.actualWeight || item.weight || 0), 0);
          const totalEarnings = activePickups.reduce((sum, item) => sum + (item.collectedAmount || item.estimatedAmount || 0), 0);
          setStats({ totalWeight, totalEarnings });
        }
      } catch (err) {
        console.error("Failed to fetch pickups", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPickups();
  }, []);

  const totalPages = Math.ceil(pickups.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = pickups.slice(indexOfLast - itemsPerPage, indexOfLast);

  const handleView = (id) => {
    const item = pickups.find(p => p.id === id);
    if(item) {
        setSelectedReceipt(item);
    }
  };

  const handleDownload = (id) => {
    const item = pickups.find(p => p.id === id);
    if(item) {
      const receiptContent = `
KabadBecho Receipt
------------------
Receipt ID: KB${item.id}
Date: ${item.date}
Scrap Type: ${item.type}
Weight: ${item.weight}
Earnings: ${item.amount}
Status: ${item.status}
------------------
Thank you for recycling with KabadBecho!
      `;
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Receipt_KB${item.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      {/* HERO / STATS */}
                <div className="bg-linear-to-br from-[#2E7D32] to-[#66BB6A] rounded-3xl p-8 text-white shadow-2xl shadow-green-900/10 mb-10 relative overflow-hidden group">

        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-900/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-1 mb-4">
              <Award size={12} /> Gold Member
            </span>

            <h1 className="text-3xl lg:text-5xl font-extrabold mb-4">
              Hello, <span className="text-green-100">Green Hero!</span> 🌱
            </h1>

            <p className="text-green-50 text-lg max-w-lg mb-8">
              Your recycling efforts are making a real difference. Keep going to unlock the next level!
            </p>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 max-w-md">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-green-100">Contribution Goal</span>
                <span className="text-2xl font-bold">
                  {stats.totalWeight.toFixed(1)} <span className="text-sm text-green-200">/ 500 kg</span>
                </span>
              </div>

              <div className="h-3 bg-black/20 rounded-full overflow-hidden mb-2">
                <div
                                        className="h-full bg-linear-to-r from-[#AED581] to-[#C5E1A5] rounded-full"
                  style={{ width: `${Math.min(100, (stats.totalWeight / 500) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-green-200">
                <span>Current Level: Eco Warrior</span>
                <span className="flex items-center gap-1">
                  Next: Earth Guardian <ChevronRight size={10} />
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
              <Wallet size={20} className="mb-3" />
              <p className="text-green-200 text-sm">Total Earnings</p>
              <h3 className="text-3xl font-bold">₹ {stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</h3>
              <p className="text-xs mt-2 flex items-center gap-1">
                <TrendingUp size={12} /> Live updates
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
              <Leaf size={20} className="mb-3" />
              <p className="text-green-200 text-sm">Waste Recycled</p>
              <h3 className="text-3xl font-bold">{stats.totalWeight.toFixed(1)} kg</h3>
              <p className="text-xs mt-2">Saved {(stats.totalWeight * 0.048).toFixed(1)} trees</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-lg border overflow-hidden">
        <div className="p-8 border-b flex justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2 text-[#1B5E20]">
            <History className="text-[#66BB6A]" /> Recent Pickups & Receipts
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase">
                <th className="p-5">Date</th>
                <th className="p-5">Waste Type</th>
                <th className="p-5">Weight</th>
                <th className="p-5">Earnings</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-5">{item.date}</td>
                  <td className="p-5 font-semibold">{item.type}</td>
                  <td className="p-5">{item.weight}</td>
                  <td className="p-5 font-bold text-[#2E7D32]">{item.amount}</td>
                  <td className="p-5 text-green-700">{item.status}</td>

                  <td className="p-5 text-center">
                    <button onClick={() => handleView(item.id)} className="p-2 mr-2 hover:bg-green-100 rounded">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleDownload(item.id)} className="p-2 hover:bg-green-100 rounded">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t flex justify-between">
          <p>
            Page <b>{currentPage}</b> of <b>{totalPages}</b>
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal Overlay */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setSelectedReceipt(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-[#2E7D32] mb-4 text-center border-b pb-4">
              KabadBecho Receipt
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Receipt ID:</span>
                <span>KB{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Date:</span>
                <span>{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Scrap Type:</span>
                <span>{selectedReceipt.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Weight:</span>
                <span>{selectedReceipt.weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Earnings:</span>
                <span className="text-[#2E7D32] font-bold">{selectedReceipt.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span>{selectedReceipt.status}</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleDownload(selectedReceipt.id)} 
              className="w-full mt-6 py-3 bg-[#66BB6A] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#43A047]"
            >
              <Download size={18} />
              Download Receipt
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
