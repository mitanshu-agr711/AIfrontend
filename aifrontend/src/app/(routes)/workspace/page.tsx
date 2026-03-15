'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, Share, Edit, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { GradientBackground } from '@/components/gradient-background';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, PanelRightClose } from "lucide-react";
import Logo from "@/components/lib/logo/page";
import AuthModal from "@/components/AuthModal";

interface Workspace {
  _id: string;
  title: string;
  Interviews: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Toast {
  title: string;
  description: string;
}

const InterviewGrid: React.FC = () => {

  const [profileOpen, setProfileOpen] = useState(false);
  
    const { isAuthenticated, user, hydrated } = useAuthStore();

   const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const router = useRouter();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!deleteConfirmId) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('[data-delete-popover="true"]')) {
        return;
      }
      setDeleteConfirmId(null);
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [deleteConfirmId]);

  // Fetch workspaces on mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      // Wait for hydration to complete before checking auth
      if (!hydrated) {
        setLoading(true);
        return;
      }

      // Try silent session restore once before redirecting
      if (!isAuthenticated) {
        const restored = await api.restoreSession();
        if (!restored) {
          router.push('/register');
          return;
        }
      }

      // Don't fetch if not authenticated
      if (!isAuthenticated) {
        return;
      }

      try {
        setLoading(true);
        const result = await api.getWorkspaces() as { success?: boolean; workspaces: Workspace[] };
        if (result.workspaces) {
          setWorkspaces(result.workspaces);
        } else {
          setWorkspaces([]);
        }
      } catch (err) {
        // If error fetching workspaces, show empty state
        console.error('Error fetching workspaces:', err);
        setWorkspaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [router, isAuthenticated, hydrated]);

  const handleAddNew = async () => {
    if (!isAuthenticated) {
      router.push('/register');
      return;
    }

    try {
      const result = await api.createWorkspace('New Workspace') as { success: boolean; workspace: Workspace };
      
      if (result.workspace) {
        setWorkspaces([result.workspace, ...workspaces]);
        setEditingId(result.workspace._id);
        setEditTitle(result.workspace.title);

        setToast({
          title: 'Workspace Created',
          description: 'New workspace created. Please rename it.',
        });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      // Error already handled by API layer with toast
      console.error('Error creating workspace:', err);
    }
  };

  const handleEditStart = (workspace: Workspace): void => {
    setEditingId(workspace._id);
    setEditTitle(workspace.title);
  };

  const handleEditSave = async (id: string): Promise<void> => {
    if (!editTitle.trim()) return;

    try {
      await api.renameWorkspace(id, editTitle.trim());
      
      const updated = workspaces.map((w) =>
        w._id === id ? { ...w, title: editTitle.trim() } : w
      );
      setWorkspaces(updated);
      setEditingId(null);
      setEditTitle('');
      
      setToast({
        title: 'Workspace updated',
        description: 'Workspace title has been successfully updated.',
      });
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      // Error already handled by API layer with toast
      console.error('Error updating workspace:', err);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await api.deleteWorkspace(id);
      setWorkspaces(workspaces.filter(w => w._id !== id));
      setDeleteConfirmId(null);
      
      setToast({
        title: 'Workspace deleted',
        description: 'Workspace has been successfully deleted.',
      });
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      // Error already handled by API layer with toast
      console.error('Error deleting workspace:', err);
    }
  };

  const handleShare = (workspace: Workspace): void => {
    const shareText = `Workspace: ${workspace.title} - ${workspace.Interviews?.length || 0} interviews`;

    navigator.clipboard.writeText(shareText);

    setToast({
      title: 'Copied to clipboard',
      description: 'Workspace details have been copied to your clipboard.',
    });
    setTimeout(() => setToast(null), 2000);
    
    if (navigator.share) {
      navigator.share({ title: 'Workspace Details', text: shareText }).catch((err) => {
        console.error('Share failed:', err);
      });
    }
  };

  if (!hydrated || loading) {
    return (
      <>
       
        <GradientBackground />
        <div className="rounded-lg p-5 mb-5 mt-10">
          <h1 className="font-bold text-[3rem] sm:text-[5rem] lg:text-[5rem] text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500 m-5 flex justify-center items-center">
            WORKSPACE
          </h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-500 text-lg">Loading workspaces...</div>
        </div>
      </>
    );
  }

  return (
    <>

       <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] md:w-3/4 lg:w-1/2 rounded-full shadow-xl border border-white/20 backdrop-blur-lg bg-white/70 transition-all cursor-pointer">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <Logo />
          </div>

          <ul className="hidden md:flex items-center space-x-6 text-lg font-medium">
            <li>
              <a href="/home" className="px-4 py-2 rounded-full transition-all  hover:text-white hover:bg-sky-600">
                Home
              </a>
            </li>
            <li>
              <a href="/contact" className="px-4 py-2 rounded-full transition-all  hover:text-white hover:bg-sky-600">
                Contact
              </a>
            </li>
            {/* <li>
              <a href="#features" className="px-4 py-2 rounded-full transition-all  hover:text-white hover:bg-sky-600">
                Features
              </a>
            </li> */}
            <li>
              {hydrated && isAuthenticated && user ? (
                <div className="relative">

                  {/* Avatar Button */}
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 px-6 py-2"
                    title="Open profile menu"
                  >
                  <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-sky-500"
                     />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50">

                      <div className="px-4 py-2 text-gray-700 font-medium border-b">
                        {user.name}
                      </div>

                      <button
                        onClick={() => {
                          // logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Logout
                      </button>

                    </div>
                  )}

                </div>
              ) : (
                <button
                  className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:from-sky-600 hover:to-blue-600 transition-all cursor-pointer"
                  onClick={() => {
                    setShowAuth(true);
                    setMenuOpen(false);
                  }}
                >
                  Register
                </button>
              )}
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
          className={`md:hidden absolute left-0 right-0 top-full bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-b-3xl transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-60 py-4" : "max-h-0 py-0"
            }`}
        >
          <ul className="flex flex-col items-center space-y-3 text-lg font-medium">
            <li>
              <a
                href="/home"
                className="block px-6 py-2 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800 w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                Home
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
            {/* <li>
              <a
                href="/feature"
                className="block px-6 py-2 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800 w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                Feature
              </a>
            </li> */}
            <li>
              {hydrated && isAuthenticated && user ? (
                <div className="relative">

                  {/* Avatar Button */}
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 px-6 py-2"
                    title="Avatar"
                  >
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-sky-500"
                    />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50">

                      <div className="px-4 py-2 text-gray-700 font-medium border-b">
                        {user.name}
                      </div>

                      <button
                        onClick={() => {
                          // logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Logout
                      </button>

                    </div>
                  )}

                </div>
              ) : (
                <button
                  className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:from-sky-600 hover:to-blue-600 transition-all cursor-pointer"
                  onClick={() => {
                    setShowAuth(true);
                    setMenuOpen(false);
                  }}
                >
                  Register
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode="modal"
      />
      <GradientBackground />
      <div className="rounded-lg p-5 mb-5 mt-[6rem]">
        <h1 className="font-bold text-[3rem] sm:text-[5rem] lg:text-[5rem] text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500 m-5 flex justify-center items-center">
          WORKSPACE
        </h1>
      </div>
      
      <div>
        {toast && (
          <div className="fixed top-5 right-5 bg-blue-600 text-white px-4 py-2.5 rounded-lg z-50 shadow-lg">
            <span className="text-sm font-medium">{toast.title}</span>
            <p className="text-xs opacity-90">{toast.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-5">
          
          <div 
            onClick={handleAddNew}
            className="group cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center min-h-[250px] hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
          >
            <div className="bg-slate-200 group-hover:bg-blue-100 p-4 rounded-full mb-4 transition-colors duration-300">
              <Plus className="text-slate-500 group-hover:text-blue-600" size={32} />
            </div>
            <h3 className="font-semibold text-slate-600 group-hover:text-blue-700 text-lg">
              Create New Workspace
            </h3>
            <p className="text-slate-400 text-sm mt-2 text-center group-hover:text-blue-500/70">
              Start organizing your interviews
            </p>
          </div>

          {workspaces.map((workspace) => (
            <div
              key={workspace._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-blue-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar color="#2563eb" size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      title="Share"
                      onClick={(e) => { e.stopPropagation(); handleShare(workspace); }}
                      className="bg-transparent border-none cursor-pointer p-1 hover:bg-blue-50 rounded"
                    >
                      <Share color="#2563eb" size={16} />
                    </button>
                    <button
                      title="Edit"
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); handleEditStart(workspace); }}
                      className="bg-transparent border-none cursor-pointer p-1 hover:bg-blue-50 rounded"
                    >
                      <Edit color="#2563eb" size={16} />
                    </button>
                    <div className="relative" data-delete-popover="true">
                      <button
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId((current) => current === workspace._id ? null : workspace._id);
                        }}
                        className="bg-transparent border-none cursor-pointer p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 color="#ef4444" size={16} />
                      </button>

                      {deleteConfirmId === workspace._id && (
                        <div className="absolute right-0 top-full z-30 mt-2 w-52 rounded-xl border border-red-200 bg-white p-3 shadow-[0_18px_40px_rgba(239,68,68,0.18)]">
                          <p className="text-xs font-medium leading-5 text-slate-700">
                            Delete this workspace?
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(workspace._id);
                              }}
                              className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-red-600"
                            >
                              Delete
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(null);
                              }}
                              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {editingId === workspace._id ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-lg font-semibold w-full border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter workspace title"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave(workspace._id);
                          else if (e.key === 'Escape') handleEditCancel();
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSave(workspace._id)}
                          className="flex-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="flex-1 border border-slate-300 px-3 py-1 rounded hover:bg-slate-100 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-800 text-lg leading-tight line-clamp-2 min-h-[3.5rem]">
                        {workspace.title}
                      </h3>
                      <Link 
                        href={`/workspace/${workspace._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors w-full justify-center"
                      >
                        <ArrowRight size={16} />
                        Create Interview
                      </Link>
                    </div>
                  )}
                  
                  <div className="space-y-1 mt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Created</span>
                      <span className="text-slate-700 font-semibold">
                        {new Date(workspace.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Interviews</span>
                      <span className="text-slate-700 font-semibold">
                        {workspace.Interviews?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

             
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InterviewGrid;
