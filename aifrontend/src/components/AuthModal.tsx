'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, ChevronDown, Check } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

type AuthModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  mode?: 'modal' | 'page';
};

export default function AuthModal({ 
  isOpen = true, 
  onClose = () => {}, 
  mode = 'modal' 
}: AuthModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const requestedNext = searchParams.get('next');
  const safeNextPath = requestedNext && requestedNext.startsWith('/') ? requestedNext : null;
  const postAuthRedirectPath = safeNextPath || '/workspace';

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleClose = useCallback(() => {
    if (mode === 'modal' && onClose) {
      onClose();
    } else if (mode === 'page') {
      router.push('/');
    }
    setError(null);
  }, [mode, onClose, router]);


  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoadingImages(true);
        const result = await api.getAvatars();
        if (Array.isArray(result.data)) {
          const urls = result.data.map((item) => item.avatar);
          setImages(urls);
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error("Error fetching images:", err);
        setImages([]);
      } finally {
        setLoadingImages(false);
      }
    };

    if (!isLogin && (mode === 'page' || isOpen)) {
      fetchImages();
    }
  }, [isLogin, isOpen, mode]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (mode === 'page' || isOpen)) {
        if (showAvatarPicker) {
          setShowAvatarPicker(false);
        } else {
          handleClose();
        }
      }
    };
    
    if (mode === 'page' || isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, isOpen, showAvatarPicker, mode]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === 'modal' && e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarSelect = (url: string) => {
    setFormData(prev => ({ ...prev, avatar: url }));
    setShowAvatarPicker(false);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{6,}$/;

  const handleSubmit = async () => {
    setError(null);

   
    if (isLogin) {
      if (!formData.username || !formData.password) {
        setError("Please fill all fields before logging in.");
        return;
      }
    } else {
      if (!formData.name || !formData.username || !formData.email || !formData.password) {
        setError("All fields are required for sign up.");
        return;
      }
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!passwordRegex.test(formData.password)) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (!formData.avatar) {
        setError("Please select an avatar before signing up.");
        return;
      }
    }

    try {
      setLoading(true);
      const result = isLogin
        ? await api.login({ username: formData.username, password: formData.password })
        : await api.register(formData);

    
     
      if (result.token && result.user) {
        setAuth(result.token, result.user);
        
        // Wait for Zustand persist to save to localStorage before navigating
        // This prevents race conditions where the workspace page loads before auth state is persisted
        setTimeout(() => {
          console.log(isLogin ? 'Logged in successfully' : 'Registered successfully');
          console.log('Navigating after auth...'); // Debug log
          router.push(postAuthRedirectPath);
          
          // Close modal if in modal mode
          if (mode === 'modal') {
            handleClose();
          }
          setLoading(false);
        }, 100);
      } else {
        console.error('Missing token or user data:', result); // Debug log
        setLoading(false);
      }
    } catch (err) {
      // Error already handled by API layer with toast
      console.error('Auth error:', err);
      setLoading(false);
    }
  };

  const handleGmailAuth = () => {
    console.log('Google Auth initiated');
  };

  // Don't render if modal mode and not open
  if (mode === 'modal' && !isOpen) return null;

  // Wrapper classes based on mode
const wrapperClasses = mode === 'modal' 
    ? "fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-all duration-300"
    : "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50";

  const containerClasses = "bg-white w-full max-w-sm p-8 rounded-2xl shadow-2xl space-y-7 border border-slate-100 relative transition-all duration-300";

  return (
    <div
      className={wrapperClasses}
      onClick={handleBackdropClick}
    >
      <div
        className={containerClasses}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-500 shadow-md hover:shadow-lg border border-gray-300 hover:border-red-500 transition-all duration-200 z-10 cursor-pointer flex items-center justify-center group"
          aria-label={mode === 'modal' ? 'Close modal' : 'Go to home'}
          type="button"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-200" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          {isLogin ? 'Login to Your Account' : 'Create an Account'}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 border border-red-200 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Form Fields */}
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
            disabled={loading}
            onClick={handleSubmit}
            className={`w-full bg-linear-to-r from-sky-500 to-blue-600 text-white py-2 rounded-lg font-semibold shadow hover:from-sky-600 hover:to-blue-700 transition cursor-pointer ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
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

        {/* Toggle */}
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
}
