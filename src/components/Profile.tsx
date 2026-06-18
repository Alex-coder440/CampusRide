import { User, Ride } from '../types';
import * as motion from 'motion/react-client';
import { UserCircle, Settings, Bell, Gift, ShieldBan, Monitor, Users, Folder, Phone, Zap, CreditCard, Contact, Upload } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface ProfileProps {
  user: User | null;
  rides: Ride[];
  onUpdateUser?: (updatedUser: User) => void;
  onLogout?: () => void;
  setHasUnsavedChanges?: (hasChanges: boolean) => void;
}

export default function Profile({ user, onUpdateUser, onLogout, setHasUnsavedChanges }: ProfileProps) {
  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [isEmailDisabled, setIsEmailDisabled] = useState(true);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(user?.avatar || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isDirty = 
      firstName !== (user?.name.split(' ')[0] || '') ||
      lastName !== (user?.name.split(' ').slice(1).join(' ') || '') ||
      email !== (user?.email || '') ||
      uploadedImage !== (user?.avatar || null) ||
      currentPassword !== '' ||
      password !== '' ||
      confirmPassword !== '';
    if (setHasUnsavedChanges) {
      setHasUnsavedChanges(isDirty);
    }
  }, [firstName, lastName, email, uploadedImage, currentPassword, password, confirmPassword, user, setHasUnsavedChanges]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 bg-[#fcfcfc]">
        <p className="text-gray-500 font-medium">Please log in to view your profile.</p>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       const reader = new FileReader();
       reader.onloadend = () => {
         setUploadedImage(reader.result as string);
       };
       reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        avatar: uploadedImage || undefined
      });
      setIsEmailDisabled(true);
      setIsEditingPassword(false);
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      alert('Profile updated successfully!');
    }
  };

  const handleCancel = () => {
    setFirstName(user.name.split(' ')[0] || '');
    setLastName(user.name.split(' ').slice(1).join(' ') || '');
    setEmail(user.email || '');
    setUploadedImage(user.avatar || null);
    setIsEmailDisabled(true);
    setIsEditingPassword(false);
    setCurrentPassword('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex-1 flex w-full max-w-6xl mx-auto bg-[#fafafa]">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-100 flex-shrink-0 flex flex-col pt-24 hidden md:flex min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
             <UserCircle className="w-full h-full text-gray-400" />
          </div>
          <h2 className="text-sm font-bold text-gray-900">{user.name}</h2>
        </div>

        <div className="flex-1 px-4 pb-8 space-y-8">
          <div>
            <p className="px-2 text-[11px] font-bold text-gray-400 mb-2">Your account</p>
            <div className="space-y-0.5">
              <button className="w-full flex items-center gap-3 px-2 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-900 transition-colors">
                <UserCircle className="w-4 h-4 text-gray-600" />
                Profile
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                <Settings className="w-4 h-4 text-gray-400" />
                Preferences
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                <Bell className="w-4 h-4 text-gray-400" />
                Notifications
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                <Gift className="w-4 h-4 text-gray-400" />
                Referrals
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                <ShieldBan className="w-4 h-4 text-gray-400" />
                Blocklist
              </button>
            </div>
          </div>

          <div>
            <p className="px-2 text-[11px] font-bold text-gray-400 mb-2">Workspace</p>
            <div className="space-y-0.5">
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                <Monitor className="w-4 h-4 text-gray-400" />
                General
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                <Users className="w-4 h-4 text-gray-400" />
                Members
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                <Folder className="w-4 h-4 text-gray-400" />
                Groups
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                <Phone className="w-4 h-4 text-gray-400" />
                Phone numbers
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                <Zap className="w-4 h-4 text-gray-400" />
                Integrations
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                <CreditCard className="w-4 h-4 text-gray-400" />
                Plan & billing
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                <Contact className="w-4 h-4 text-gray-400" />
                Contacts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#ffffff] pt-24 pb-20 md:border-l border-gray-100 border-r min-h-[calc(100vh-64px)]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto px-6 lg:px-12"
        >
          <div className="pb-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Account</h1>
          </div>

          <div className="py-8 space-y-10 border-b border-gray-100">
            {/* Profile Picture */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-full h-full text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex gap-2 mb-2">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleImageUpload} />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </button>
                    <button onClick={() => setUploadedImage(null)} className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">We support PNGs, JPEGs and GIFs under 10MB</p>
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Email</label>
              <div className="flex gap-3">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isEmailDisabled}
                  className={`flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm transition-all focus:outline-none focus:border-black focus:ring-1 focus:ring-black ${isEmailDisabled ? 'text-gray-500 opacity-80' : 'text-gray-900'}`}
                />
                <button onClick={() => setIsEmailDisabled(!isEmailDisabled)} className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-xl text-sm font-medium transition-colors shrink-0">
                  {isEmailDisabled ? 'Edit Email' : 'Done'}
                </button>
              </div>
              <p className="text-xs text-gray-400 pt-1">Used to log in to your account</p>
            </div>
          </div>

          <div className="py-8 pb-12 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Password</h3>
                <p className="text-sm text-gray-500">Log in with your password instead of using temporary login codes</p>
              </div>
              <button onClick={() => setIsEditingPassword(!isEditingPassword)} className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-xl text-sm font-medium transition-colors shrink-0">
                {isEditingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            {isEditingPassword && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="max-w-md space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">New Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
            <button onClick={() => onLogout?.()} className="px-6 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white border border-red-200 rounded-xl text-sm font-bold transition-colors w-full sm:w-auto text-center">
              Log Out
            </button>
            <div className="flex justify-end gap-3 w-full sm:w-auto">
              <button onClick={handleCancel} className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-xl text-sm font-medium transition-colors w-full sm:w-auto">
                Cancel
              </button>
              <button onClick={handleSave} className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors w-full sm:w-auto">
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
