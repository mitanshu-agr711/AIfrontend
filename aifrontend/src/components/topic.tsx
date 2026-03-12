'use client';

import { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '@/lib/api';

type CreateInterviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccess?: () => void;
};

export default function CreateInterviewModal({ 
  isOpen, 
  onClose, 
  workspaceId,
  onSuccess 
}: CreateInterviewModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
  });

  const handleClose = useCallback(() => {
    onClose();
    setError(null);
    // Reset form on close
    setFormData({
      title: '',
      description: '',
      topic: '',
    });
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };


  const handleSubmit = async () => {
    setError(null);

    // Validation - topic is required
    if (!formData.topic.trim()) {
      setError("Topic is required.");
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        workspaceId,
        topic: formData.topic.trim(),
        ...(formData.title.trim() && { title: formData.title.trim() }),
        ...(formData.description.trim() && { description: formData.description.trim() })
      };

      await api.createInterview(payload);
      
      console.log('Interview created successfully');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
      setLoading(false);
    } catch (err) {
      console.error('Create interview error:', err);
      setLoading(false);
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  const wrapperClasses = "fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-all duration-300";
  const containerClasses = "bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl space-y-6 border border-slate-100 relative transition-all duration-300 max-h-[90vh] overflow-y-auto";

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
          aria-label="Close modal"
          type="button"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-200" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Create New Interview
        </h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Fill in the details to create your interview session
        </p>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 border border-red-200 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Topic (Required) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              name="topic"
              type="text"
              placeholder="e.g., React, Node.js, Data Structures"
              value={formData.topic}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              required
            />
          </div>

          {/* Title (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              name="title"
              type="text"
              placeholder="Give your interview a custom title"
              value={formData.title}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <textarea
              name="description"
              placeholder="Add a description for this interview"
              value={formData.description}
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? 'Creating Interview...' : 'Create Interview'}
        </button>

        <p className="text-xs text-center text-gray-500">
          Fields marked with <span className="text-red-500">*</span> are required
        </p>
      </div>
    </div>
  );
}
