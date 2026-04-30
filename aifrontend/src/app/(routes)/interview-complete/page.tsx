"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle, BarChart3, Home, ArrowRight, Loader2, Clock3, CircleCheckBig, CircleX } from "lucide-react";
import { Button } from "@/components/button";
import { GradientBackground } from "@/components/gradient-background";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

type InterviewDetailResponse = {
  interview: {
    id: string;
    attemptId?: string;
    title: string;
    topic: string;
    status: string;
    startedAt?: string;
    completedAt?: string;
  };
  analytics: {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    unansweredQuestions: number;
    scorePercentage: number;
    totalTimeTakenSeconds?: number;
  };
  questionsWithAnswers: Array<{
    timeTaken?: number | null;
  }>;
};

type UserAnalyticsInterview = {
  attemptId?: string;
  title?: string;
  topic?: string;
  status?: string;
  createdAt?: string;
};

type UserAnalyticsResponse = {
  recentInterviews?: UserAnalyticsInterview[];
};

const resolveLatestCompletedAttemptId = (recentInterviews: UserAnalyticsInterview[] = []) => {
  if (!recentInterviews.length) return "";

  const sortedInterviews = [...recentInterviews].sort((a, b) => {
    const aTime = new Date(a.createdAt || 0).getTime();
    const bTime = new Date(b.createdAt || 0).getTime();
    return bTime - aTime;
  });

  const completedInterview = sortedInterviews.find(
    (item) => (item.status || "").toLowerCase() === "completed" && item.attemptId
  );

  return completedInterview?.attemptId || sortedInterviews[0]?.attemptId || "";
};

const InterviewCompletePage = () => {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<InterviewDetailResponse | null>(null);
  const [emptyStateMessage, setEmptyStateMessage] = useState<string | null>(null);
  const [resolvedAttemptId, setResolvedAttemptId] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!hydrated) return;

      if (!isAuthenticated) {
        const restored = await api.restoreSession();
        if (!restored) {
          router.push("/register");
          return;
        }
      }

      try {
        setLoading(true);
        setDetails(null);
        setEmptyStateMessage(null);
        setResolvedAttemptId("");

        // Give the backend a short moment to persist the completed attempt.
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const analyticsResult = (await api.getUserAnalytics()) as UserAnalyticsResponse;
        const latestAttemptId = resolveLatestCompletedAttemptId(analyticsResult.recentInterviews || []);

        if (!latestAttemptId) {
          setEmptyStateMessage(
            "Please complete your interview first. Answer at least one question and finish the interview to see the completion summary."
          );
          return;
        }

        const analysis = (await api.getInterviewDetails(latestAttemptId)) as InterviewDetailResponse;
        setResolvedAttemptId(latestAttemptId);
        setDetails(analysis);
      } catch (error) {
        console.error("Failed to load interview details:", error);
        setEmptyStateMessage(
          "We could not load the latest completed interview summary right now. Please try again after finishing an interview."
        );
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [hydrated, isAuthenticated, router]);

  const totalDurationMins = useMemo(() => {
    if (!details) return 0;

    if (details.analytics.totalTimeTakenSeconds && details.analytics.totalTimeTakenSeconds > 0) {
      return Math.round(details.analytics.totalTimeTakenSeconds / 60);
    }

    const secondsFromAnswers = details.questionsWithAnswers.reduce((sum, q) => sum + (q.timeTaken || 0), 0);
    if (secondsFromAnswers > 0) return Math.round(secondsFromAnswers / 60);

    if (details.interview.startedAt && details.interview.completedAt) {
      const start = new Date(details.interview.startedAt).getTime();
      const end = new Date(details.interview.completedAt).getTime();
      if (!Number.isNaN(start) && !Number.isNaN(end) && end > start) {
        return Math.round((end - start) / 60000);
      }
    }

    return 0;
  }, [details]);

  if (!hydrated || loading) {
    return (
      <>
        <GradientBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-700 bg-white/90 border border-slate-200 rounded-xl px-5 py-3 shadow">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading interview summary...
          </div>
        </div>
      </>
    );
  }

  if (emptyStateMessage || !details) {
    return (
      <>
        <GradientBackground />
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center border">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No completed interview found</h1>
            <p className="text-gray-600 mb-8">{emptyStateMessage}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/workspace" className="flex items-center justify-center gap-2">
                  Start Interview
                </Link>
              </Button>

              <Button className="w-full bg-blue-500 hover:bg-blue-600" asChild>
                <Link href="/feedback" className="flex items-center justify-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Go to Feedback
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const analytics = details.analytics;
  const feedbackHref = resolvedAttemptId ? `/feedback?interviewId=${resolvedAttemptId}` : "/feedback";

  return (
    <>
      <GradientBackground />
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-3xl w-full text-center border">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Interview Completed Successfully!</h1>
            <p className="text-xl text-gray-600">Great job! Your interview has been processed by the AI system.</p>
            <p className="text-sm text-gray-500 mt-3">
              {details.interview.title} • {details.interview.topic}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Clock3 className="w-5 h-5" />
                <span className="text-2xl font-bold">{totalDurationMins} min</span>
              </div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CircleCheckBig className="w-5 h-5" />
                <span className="text-2xl font-bold">
                  {analytics ? `${analytics.correctAnswers ?? 0}/${analytics.totalQuestions ?? 0}` : "0/0"}
                </span>
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">{analytics ? `${analytics.scorePercentage ?? 0}%` : "0%"}</div>
              <div className="text-sm text-gray-600">Performance Score</div>
            </div>
          </div>

          {analytics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left">
              <div className="bg-white border rounded-xl p-4">
                <div className="text-xs text-slate-500">Answered</div>
                <div className="text-xl font-bold text-slate-800">{analytics.answeredQuestions}</div>
              </div>
              <div className="bg-white border rounded-xl p-4">
                <div className="text-xs text-slate-500">Wrong</div>
                <div className="text-xl font-bold text-rose-600 flex items-center gap-2">
                  <CircleX className="w-4 h-4" />
                  {analytics.wrongAnswers}
                </div>
              </div>
              <div className="bg-white border rounded-xl p-4">
                <div className="text-xs text-slate-500">Unanswered</div>
                <div className="text-xl font-bold text-amber-600">{30 - analytics.answeredQuestions}</div>
              </div>
              <div className="bg-white border rounded-xl p-4">
                <div className="text-xs text-slate-500">Total Questions</div>
                <div className="text-xl font-bold text-slate-800">{analytics.totalQuestions}</div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600" asChild>
              <Link href={feedbackHref} className="flex items-center justify-center gap-3">
                <BarChart3 className="w-5 h-5" />
                View Detailed Feedback & Progress
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/workspace" className="flex items-center justify-center gap-2">
                  Schedule Another Interview
                </Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/home" className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">What&apos;s Next?</h3>
            <p className="text-gray-600 text-sm">
              Detailed analysis is ready. Open feedback to review your question-wise performance and weak areas.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewCompletePage;
