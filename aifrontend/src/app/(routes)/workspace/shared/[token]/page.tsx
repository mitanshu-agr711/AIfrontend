'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowRight, Users } from 'lucide-react';
import { GradientBackground } from '@/components/gradient-background';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

type SharedWorkspace = {
  _id: string;
  title: string;
  Interviews: string[];
  createdBy: string;
  isShared?: boolean;
  shareToken?: string | null;
  createdAt: string;
  updatedAt: string;
};

type SharedInterview = {
  _id: string;
  title?: string;
  topic: string;
  status?: string;
  createdAt: string;
};

export default function SharedWorkspacePage() {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = params.token as string;

  const { hydrated, isAuthenticated, lastCompletedInterviewId, setLastCompletedInterviewId } = useAuthStore();

  const [workspace, setWorkspace] = useState<SharedWorkspace | null>(null);
  const [interviews, setInterviews] = useState<SharedInterview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSharedWorkspace = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await api.getSharedWorkspace(token) as {
        workspace?: SharedWorkspace;
        interviews?: SharedInterview[];
      };

      if (result.workspace) {
        setWorkspace(result.workspace);
      }

      if (result.interviews) {
        setInterviews(result.interviews);
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
    } catch (error) {
      console.error('Failed to load shared workspace:', error);
    } finally {
      setLoading(false);
    }
  }, [lastCompletedInterviewId, setLastCompletedInterviewId, token]);

  useEffect(() => {
    void fetchSharedWorkspace();
  }, [fetchSharedWorkspace]);

  const handleStartInterview = useCallback(async (interviewId: string) => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      const restored = await api.restoreSession();
      if (!restored) {
        const nextPath = `${pathname}?startInterview=${encodeURIComponent(interviewId)}`;
        router.push(`/register?next=${encodeURIComponent(nextPath)}`);
        return;
      }
    }

    router.push(`/interview/${interviewId}`);
  }, [hydrated, isAuthenticated, pathname, router]);

  useEffect(() => {
    const pendingInterviewId = searchParams.get('startInterview');
    if (!pendingInterviewId || !hydrated || !isAuthenticated) return;
    void handleStartInterview(pendingInterviewId);
  }, [searchParams, hydrated, isAuthenticated, handleStartInterview]);

  if (loading) {
    return (
      <>
        <GradientBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-slate-600 text-lg">Loading shared workspace...</div>
        </div>
      </>
    );
  }

  if (!workspace) {
    return (
      <>
        <GradientBackground />
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl">
            <h1 className="text-3xl font-bold text-slate-800">Shared workspace not found</h1>
            <p className="mt-2 text-slate-600">
              This share link is invalid, expired, or has been revoked by the owner.
            </p>
            <Link
              href="/workspace"
              className="mt-5 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-white font-semibold hover:bg-blue-700 transition-all"
            >
              Go to Workspace
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GradientBackground />
      <div className="min-h-screen p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-lg">
            <div className="flex items-center gap-3 text-sky-700 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Shared Workspace</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800">{workspace.title}</h1>
            <p className="text-slate-600 mt-2">
              {interviews.length} interview{interviews.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {interviews.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-10 text-center shadow">
              <h2 className="text-xl font-semibold text-slate-800">No interviews available</h2>
              <p className="text-slate-600 mt-2">This shared workspace does not have interviews yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-blue-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar color="#2563eb" size={24} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {interview.status || 'not-started'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-800 text-lg leading-tight line-clamp-2 min-h-14">
                    {interview.title || interview.topic}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{interview.topic}</p>

                  <button
                    onClick={() => void handleStartInterview(interview._id)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors w-full justify-center cursor-pointer"
                  >
                    <ArrowRight size={16} />
                    Start Interview
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
