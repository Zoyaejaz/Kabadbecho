import React, { useState, useEffect } from 'react';
import { 
  Search, Edit2, Save, X, DollarSign, Package, 
  TrendingUp, Calendar, FileText, Download, Truck
} from 'lucide-react';

const PaymentsPricing = () => {
  const [editingPriceId, setEditingPriceId] = useState(null);

  const [scrapPrices, setScrapPrices] = useState([
    { id: 1, category: 'Plastic Scrap', pricePerKg: 12, lastUpdated: '2026-07-07' },
    { id: 2, category: 'Paper Scrap', pricePerKg: 15, lastUpdated: '2026-07-07' },
    { id: 3, category: 'Metal Scrap', pricePerKg: 38, lastUpdated: '2026-07-07' },
    { id: 4, category: 'E-Waste', pricePerKg: 120, lastUpdated: '2026-07-07' },
    { id: 5, category: 'Glass Scrap', pricePerKg: 5, lastUpdated: '2026-07-07' },
    { id: 6, category: 'Mixed Scrap', pricePerKg: 10, lastUpdated: '2026-07-07' },
  ]);

  const [paymentRecords, setPaymentRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCount: 0,
    pendingCount: 0,
    acceptedCount: 0,
    completedCount: 0,
    totalRevenue: 0.0,
    completedRevenue: 0.0
  });

  const loadPaymentsAndStats = () => {
    // Fetch stats
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
      })
      .catch(err => console.log("Failed to fetch admin stats", err));

    // Fetch transactions
    fetch('http://localhost:8080/api/admin/pickups', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const records = data
          .filter(item => item.status === 'COMPLETED' || item.status === 'ACCEPTED')
          .map(item => {
            const isCompleted = item.status === 'COMPLETED';
            return {
              id: 'PAY00' + item.id,
              pickupId: 'REQ00' + item.id,
              userName: item.name,
              scrapType: item.scrapType,
              quantity: isCompleted ? `${item.actualWeight} kg` : `${item.weight} kg`,
              numericWeight: isCompleted ? item.actualWeight : item.weight,
              amount: isCompleted ? item.collectedAmount : item.estimatedAmount,
              status: isCompleted ? 'paid' : 'pending',
              paymentDate: isCompleted ? item.date : null,
              method: isCompleted ? 'UPI' : null
            };
          });
        setPaymentRecords(records);
      })
      .catch(err => console.log("Failed to load admin transactions", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadPaymentsAndStats();
  }, []);

  const totalWeight = paymentRecords
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + (p.numericWeight || 0), 0);

  const uniqueCategories = new Set(paymentRecords.map(p => p.scrapType)).size;

  const handleUpdatePrice = (id, newPrice) => {
    setScrapPrices(scrapPrices.map(item =>
      item.id === id
        ? { ...item, pricePerKg: parseFloat(newPrice), lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    ));
    setEditingPriceId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#5D4037]">Payments & Pricing</h1>
          <p className="text-gray-600 mt-1">Manage scrap pricing and transaction records</p>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-[#66BB6A] to-[#43A047] text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Daily Revenue</h3>
            <DollarSign size={24} className="opacity-80" />
          </div>
          <p className="text-3xl font-bold">₹{(stats.completedRevenue || 0).toLocaleString()}</p>
          <p className="text-sm opacity-80 mt-1">{stats.completedCount} completed collections</p>
        </div>

        <div className="bg-linear-to-br from-[#5D4037] to-[#4E342E] text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Revenue (Inc. Estimated)</h3>
            <TrendingUp size={24} className="opacity-80" />
          </div>
          <p className="text-3xl font-bold">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
          <p className="text-sm opacity-80 mt-1">{stats.totalCount} registered transactions</p>
        </div>

        {/* Card 3: Scrap Inventory / Total Weight */}
        <div className="bg-linear-to-br from-[#FB8C00] to-[#F4511E] text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Scrap Collected</h3>
            <Truck size={24} className="opacity-80" />
          </div>
          <p className="text-3xl font-bold">
            {(totalWeight || 0).toLocaleString()} <span className="text-lg font-normal">kg</span>
          </p>
          <p className="text-sm opacity-80 mt-1">
            Across {uniqueCategories} categories processed
          </p>
        </div>
      </div>

      {/* Scrap Price Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-[#5D4037]">Scrap Price Management</h2>
            <p className="text-sm text-gray-600 mt-1">Update prices per kilogram for different scrap categories</p>
          </div>
          <Package className="text-[#66BB6A]" size={32} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scrap Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price per Kg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scrapPrices.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-[#5D4037]">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingPriceId === item.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">₹</span>
                        <input
                          type="number"
                          defaultValue={item.pricePerKg}
                          id={`price-${item.id}`}
                          className="w-24 px-2 py-1 border border-[#A5D6A7] rounded focus:ring-2 focus:ring-[#66BB6A] focus:border-transparent"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-[#66BB6A]">₹{item.pricePerKg}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {editingPriceId === item.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newPrice = document.getElementById(`price-${item.id}`).value;
                            handleUpdatePrice(item.id, newPrice);
                          }}
                          className="text-[#66BB6A] hover:text-[#4CAF50] p-2 hover:bg-[#E8F5E9] rounded-lg transition-colors cursor-pointer"
                          title="Save"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => setEditingPriceId(null)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingPriceId(item.id)}
                        className="text-[#66BB6A] hover:text-[#4CAF50] p-2 hover:bg-[#E8F5E9] rounded-lg transition-colors cursor-pointer"
                        title="Edit Price"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Records */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-[#5D4037]">Payment Records</h2>
            <p className="text-sm text-gray-600 mt-1">Transaction history and payment status</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#66BB6A] text-white rounded-lg hover:bg-[#4CAF50] transition-colors">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#66BB6A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-semibold">Loading ledger transactions...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pickup ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentRecords.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#5D4037]">{payment.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#5D4037]">{payment.pickupId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#5D4037]">{payment.userName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#5D4037]">{payment.scrapType}</div>
                      <div className="text-xs text-gray-500">{payment.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-[#66BB6A]">₹{payment.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        payment.status === 'paid'
                          ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]'
                          : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                      }`}>
                        {payment.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.paymentDate ? (
                        <div>
                          <div className="text-sm text-[#5D4037]">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">{payment.method}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">Not yet paid</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPricing;
