'use client';

import { useState } from "react";
import { Menu, PanelRightClose } from "lucide-react";
import Logo from "@/components/lib/logo/page";
import AuthModal from "@/app/(routes)/register/page";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] md:w-3/4 lg:w-1/2 rounded-full shadow-xl border border-white/20 backdrop-blur-lg bg-white/70 transition-all">
        <div className="flex items-center justify-between px-6 py-3">
         
          <div className="flex items-center space-x-4">
            <Logo />
          </div>

          
          <ul className="hidden md:flex items-center space-x-6 text-lg font-medium">
            <li>
              <a href="/about" className="px-4 py-2 rounded-full transition-all hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="px-4 py-2 rounded-full transition-all hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800">
                Contact
              </a>
            </li>
            <li>
              <a href="/feature" className="px-4 py-2 rounded-full transition-all hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800">
                Feature
              </a>
            </li>
            <li>
              <button
                className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:from-sky-600 hover:to-blue-600 transition-all"
                onClick={() => setShowAuth(true)}
              >
                Register
              </button>
            </li>
          </ul>

         
          <button
            className="md:hidden text-sky-700 dark:text-sky-300 p-2 rounded-full hover:bg-sky-100 dark:hover:bg-gray-800 transition-all"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <PanelRightClose size={32} /> : <Menu size={32} />}
          </button>
        </div>

   
        <div
          className={`md:hidden absolute left-0 right-0 top-full bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-b-3xl transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-60 py-4" : "max-h-0 py-0"
          }`}
        >
          <ul className="flex flex-col items-center space-y-3 text-lg font-medium">
            <li>
              <a
                href="/about"
                className="block px-6 py-2 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800 w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="block px-6 py-2 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800 w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/feature"
                className="block px-6 py-2 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800 w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                Feature
              </a>
            </li>
            <li>
              <button
                className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:from-sky-600 hover:to-blue-600 transition-all"
                onClick={() => {
                  setShowAuth(true);
                  setMenuOpen(false);
                }}
              >
                Register
              </button>
            </li>
          </ul>
        </div>
      </nav>

     
      {showAuth && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-sky-500 z-10"
              onClick={() => setShowAuth(false)}
              aria-label="Close modal"
            >
              <PanelRightClose size={28} />
            </button>
            <AuthModal />
          </div>
        </div>
      )}
    </>
  );
};
