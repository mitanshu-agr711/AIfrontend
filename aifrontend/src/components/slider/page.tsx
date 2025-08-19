
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Briefcase, BarChart3, User, LogOut, Upload } from "lucide-react";

const SideBar = () => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Home",
      href: "/home",
      icon: Home,
    },
    {
      name: "Interview",
      href: "/interview", 
      icon: MessageSquare,
    },
    {
      name: "Workspace",
      href: "/workspace",
      icon: Briefcase,
    },
    {
      name: "Feedback",
      href: "/feedback",
      icon: BarChart3,
    }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-100 min-h-screen p-6 flex flex-col relative shadow-lg border-r">
      {/* Profile Section */}
      <div className="font-bold text-3xl flex items-center justify-center mb-8 text-gray-800">
        <User className="w-8 h-8 mr-2" />
        Profile
      </div>

      <div className="mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">John Doe</h3>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Photo
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul className="flex flex-col gap-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-500 text-white shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:bg-white hover:shadow-md hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="flex justify-center mt-8">
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 w-full justify-center">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
