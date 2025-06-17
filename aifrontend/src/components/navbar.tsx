'use client'

import { useState } from "react";
import { Menu, PanelRightClose } from "lucide-react";
import Logo from "@/components/lib/logo/page"



export const Navbar=()=>
{
  const [menuOpen, setMenuOpen] = useState(false);

    return(
        <>
        <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex justify-center items-center w-[60%] lg:w-1/2 rounded-full
    bg-transparent md:border-b md:border-white/20 shadow-md  backdrop-blur-md mb-30">
        <div className="container mx-auto px-4 py-4 ">
          <div className="flex flex-row  justify-between items-center">
            <div className="flex items-center justify-between w-full space-x-4">
              <div><Logo /> </div>
              <button
                className="md:hidden ml-auto text-2xl"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
              >
                {menuOpen ? (
                  <PanelRightClose size={32} />
                ) : (
                  <Menu size={32} />
                )}
              </button>
            </div>
            <ul className="hidden md:flex flex-row space-x-8 ml-8 text-2xl font-semibold">
              <li className="transition-all duration-300 hover:rounded-full px-2 py-2">
                <a href="/about" className="block font-semibold ">
                  About
                </a>
              </li>

              <li className="transition-all duration-300 hover:rounded-full px-2 py-2">
                <a href="/contact" className="font-semibold">
                  Contact
                </a>
              </li>
              <li className="transition-all duration-300 hover:rounded-full px-2 py-2">
                <a href="/services" className="font-semibold">
                  Services
                </a>
              </li>
            </ul>
          </div>


          {menuOpen && (
            <div className="md:hidden ">
              <ul className="flex flex-col space-y-2 z-50 bg-transparent py-4 font-semibold">
                <li className="hover:bg-gray-600 px-2 py-1 rounded">
                  <a
                    href="/about"
                    className="px-4 py-2 w-fit inline-block"
                    onClick={() => setMenuOpen(false)}
                  >
                    About
                  </a>
                </li>
                <li className="hover:bg-gray-600 px-2 py-1 rounded">
                  <a
                    href="/contact"
                    className="px-4 py-2 w-fit inline-block"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </a>
                </li>
                <li className="hover:bg-gray-600 px-2 py-1 rounded">
                  <a
                    href="/services"
                    className="px-4 py-2 w-fit inline-block"
                    onClick={() => setMenuOpen(false)}
                  >
                    Services
                  </a>
                </li>
              </ul>
            </div>
          )}

        </div>
      </nav>
        </>
    )
}