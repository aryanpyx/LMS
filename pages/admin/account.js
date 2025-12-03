import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';

export default function AdminAccount() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/admin/account');
        setProfile(response.data);
        setFormData(response.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'AD';
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get default avatar URL with initials
  const getDefaultAvatar = (name) => {
    const initials = getInitials(name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6366f1&color=fff&size=150&font-size=60&bold=true`;
  };

  // Handle avatar file change - SEPARATE from edit mode
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    setEditing(true);
    setFormData(profile);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'avatar' || typeof formData.avatar === 'string') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // If avatar is a file (from file input), add it separately
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }
      
      const response = await axios.put('/api/admin/account', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      
      setProfile(response.data);
      setEditing(false);
      setAvatarPreview(null);
      setAvatarFile(null);
      setIsUploading(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
      setIsUploading(false);
      alert('Failed to update profile');
    }
  }

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
  }

  // Handle remove avatar
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setFormData(prev => ({ ...prev, avatar: null }));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  )

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar role="admin" active="Account" />
      <div className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50">
        
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Profile Picture with Camera Icon Always Visible */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <img
                      src={
                        (avatarPreview || formData.avatar || getDefaultAvatar(formData.name))
                      }
                      alt={profile.name}
                      className="w-36 h-36 rounded-full border-4 border-white/30 shadow-xl object-cover"
                    />
                    
                    {/* Camera icon - ALWAYS VISIBLE for image upload */}
                    <label className="absolute bottom-2 right-2 w-10 h-10 bg-indigo-600 rounded-full border-3 border-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors z-10">
                      <span className="text-white text-lg">📷</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                {/* Profile Information */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Active
                    </div>
                  </div>
                  <p className="text-xl text-indigo-100 mb-3">{profile.role} • {profile.department}</p>
                  <p className="text-indigo-100 max-w-2xl mb-6 leading-relaxed">{profile.bio}</p>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{profile.systemStats?.totalLogins?.toLocaleString()}</p>
                      <p className="text-xs text-indigo-200">Total Logins</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{profile.systemStats?.actionsPerformed?.toLocaleString()}</p>
                      <p className="text-xs text-indigo-200">Actions</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{profile.systemStats?.reportsGenerated}</p>
                      <p className="text-xs text-indigo-200">Reports</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{profile.systemStats?.uptime}</p>
                      <p className="text-xs text-indigo-200">Uptime</p>
                    </div>
                  </div>
                  
                  {/* Date Information */}
                  <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span>Joined: {new Date(profile.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⏰</span>
                      <span>Last Login: {new Date(profile.lastLogin).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Edit Profile Button - ALWAYS VISIBLE */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleEditToggle}
                    className="bg-white text-indigo-700 py-3 px-6 rounded-lg font-medium hover:bg-indigo-50 transition-all duration-200 shadow-lg transform hover:scale-105"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {['profile', 'security', 'activity'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-6 text-center border-b-2 font-medium transition-colors ${
                        activeTab === tab
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {editing && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-blue-600 mr-2">ℹ️</span>
                        <p className="text-blue-800">You are currently editing your profile</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          disabled={isUploading}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isUploading}
                          className="bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        {editing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{profile.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        {editing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{profile.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      {editing ? (
                        <textarea
                          name="bio"
                          value={formData.bio || ''}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 p-3 bg-gray-50 rounded-lg min-h-[100px]">{profile.bio}</p>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 pt-4 border-t">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        {editing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.contactInfo?.phone || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, phone: e.target.value }
                            }))}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{profile.contactInfo?.phone}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                        {editing ? (
                          <input
                            type="tel"
                            name="emergency"
                            value={formData.contactInfo?.emergency || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, emergency: e.target.value }
                            }))}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{profile.contactInfo?.emergency}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      {editing ? (
                        <textarea
                          name="address"
                          value={formData.contactInfo?.address || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, address: e.target.value }
                          }))}
                          rows={2}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 p-3 bg-gray-50 rounded-lg min-h-[80px]">{profile.contactInfo?.address}</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${profile.securitySettings?.twoFactorEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm font-medium text-gray-600">
                            {profile.securitySettings?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-gray-800">Login Alerts</p>
                          <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${profile.securitySettings?.loginAlerts ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm font-medium text-gray-600">
                            {profile.securitySettings?.loginAlerts ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-gray-800">Last Password Change</p>
                          <p className="text-sm text-gray-500">Keep your password updated regularly</p>
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          {new Date(profile.securitySettings?.lastPasswordChange).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-gray-800">Session Timeout</p>
                          <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                        </div>
                        <p className="text-sm font-medium text-gray-600">{profile.securitySettings?.sessionTimeout}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 pt-4">
                      <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200">
                        Change Password
                      </button>
                      <button className="bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200">
                        Security Settings
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Activity log would be displayed here</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Permissions & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Permissions Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Permissions</h3>
              <div className="space-y-3">
                {profile.permissions?.map((permission, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{permission}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-colors text-left flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚙️</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Account Settings</p>
                    <p className="text-xs text-gray-500">Manage account preferences</p>
                  </div>
                </button>
                
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-colors text-left flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🔒</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Privacy Settings</p>
                    <p className="text-xs text-gray-500">Control your privacy</p>
                  </div>
                </button>
                
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-colors text-left flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📄</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Export Data</p>
                    <p className="text-xs text-gray-500">Download your information</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
