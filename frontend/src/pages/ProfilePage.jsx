import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, changePassword } from '../services/authService';
import { useOutletContext } from 'react-router-dom';
import { formatDate } from '../utils/formatters';
import { Save, Upload, Loader2, KeyRound, Calendar, AtSign, User as UserIcon, Eye, EyeOff } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserState } = useAuth();
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || '');
  const [submittingProfile, setSubmittingProfile] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [passError, setPassError] = useState('');

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('username', username);
      formData.append('phone', phone);
      formData.append('location', location);
      formData.append('bio', bio);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await updateProfile(formData);
      if (res.success && res.user) {
        updateUserState(res.user);
        if (showToast) showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      console.error('[Profile Update Error]', err);
      const msg = err.response?.data?.message || 'Failed to update profile';
      if (showToast) showToast(msg, 'error');
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError('');

    if (newPassword !== confirmPassword) {
      setPassError('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPassError('New password must be at least 8 characters long');
      return;
    }

    setSubmittingPassword(true);
    try {
      const res = await changePassword({ currentPassword, newPassword, confirmPassword });
      if (res.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        if (showToast) showToast('Password changed successfully!', 'success');
      }
    } catch (err) {
      console.error('[Password Change Error]', err);
      const msg = err.response?.data?.message || 'Failed to change password';
      setPassError(msg);
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tight">Account Settings & Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your public seller details, avatar photo, and security credentials.
        </p>
      </div>

      {/* 1. Edit Profile Form */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-soft space-y-6">
        <h2 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-sage-600" />
          <span>Public Profile Information</span>
        </h2>

        {/* Avatar Upload Header */}
        <div className="flex items-center gap-6 pb-2">
          <div className="relative">
            <img
              src={avatarPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt="Avatar Preview"
              className="w-20 h-20 rounded-full object-cover border-4 border-sage-100 shadow-sm"
            />
            <label
              htmlFor="avatarUpload"
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-forest-800 text-white cursor-pointer hover:bg-forest-900 transition-colors shadow-sm"
              title="Change Avatar"
            >
              <Upload className="w-3.5 h-3.5" />
            </label>
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm">{user?.name}</h3>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <AtSign className="w-3 h-3 text-slate-300" />
              {user?.username}
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-300" />
              Member since {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>

        {/* Full Name & Username */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
            <input
              type="text"
              placeholder="+1 555-0192"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Location & Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location (City & State)</label>
          <input
            type="text"
            placeholder="e.g. New York, NY"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Seller Bio</label>
          <textarea
            rows={3}
            maxLength={300}
            placeholder="Tell buyers a bit about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white resize-y"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={submittingProfile}
            className="px-6 py-3 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
          >
            {submittingProfile ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 2. Change Password Form */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-soft space-y-6">
        <h2 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-forest-800" />
          <span>Security & Change Password</span>
        </h2>

        {passError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
            {passError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password (Min 8 chars)</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPass ? 'Hide passwords' : 'Show passwords'}</span>
            </button>

            <button
              type="submit"
              disabled={submittingPassword}
              className="px-6 py-3 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
            >
              {submittingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
