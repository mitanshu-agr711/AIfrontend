'use client';

import { useState } from 'react';

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => setIsLogin(!isLogin);

  const handleGmailAuth = () => {
    alert('Google Auth initiated');
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 transition-all">
      <div className="bg-white/90 w-full max-w-sm p-8 rounded-2xl shadow-2xl space-y-7 border border-slate-100 relative">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          {isLogin ? 'Login to Your Account' : 'Create an Account'}
        </h2>

        <div className="space-y-4">
          {isLogin ? (
            <>
              <input
                type="text"
                placeholder="UserId"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="text"
                placeholder="UserId"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </>
          )}
          <button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2 rounded-lg font-semibold shadow hover:from-sky-600 hover:to-blue-700 transition cursor-pointer">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>

        <div className="relative my-3">
          <hr className="border-t border-slate-200" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-3 text-sm text-slate-500">
            or
          </span>
        </div>

        <button
          onClick={handleGmailAuth}
          className="w-full flex items-center justify-center gap-2 border border-slate-300 py-2 rounded-lg hover:bg-slate-100 transition font-medium cursor-pointer "
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="G" className="w-5 h-5" />
          Continue with Gmail
        </button>

        <p className="text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleAuth} className="text-blue-600 hover:underline font-medium transition cursor-pointer">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
