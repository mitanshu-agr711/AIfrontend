'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Share, Edit, BarChart3, ArrowRight, Plus } from 'lucide-react';
import fakeInterviews from '@/Api/fake'; 
import { api } from '@/lib/api';
import { GradientBackground } from '@/components/gradient-background';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

interface Interview {
  id: string;
  title: string;
  date: Date;
}

interface Toast {
  title: string;
  description: string;
}

const InterviewGrid: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>(fakeInterviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [toast, setToast] = useState<Toast | null>(null);

 
  const handleAddNew = () => {
    const newInterview: Interview = {
      id: Date.now().toString(), 
      title: "New Interview Topic",
      date: new Date(),
    };
    
  
    setInterviews([newInterview, ...interviews]);
    
   
    setEditingId(newInterview.id);
    setEditTitle(newInterview.title);

    setToast({
      title: 'Topic Created',
      description: 'New interview topic started. Please rename it.',
    });
    setTimeout(() => setToast(null), 3000);
  };
  // --------------------------------------

  const handleEditStart = (interview: Interview): void => {
    setEditingId(interview.id);
    setEditTitle(interview.title);
  };

  const handleEditSave = (id: string): void => {
    if (editTitle.trim()) {
      const updated = interviews.map((i) =>
        i.id === id ? { ...i, title: editTitle.trim() } : i
      );
      setInterviews(updated);
      setEditingId(null);
      setEditTitle('');
      setToast({
        title: 'Interview updated',
        description: 'Interview title has been successfully updated.',
      });
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleShare = (interview: Interview): void => {
    const shareText = `Interview: ${interview.title} scheduled for ${format(
      interview.date,
      'MMMM dd, yyyy'
    )}`;

    navigator.clipboard.writeText(shareText);

    setToast({
      title: 'Copied to clipboard',
      description: 'Interview details have been copied to your clipboard.',
    });
    setTimeout(() => setToast(null), 2000);
    
    if (navigator.share) {
      navigator.share({ title: 'Interview Details', text: shareText }).catch((err) => {
        console.error('Share failed:', err);
      });
    }
  };

  return (
    <>
      <Navbar />
      <GradientBackground />
      <div className="rounded-lg p-5 mb-5 mt-10">
          <h1 className="font-bold text-[3rem] sm:text-[5rem] lg:text-[5rem] text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500 m-5 flex justify-center items-center">WORKSPACE</h1>
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
              Start New Topic
            </h3>
            <p className="text-slate-400 text-sm mt-2 text-center group-hover:text-blue-500/70">
              Create a new interview session from scratch
            </p>
          </div>
          {/* ---------------------------------- */}

          {interviews.map((interview) => (
            <div
              key={interview.id}
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
                      onClick={(e) => { e.stopPropagation(); handleShare(interview); }}
                      className="bg-transparent border-none cursor-pointer p-1 hover:bg-blue-50 rounded"
                    >
                      <Share color="#2563eb" size={16} />
                    </button>
                    <button
                      title="Edit"
                      onClick={(e) => { e.stopPropagation(); handleEditStart(interview); }}
                      className="bg-transparent border-none cursor-pointer p-1 hover:bg-blue-50 rounded"
                    >
                      <Edit color="#2563eb" size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {editingId === interview.id ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-lg font-semibold w-full border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter interview title"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave(interview.id);
                          else if (e.key === 'Escape') handleEditCancel();
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSave(interview.id)}
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
                        {interview.title}
                      </h3>
                      <Link 
                        href="/interview"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors w-full justify-center"
                      >
                        <ArrowRight size={16} />
                        Start Interview
                      </Link>
                    </div>
                  )}
                  
                  <div className="space-y-1 mt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Created</span>
                      <span className="text-slate-700 font-semibold">
                        {format(interview.date, 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    {format(interview.date, 'EEEE')}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link 
                      href="/feedback"
                      className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <BarChart3 size={12} />
                      Feedback
                    </Link>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
