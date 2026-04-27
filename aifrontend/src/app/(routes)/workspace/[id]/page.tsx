'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Calendar, BarChart3, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { GradientBackground } from '@/components/gradient-background';
import CreateInterviewModal from '@/components/topic';
import Link from 'next/link';

interface Interview {
  _id: string;
  title?: string;
  topic: string;
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

  const { isAuthenticated, hydrated, lastCompletedInterviewId, setLastCompletedInterviewId } = useAuthStore();
  const [workspace, setWorkspace] = useState<WorkspaceDetail | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchWorkspaceData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);

      const workspaceResult = await api.getWorkspaceById(workspaceId) as unknown as { workspace: WorkspaceDetail };
      if (workspaceResult.workspace) {
        setWorkspace(workspaceResult.workspace);
      }

      const interviewsResult = await api.getWorkspaceInterviews(workspaceId) as { interviews: Interview[] };
      if (interviewsResult.interviews) {
        setInterviews(interviewsResult.interviews);
      }

      if (lastCompletedInterviewId) {
        setInterviews((current) =>
          current.map((interview) =>
            interview._id === lastCompletedInterviewId
              ? { ...interview, status: 'completed' }
              : interview
          )
        );
        setLastCompletedInterviewId(null);
      }
    } catch (err) {
      console.error('Error fetching workspace data:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, lastCompletedInterviewId, setLastCompletedInterviewId, workspaceId]);

  useEffect(() => {
    const init = async () => {
      if (!hydrated) return;

      if (!isAuthenticated) {
        const restored = await api.restoreSession();
        if (!restored) {
          router.push('/register');
          return;
        }
      }

      void fetchWorkspaceData();
    };

    init();
  }, [fetchWorkspaceData, hydrated, isAuthenticated, router]);

  const handleInterviewCreated = () => {
    fetchWorkspaceData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
                <h1 className="text-4xl font-bold text-slate-800 mb-2">{workspace.title}</h1>
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

          {interviews.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-12 text-center shadow-lg">
              <div className="mb-4">
                <Calendar className="w-16 h-16 mx-auto text-slate-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No interviews yet</h3>
              <p className="text-slate-500 mb-6">Create your first interview to get started</p>
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
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-blue-300 transform hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Calendar color="#2563eb" size={24} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-800 text-lg leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                        {interview.title || interview.topic}
                      </h3>
                      <p className="text-sm text-slate-500">{interview.topic}</p>

                      <Link
                        href={`/interview/${interview._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors w-full justify-center"
                      >
                        <ArrowRight size={16} />
                        Start Interview
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Created</span>
                      <span className="text-slate-700 font-semibold">{formatDate(interview.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-slate-500 font-medium">Day</span>
                      <span className="text-slate-700 font-semibold">
                        {new Date(interview.createdAt).toLocaleDateString('en-US', { weekday: 'long' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Link
                        href={interview._id? `/feedback?interviewId=${interview._id}` : "/feedback"}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                      >
                        <BarChart3 size={12} />
                        Analytics
                      </Link>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateInterviewModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        workspaceId={workspaceId}
        onSuccess={handleInterviewCreated}
      />
    </>
  );
}
