'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Calendar, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { GradientBackground } from '@/components/gradient-background';
import CreateInterviewModal from '@/components/topic';
import Link from 'next/link';

interface Interview {
  _id: string;
  title?: string;
  topic: string;
  difficulty: string;
  numberOfQuestions: number;
  status: string;
  createdAt: string;
}

interface WorkspaceDetail {
  _id: string;
  title: string;
  Interviews: Interview[];
  createdAt: string;
}

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  
  const { isAuthenticated, hydrated } = useAuthStore();
  const [workspace, setWorkspace] = useState<WorkspaceDetail | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    
    if (hydrated && !isAuthenticated) {
      router.push('/register');
      return;
    }

    fetchWorkspaceData();
  }, [hydrated, isAuthenticated, workspaceId, router]);

  const fetchWorkspaceData = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      
      // Fetch workspace details
      const workspaceResult = await api.getWorkspaceById(workspaceId) as { workspace: WorkspaceDetail };
      if (workspaceResult.workspace) {
        setWorkspace(workspaceResult.workspace);
      }

      // Fetch interviews for this workspace
      const interviewsResult = await api.getWorkspaceInterviews(workspaceId) as { interviews: Interview[] };
      if (interviewsResult.interviews) {
        setInterviews(interviewsResult.interviews);
      }
    } catch (err) {
      console.error('Error fetching workspace data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewCreated = () => {
    // Refresh the interviews list after creating a new one
    fetchWorkspaceData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!hydrated || loading) {
    return (
      <>
        <GradientBackground />
        <div className="flex justify-center items-center h-screen">
          <div className="text-slate-500 text-lg">Loading workspace...</div>
        </div>
      </>
    );
  }

  if (!workspace) {
    return (
      <>
        <GradientBackground />
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="text-slate-500 text-lg mb-4">Workspace not found</div>
          <Link href="/workspace" className="text-blue-500 hover:underline">
            Back to Workspaces
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <GradientBackground />
      
      <div className="min-h-screen p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/workspace" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Workspaces
            </Link>
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">
                  {workspace.title}
                </h1>
                <p className="text-slate-600">
                  Created on {formatDate(workspace.createdAt)} • {interviews.length} interview{interviews.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Create Interview
              </button>
            </div>
          </div>

          {/* Interviews Grid */}
          {interviews.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-12 text-center shadow-lg">
              <div className="mb-4">
                <Calendar className="w-16 h-16 mx-auto text-slate-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No interviews yet
              </h3>
              <p className="text-slate-500 mb-6">
                Create your first interview to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Create Interview
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                        {interview.title || interview.topic}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {interview.topic}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(interview.difficulty)}`}>
                      {interview.difficulty}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {interview.numberOfQuestions} questions
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(interview.createdAt)}
                    </span>
                    
                    <Link 
                      href={`/interview/${interview._id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Start →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Interview Modal */}
      <CreateInterviewModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        workspaceId={workspaceId}
        onSuccess={handleInterviewCreated}
      />
    </>
  );
}
