'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API;
console.log("API:", API);

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    avatar: ''
  });
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const toggleAuth = () => setIsLogin(!isLogin);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // ✅ Fetch avatar images when signup modal opens
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoadingImages(true);
        const res = await fetch(`${API}/image/images`);
        const result = await res.json();

        if (Array.isArray(result.data)) {
          const urls = result.data.map((item: any) => item.avatar);
          setImages(urls);
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoadingImages(false);
      }
    };

    if (!isLogin && isOpen) fetchImages();
  }, [isLogin, isOpen]);

  // ✅ Close modal or avatar picker on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (showAvatarPicker) {
          setShowAvatarPicker(false);
        } else {
          handleClose();
        }
      }
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, isOpen, showAvatarPicker]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarSelect = (url: string) => {
    setFormData(prev => ({ ...prev, avatar: url }));
    setShowAvatarPicker(false);
  };

  const handleSubmit = async () => {
    if (isLogin) {
      console.log('Logging in with:', formData);
      // 🟦 Example: call login API
      // await fetch(`${API}/auth/login`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData) });
    } else {
      if (!formData.avatar) {
        alert('Please select an avatar before signing up!');
        return;
      }

      console.log('Signing up with:', formData);
      // 🟦 Example: call register API
      // await fetch(`${API}/auth/register`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData) });
    }
  };

  const handleGmailAuth = () => {
    console.log('Google Auth initiated');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-2xl space-y-7 border border-slate-100 relative transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-500 shadow-md hover:shadow-lg border border-gray-300 hover:border-red-500 transition-all duration-200 z-10 cursor-pointer flex items-center justify-center group"
          aria-label="Close modal"
          type="button"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-200" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          {isLogin ? 'Login to Your Account' : 'Create an Account'}
        </h2>

        {/* Form */}
        <div className="space-y-4">
          {isLogin ? (
            <>
              <input
                name="username"
                type="text"
                placeholder="UserId or Email"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </>
          ) : (
            <>
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                name="username"
                type="text"
                placeholder="UserId"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />

              {/* Avatar Picker */}
              <div className="relative">
                <label className="text-sm font-medium text-slate-600 mb-2 block">
                  Choose Avatar <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className={`w-full border ${formData.avatar ? 'border-blue-500 bg-blue-50' : 'border-slate-300'} rounded-lg px-3 py-2 flex items-center justify-between hover:border-blue-400 transition cursor-pointer`}
                >
                  <div className="flex items-center gap-3">
                    {formData.avatar ? (
                      <>
                        <Image
                          src={formData.avatar}
                          alt="Selected avatar"
                          width={32}
                          height={32}
                          className="rounded-full w-8 h-8"
                        />
                        <span className="text-sm text-slate-700">Avatar Selected</span>
                        <Check className="w-4 h-4 text-green-500" />
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                          <span className="text-slate-400 text-xs">?</span>
                        </div>
                        <span className="text-sm text-slate-500">Select an avatar</span>
                      </>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showAvatarPicker ? 'rotate-180' : ''}`} />
                </button>

                {/* Avatar Dropdown */}
                {showAvatarPicker && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
                    {loadingImages ? (
                      <div className="p-4 text-center text-slate-500 text-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2">Loading avatars...</p>
                      </div>
                    ) : images.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-sm">
                        <p>No avatars available</p>
                        <p className="text-xs mt-1">Please check your backend connection</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-3 p-4">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className={`relative cursor-pointer rounded-full border-2 transition hover:scale-110 ${
                              formData.avatar === img
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : 'border-transparent hover:border-blue-300'
                            }`}
                            onClick={() => handleAvatarSelect(img)}
                            title={`Avatar ${idx + 1}`}
                          >
                            <Image
                              src={img}
                              alt={`avatar-${idx + 1}`}
                              width={50}
                              height={50}
                              className="rounded-full object-cover w-full h-full"
                            />
                            {formData.avatar === img && (
                              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2 rounded-lg font-semibold shadow hover:from-sky-600 hover:to-blue-700 transition cursor-pointer"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>

        {/* OR Divider */}
        <div className="relative my-3">
          <hr className="border-t border-slate-200" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-slate-500">
            or
          </span>
        </div>

        {/* Gmail Auth */}
        <button
          onClick={handleGmailAuth}
          className="w-full flex items-center justify-center gap-2 border border-slate-300 py-2 rounded-lg hover:bg-slate-100 transition font-medium cursor-pointer"
        >
          <Image
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          Continue with Gmail
        </button>

        {/* Toggle Login/Signup */}
        <p className="text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={toggleAuth}
            className="text-blue-600 hover:underline font-medium transition cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
