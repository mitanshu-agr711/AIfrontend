'use client';

import { useState } from 'react';

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => setIsLogin(!isLogin);

  const handleGmailAuth = () => {

    alert('Google Auth initiated');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-slate-800">
          {isLogin ? 'Login to Your Account' : 'Create an Account'}
        </h2>

        <div className="space-y-4">
          {isLogin && (
            <>
              <input
                type="text"
                placeholder="UserId"
                className="w-full border border-slate-300 rounded px-3 py-2 outline-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-slate-300 rounded px-3 py-2 outline-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-slate-300 rounded px-3 py-2 outline-blue-500"
              />

            </>
          )}
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-slate-300 rounded px-3 py-2 outline-blue-500"
              />
              <input
                type="text"
                placeholder="UserId"
                className="w-full border border-slate-300 rounded px-3 py-2 outline-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-slate-300 rounded px-3 py-2 outline-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-slate-300 rounded px-3 py-2 outline-blue-500"
              />
              <input
                type="password"
                placeholder="confirmed -password"
                className="w-full border border-slate-300 rounded px-3 py-2 outline-blue-500"
              />
            </>
          )}
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>

        <div className="relative my-4">
          <hr className="border-t border-slate-200" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-white px-3 text-sm text-slate-500">
            or
          </span>
        </div>

        <button
          onClick={handleGmailAuth}
          className="w-full flex items-center justify-center gap-2 border border-slate-300 py-2 rounded hover:bg-slate-100 transition"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="G" className="w-5 h-5" />
          Continue with Gmail
        </button>

        <p className="text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleAuth} className="text-blue-600 hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
