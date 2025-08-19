'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Share, Edit, BarChart3, ArrowRight } from 'lucide-react';
import fakeInterviews from '@/Api/fake'; 
import { GradientBackground } from '@/components/gradient-background';
import Link from 'next/link';

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
     <GradientBackground />
    <div className=" rounded-lg p-5 mb-5">
        <h1 className="font-bold text-[3rem] sm:text-[5rem] lg:text-[5rem] text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500 m-5 flex justify-center items-center">WORKSPACE</h1>
        {/* <p className="text-slate-600 m-5">
            Manage your upcoming interviews. Click on an interview to edit or share details.
        </p> */}
    </div>
    <div>
      {toast && (
        <div className="fixed top-5 right-5 bg-blue-600 text-white px-4 py-2.5 rounded-lg z-50">
          <span className="text-sm">{toast.description}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-5">
        {Array.isArray(interviews) && interviews.length > 0 ? (
          interviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-blue-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar color="#2563eb" size={24} />
                </div>
                <div className="flex gap-2">
                  <button
                    title="Share"
                    onClick={() => handleShare(interview)}
                    className="bg-transparent border-none cursor-pointer p-1 hover:bg-blue-50 rounded"
                  >
                    <Share color="#2563eb" size={16} />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => handleEditStart(interview)}
                    className="bg-transparent border-none cursor-pointer p-1 hover:bg-blue-50 rounded"
                  >
                    <Edit color="#2563eb" size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {editingId === interview.id ? (
                  <div className="space-y-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-lg font-semibold w-full border border-slate-300 rounded px-2 py-1"
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
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="flex-1 border border-slate-300 px-3 py-1 rounded hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-800 text-lg leading-tight">
                      {interview.title}
                    </h3>
                    <Link 
                      href="/interview"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      <ArrowRight size={16} />
                      Start Interview
                    </Link>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 font-medium">Date</span>
                    <span className="text-slate-700 font-semibold">
                      {format(interview.date, 'MMMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 font-medium">Day</span>
                    <span className="text-slate-700 font-semibold">
                      {format(interview.date, 'EEEE')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    {format(interview.date, 'MMM dd')}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link 
                      href="/feedback"
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                    >
                      <BarChart3 size={12} />
                      View Feedback
                    </Link>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Calendar color="#94a3b8" className="mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No interviews scheduled
            </h3>
            <p className="text-slate-500">
              Click &quot;Add Interview&quot; to schedule your first interview
            </p>
          </div>
        )}
      </div>
    </div>
   <button className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg cursor-pointer hover:bg-blue-700 transition-colors duration-300">
  Share with friend
</button>

    </>
  );
};

export default InterviewGrid;
