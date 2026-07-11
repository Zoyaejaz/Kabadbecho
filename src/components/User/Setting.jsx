import React, { useState, useEffect } from 'react';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Save,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  LogOut,
  HelpCircle,
  Settings,
  Edit2,
  X
} from 'lucide-react';
import API_URL from '../../config';

const KabadBechoSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '9876543210',
    address: '123 Green Street, Eco City',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    alternatePhone: '9876543211',
    profilePicUrl: ''
  });

  useEffect(() => {
    const email = localStorage.getItem('email') || '';
    const name = localStorage.getItem('name') || '';
    const token = localStorage.getItem('token');

    if (email) {
      fetch(`${API_URL}/api/users/profile?email=${encodeURIComponent(email)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.email) {
          setProfileData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            pincode: data.pincode || '',
            alternatePhone: data.altPhone || '',
            profilePicUrl: data.profilePicUrl || ''
          });
        }
      })
      .catch(err => {
        console.error("Failed to fetch profile", err);
        // Fallback to local storage 
        setProfileData(prev => ({
          ...prev,
          email: email || prev.email,
          name: name || prev.name
        }));
      });
    }
  }, []);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    pickupReminders: true,
    promotionalEmails: false,
    weeklyReport: true
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profilePicUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e) => {
    let { name, value } = e.target;
    
    // Field specific validations
    if (name === 'name' || name === 'city' || name === 'state') {
      value = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'phone' || name === 'alternatePhone') {
      value = value.replace(/\D/g, ''); 
      if (value.length > 10) value = value.slice(0, 10);
    } else if (name === 'pincode') {
      value = value.replace(/\D/g, '');
      if (value.length > 6) value = value.slice(0, 6);
    }

    setProfileData({ ...profileData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleNotificationToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSave = () => {
    if (activeTab === 'profile') {
      const newErrors = {};
      
      if (profileData.phone && profileData.phone.length > 0 && profileData.phone.length < 10) {
        newErrors.phone = 'Phone number should contain exactly 10 digits.';
      }
      if (profileData.alternatePhone && profileData.alternatePhone.length > 0 && profileData.alternatePhone.length < 10) {
        newErrors.alternatePhone = 'Phone number should contain exactly 10 digits.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        const firstErrorName = Object.keys(newErrors)[0];
        const errorInput = document.querySelector(`input[name="${firstErrorName}"]`);
        if (errorInput) {
          errorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorInput.focus();
        }
        return;
      }
      setErrors({});

      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');
      
      const payload = {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        altPhone: profileData.alternatePhone,
        city: profileData.city,
        state: profileData.state,
        pincode: profileData.pincode,
        profilePicUrl: profileData.profilePicUrl
      };

      fetch(`${API_URL}/api/users/profile?email=${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      .then(async (res) => {
        if (res.ok) {
          const updatedUser = await res.json();
          localStorage.setItem('name', updatedUser.name);
          setSaveSuccess(true);
          setIsEditing(false);
          setTimeout(() => setSaveSuccess(false), 3000);
        } else {
          alert("Failed to save profile.");
        }
      })
      .catch(err => alert("Server connection error"));
    } else if (activeTab === 'security') {
      // Password validation
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
          alert("Please fill in all password fields.");
          return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
          alert("New Password and Confirm Password do not match.");
          return;
      }
      if (passwordData.newPassword.length < 8) {
          alert("Password must be at least 8 characters long.");
          return;
      }
      if (!/[A-Z]/.test(passwordData.newPassword) || !/[a-z]/.test(passwordData.newPassword) || !/[0-9]/.test(passwordData.newPassword)) {
          alert("Password must contain uppercase, lowercase and a number.");
          return;
      }
      
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');
      fetch(`${API_URL}/api/auth/password?email=${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(passwordData)
      })
      .then(async (res) => {
          if(res.ok) {
              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: ''});
              setIsEditingSecurity(false);
              setSaveSuccess(true);
              setTimeout(() => setSaveSuccess(false), 3000);
          } else {
              const data = await res.json();
              alert(data.message || "Failed to update password.");
          }
      });
    } else {
      // Mock save for other tabs
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const quickTabs = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'security', label: 'Security', icon: <Lock size={20} /> }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#E8F5E9] to-white">
      {/* Header */}
      <section className="relative py-12 bg-linear-to-br from-[#66BB6A] to-[#4CAF50] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm">
              <Settings size={32} />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">Settings</h1>
              <p className="text-xl text-green-50">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-white rounded-sm shadow-2xl p-4 flex items-center space-x-3 border-l-4 border-[#66BB6A]">
            <CheckCircle className="text-[#66BB6A]" size={24} />
            <span className="text-gray-700 font-semibold">Settings saved successfully!</span>
          </div>
        </div>
      )}
      {/* Quick cards UI */}
      <div className="max-w-7xl mx-auto px-6 mt-10 grid md:grid-cols-2 max-w-3xl gap-6">
        {quickTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`p-6 rounded-sm text-left border transition shadow-sm hover:shadow-lg ${
              activeTab === t.id
                ? "bg-linear-to-r from-[#66BB6A] to-[#4CAF50] text-white"
                : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">{t.icon}
              <h3 className="font-bold text-lg">{t.label}</h3>
            </div>
            <p className="text-sm opacity-80">
              {t.id === "profile" && "Update your personal details"}
              {t.id === "security" && "Manage your password & security"}
              {t.id === "notifications" && "Control your alerts & reminders"}
            </p>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-sm shadow-lg p-4 sm:p-8">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-[#5D4037] mb-2">Profile Information</h2>
                        <p className="text-gray-600">Review your profile details. Click the pencil icon to edit.</p>
                      </div>
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`p-3 rounded-full transition-colors duration-300 shadow-md flex items-center justify-center ${isEditing ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-[#E8F5E9] text-[#66BB6A] hover:bg-[#66BB6A] hover:text-white'}`}
                        title={isEditing ? "Cancel editing" : "Edit Profile"}
                      >
                        {isEditing ? <X size={20} /> : <Edit2 size={20} />} 
                      </button>
                    </div>

                    {/* Profile Picture */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-linear-to-br from-[#66BB6A] to-[#4CAF50] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden border-2 border-white">
                          {profileData.profilePicUrl ? (
                            <img src={profileData.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            profileData.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        {isEditing && (
                          <>
                            <button 
                              onClick={() => document.getElementById('profilePicUpload').click()}
                              className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-[#66BB6A] rounded-full flex items-center justify-center hover:bg-[#E8F5E9] transition-colors duration-300 shadow-md"
                              title="Upload or take a photo"
                            >
                              <Camera size={16} className="text-[#66BB6A]" />
                            </button>
                            <input 
                              id="profilePicUpload" 
                              type="file" 
                              accept="image/*;capture=camera" 
                              className="hidden" 
                              onChange={handleImageUpload} 
                            />
                          </>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#5D4037] text-lg">{profileData.name}</h3>
                        <p className="text-gray-600 text-sm">{profileData.email}</p>
                        {isEditing && (
                          <button 
                            onClick={() => document.getElementById('profilePicUpload').click()}
                            className="text-[#66BB6A] text-sm font-semibold hover:text-[#4CAF50] mt-1"
                          >
                            Change Profile Picture
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="text-gray-400" size={20} />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-sm focus:outline-none transition-all duration-300 ${!isEditing ? 'bg-gray-50 text-gray-600 opacity-80 cursor-not-allowed' : 'focus:border-[#66BB6A] bg-white'}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="text-gray-400" size={20} />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            disabled={true}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-sm focus:outline-none transition-all duration-300 bg-gray-50 text-gray-500 opacity-80 cursor-not-allowed`}
                            title="Email cannot be changed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="text-gray-400" size={20} />
                          </div>
                          <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                            <span className="text-gray-500 font-medium">+91</span>
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            maxLength={10}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            className={`w-full pl-20 pr-4 py-3 border-2 rounded-sm focus:outline-none transition-all duration-300 ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-600 opacity-80 cursor-not-allowed' : errors.phone ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-[#66BB6A] bg-white'}`}
                          />
                        </div>
                        {errors.phone && (
                          <div className="text-red-500 text-xs font-semibold mt-1 animate-pulse">
                            {errors.phone}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                          Alternate Phone
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="text-gray-400" size={20} />
                          </div>
                          <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                            <span className="text-gray-500 font-medium">+91</span>
                          </div>
                          <input
                            type="tel"
                            name="alternatePhone"
                            value={profileData.alternatePhone}
                            maxLength={10}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            className={`w-full pl-20 pr-4 py-3 border-2 rounded-sm focus:outline-none transition-all duration-300 ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-600 opacity-80 cursor-not-allowed' : errors.alternatePhone ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-[#66BB6A] bg-white'}`}
                          />
                        </div>
                        {errors.alternatePhone && (
                          <div className="text-red-500 text-xs font-semibold mt-1 animate-pulse">
                            {errors.alternatePhone}
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                          Address
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                            <MapPin className="text-gray-400" size={20} />
                          </div>
                          <textarea
                            name="address"
                            value={profileData.address}
                            onChange={handleProfileChange}
                            rows="2"
                            disabled={!isEditing}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-sm focus:outline-none transition-all duration-300 resize-none ${!isEditing ? 'bg-gray-50 text-gray-600 opacity-80 cursor-not-allowed' : 'focus:border-[#66BB6A] bg-white'}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#5D4037] mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:outline-none transition-all duration-300 ${!isEditing ? 'bg-gray-50 text-gray-600 opacity-80 cursor-not-allowed' : 'focus:border-[#66BB6A] bg-white'}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#5D4037] mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={profileData.state}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:outline-none transition-all duration-300 ${!isEditing ? 'bg-gray-50 text-gray-600 opacity-80 cursor-not-allowed' : 'focus:border-[#66BB6A] bg-white'}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#5D4037] mb-2">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={profileData.pincode}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:outline-none transition-all duration-300 ${!isEditing ? 'bg-gray-50 text-gray-600 opacity-80 cursor-not-allowed' : 'focus:border-[#66BB6A] bg-white'}`}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <button
                        onClick={handleSave}
                        className="w-full py-4 bg-linear-to-r from-[#66BB6A] to-[#4CAF50] text-white font-bold text-lg rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                      >
                        <Save size={22} />
                        <span>Save Changes</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-[#5D4037] mb-2">Security Settings</h2>
                        <p className="text-gray-600">Manage your password and account security. Click the pencil icon to edit.</p>
                      </div>
                      <button 
                        onClick={() => setIsEditingSecurity(!isEditingSecurity)}
                        className={`p-3 rounded-full transition-colors duration-300 shadow-md flex items-center justify-center ${isEditingSecurity ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-[#E8F5E9] text-[#66BB6A] hover:bg-[#66BB6A] hover:text-white'}`}
                        title={isEditingSecurity ? "Cancel editing" : "Edit Security"}
                      >
                        {isEditingSecurity ? <X size={20} /> : <Edit2 size={20} />} 
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#5D4037] mb-2">Current Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="text-gray-400" size={20} />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            disabled={!isEditingSecurity}
                            className={`w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-sm focus:outline-none transition-all duration-300 ${!isEditingSecurity ? 'bg-gray-50 text-gray-400 opacity-80 cursor-not-allowed' : 'focus:border-[#66BB6A] bg-white'}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#66BB6A]"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#5D4037] mb-2">New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="text-gray-400" size={20} />
                          </div>
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            disabled={!isEditingSecurity}
                            className={`w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-sm focus:outline-none transition-all duration-300 ${!isEditingSecurity ? 'bg-gray-50 text-gray-400 opacity-80 cursor-not-allowed' : 'focus:border-[#66BB6A] bg-white'}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#66BB6A]"
                          >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#5D4037] mb-2">Confirm New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="text-gray-400" size={20} />
                          </div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            disabled={!isEditingSecurity}
                            className={`w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-sm focus:outline-none transition-all duration-300 ${!isEditingSecurity ? 'bg-gray-50 text-gray-400 opacity-80 cursor-not-allowed' : 'focus:border-[#66BB6A] bg-white'}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#66BB6A]"
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#E8F5E9] p-6 rounded-sm border-l-4 border-[#66BB6A]">
                      <h3 className="font-bold text-[#5D4037] mb-2">Password Requirements</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="text-[#66BB6A]" size={16} />
                          <span>At least 8 characters long</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="text-[#66BB6A]" size={16} />
                          <span>Contains uppercase and lowercase letters</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="text-[#66BB6A]" size={16} />
                          <span>Contains at least one number</span>
                        </li>
                      </ul>
                    </div>

                    {isEditingSecurity && (
                      <button
                        onClick={handleSave}
                        className="w-full py-4 bg-linear-to-r from-[#66BB6A] to-[#4CAF50] text-white font-bold text-lg rounded-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                      >
                        <Save size={22} />
                        <span>Update Password</span>
                      </button>
                    )}
                  </div>
                )}


              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
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

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default KabadBechoSettings;