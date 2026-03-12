'use client';

import { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

type CreateInterviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccess?: (interview: any) => void;
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
    difficulty: 'Medium',
    numberOfQuestions: 5
  });

  const handleClose = useCallback(() => {
    onClose();
    setError(null);
    // Reset form
    setFormData({
      title: '',
      description: '',
      topic: '',
      difficulty: 'Medium',
      numberOfQuestions: 5
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.name === 'numberOfQuestions' ? parseInt(e.target.value) || 1 : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required field
    if (!formData.topic.trim()) {
      setError("Topic is required.");
      return;
    }

    try {
      setLoading(true);
      
      // Import api dynamically to avoid circular dependencies
      const { api } = await import('@/lib/api');
      
      const payload = {
        workspaceId,
        title: formData.title || undefined,
        description: formData.description || undefined,
        topic: formData.topic.trim(),
        difficulty: formData.difficulty,
        numberOfQuestions: formData.numberOfQuestions
      };

      console.log('Creating interview with payload:', payload);
      
      const result = await api.createInterview(payload);
      
      console.log('Interview created:', result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      handleClose();
    } catch (err) {
      console.error('Create interview error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl space-y-6 border border-slate-100 relative transition-all duration-300 max-h-[90vh] overflow-y-auto"
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

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 border border-red-200 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title <span className="text-slate-400">(Optional)</span>
            </label>
            <input
              name="title"
              type="text"
              placeholder="e.g., Backend Interview Session"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description <span className="text-slate-400">(Optional)</span>
            </label>
            <textarea
              name="description"
              placeholder="e.g., Backend developer interview"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none"
            />
          </div>

          {/* Topic - Required */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              name="topic"
              type="text"
              placeholder="e.g., Node, React, Python, Java"
              value={formData.topic}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white cursor-pointer"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Number of Questions
            </label>
            <input
              name="numberOfQuestions"
              type="number"
              min="1"
              max="50"
              value={formData.numberOfQuestions}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Creating...' : 'Create Interview'}
          </button>
        </form>

        {/* Info Text */}
        <p className="text-xs text-center text-slate-500">
          Fields marked with <span className="text-red-500">*</span> are required
        </p>
      </div>
    </div>
  );
}
