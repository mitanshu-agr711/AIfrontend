"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { GradientBackground } from "@/components/gradient-background";
import { Loader2, Award, Clock3, CircleCheckBig, CircleX, TrendingUp, ListChecks, Menu, PanelRightClose } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Logo from "@/components/lib/logo/page";
import AuthModal from "@/components/AuthModal";
import Link from "next/link";
import Image from "next/image";
// import { ArrowRight } from "lucide-react";
// import { api } from "@/lib/api";

type UserAnalyticsResponse = {
  overall: {
    totalInterviews: number;
    completedInterviews: number;
    inProgressInterviews: number;
    totalQuestions: number;
    totalAnswered: number;
    totalCorrect: number;
    totalWrong: number;
    overallScore: number;
  };
  topicStats: Array<{
    _id: string;
    totalInterviews: number;
    avgScore: number;
    totalCorrect: number;
    totalWrong: number;
  }>;
  recentInterviews: Array<{
    _id: string;
    title: string;
    topic: string;
    scorePercentage: number;
    status: string;
    createdAt: string;
  }>;
};

type InterviewDetailResponse = {
  interview: {
    id: string;
    title: string;
    description?: string;
    topic: string;
    status: string;
    startedAt?: string;
    completedAt?: string;
    createdAt?: string;
  };
  analytics: {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    unansweredQuestions: number;
    scorePercentage: number;
  };
  questionsWithAnswers: Array<{
    questionId: string;
    question: string;
    correctAnswer: string;
    userAnswer: string | null;
    isCorrect: boolean;
    explanation: string | null;
    timeTaken: number | null;
    answered: boolean;
  }>;
  weakTopics: string[];
};


const ScoreTrendGraph = ({ data }: { data: { label: string; score: number }[] }) => {
  const memoizedData = useMemo(() => data || [], [data]);

  return (
    <div className="bg-white/95 rounded-2xl border border-slate-200 shadow p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Score Trend (Recent Interviews)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={memoizedData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="label" />

          <YAxis domain={[0, 100]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const FeedbackPage = () => {


  const router = useRouter();


    const { isAuthenticated, user, hydrated } = useAuthStore();
    const [profileOpen, setProfileOpen] = useState(false);

   const handleLogout = async () => {
      await api.logout();
      setProfileOpen(false);
      setMenuOpen(false);
      router.replace("/register");
    };
  const searchParams = useSearchParams();
  const interviewIdFromQuery = searchParams.get("interviewId") || "";


  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<UserAnalyticsResponse | null>(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState("");
  const [details, setDetails] = useState<InterviewDetailResponse | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);





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
        const analyticsResult = (await api.getUserAnalytics()) as UserAnalyticsResponse;
        setAnalytics(analyticsResult);

        const candidateInterviewId = interviewIdFromQuery || analyticsResult.recentInterviews?.[0]?._id || "";
        if (candidateInterviewId) {
          setSelectedInterviewId(candidateInterviewId);
          await loadInterviewDetails(candidateInterviewId);
        }
      } catch (error) {
        console.error("Failed to load feedback data:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [hydrated, isAuthenticated, router, interviewIdFromQuery]);

  const loadInterviewDetails = async (interviewId: string) => {
    try {
      setDetailsLoading(true);
      const detailResult = (await api.getInterviewDetails(interviewId)) as InterviewDetailResponse;
      setDetails(detailResult);
      setSelectedInterviewId(interviewId);
    } catch (error) {
      console.error("Failed to load interview details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const totalDurationMins = useMemo(() => {
    if (!details) return 0;

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





  const scoreTrend = useMemo(() => {
    if (!analytics?.recentInterviews?.length) return [];

    return [...analytics.recentInterviews]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((item) => ({
        id: item._id,
        label: new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: item.scorePercentage || 0,
      }));
  }, [analytics]);

  const questionProgress = useMemo(() => {
    if (!details) return { answeredPct: 0, correctPct: 0, wrongPct: 0 };

    const total = details.analytics.totalQuestions || 1;
    return {
      answeredPct: Math.round((details.analytics.answeredQuestions / total) * 100),
      correctPct: Math.round((details.analytics.correctAnswers / total) * 100),
      wrongPct: Math.round((details.analytics.wrongAnswers / total) * 100),
    };
  }, [details]);

  const widthClassFromPercent = (pct: number) => {
    if (pct >= 100) return "w-full";
    if (pct >= 90) return "w-11/12";
    if (pct >= 80) return "w-10/12";
    if (pct >= 70) return "w-9/12";
    if (pct >= 60) return "w-8/12";
    if (pct >= 50) return "w-6/12";
    if (pct >= 40) return "w-5/12";
    if (pct >= 30) return "w-4/12";
    if (pct >= 20) return "w-3/12";
    if (pct >= 10) return "w-2/12";
    if (pct > 0) return "w-1/12";
    return "w-0";
  };

  const hasNoInterviews = (analytics?.overall?.totalInterviews || 0) === 0;

  // const heightClassFromScore = (score: number) => {
  //   if (score >= 95) return "h-28";
  //   if (score >= 85) return "h-24";
  //   if (score >= 75) return "h-20";
  //   if (score >= 65) return "h-16";
  //   if (score >= 50) return "h-12";
  //   if (score >= 35) return "h-10";
  //   if (score >= 20) return "h-8";
  //   return "h-6";
  // };

  if (!hydrated || loading) {
    return (
      <>
        <GradientBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3 bg-white/95 border border-slate-200 rounded-xl px-6 py-4 text-slate-700 shadow">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading analytics...
          </div>
        </div>
      </>
    );
  }

  if (hasNoInterviews) {
    return (
      <>
        <GradientBackground />
        <div className="min-h-screen p-6 md:p-8 mt-[6rem] flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white/95 p-10 shadow-xl text-center">
            <h1 className="text-4xl font-bold text-slate-800">Oops!</h1>
            <p className="mt-3 text-lg text-slate-600">
              You did not give any interview yet.
            </p>
            <p className="mt-1 text-slate-500">
              Go to your workspace and start your first interview to see feedback here.
            </p>
            <Link
              href="/workspace"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
            >
              Go to Workspace
            </Link>
          </div>
        </div>
      </>
    );
  }

  console.log("user",{user})
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
              <a href="/about" className="px-4 py-2 rounded-full transition-all  hover:text-white hover:bg-sky-600">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="px-4 py-2 rounded-full transition-all  hover:text-white hover:bg-sky-600">
                Contact Us
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
                    className="flex items-center gap-3 px-6 py-2 cursor-pointer"
                    title="User profile menu"
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
                    <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-lg border border-gray-300 py-2 z-50">

                      <div className="px-4 py-2 text-gray-700 font-medium border-b hover:bg-sky-600 transition-all cursor-pointer
                       hover:text-white">
                        <Link href="/feedback">{user.name}</Link>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
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
              <a href="/home" className="px-4 py-2 rounded-full transition-all  hover:text-white hover:bg-sky-600">
               Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="block px-6 py-2 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800 w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="block px-6 py-2 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800 w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                Contact Us
              </a>
            </li>
            {/* <li>
              <ature
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
                    className="flex items-center gap-3 px-6 py-2 cursor-pointer"
                    onClick={() => setProfileOpen(!profileOpen)}
                    title="avatar"
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
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
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
      <div className="min-h-screen p-6 md:p-8  mb-5 mt-[6rem]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white/95 rounded-2xl border border-slate-200 shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800">Hi !</h2>
          {user && <h1 className="text-3xl font-bold text-blue-400">{user.name}</h1>} 
         
            <h4 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-600" />
              Feedback & Analytics Dashboard
            </h4>
            <p className="text-slate-600 mt-2">Real performance insights from your completed interviews.</p>
          </div>

          {analytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/95 rounded-xl border border-slate-200 shadow p-5">
                <p className="text-xs text-slate-500">Total Interviews</p>
                <p className="text-2xl font-bold text-slate-800">{analytics.overall.totalInterviews}</p>
              </div>
              <div className="bg-white/95 rounded-xl border border-slate-200 shadow p-5">
                <p className="text-xs text-slate-500">Overall Score</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.overall.overallScore}%</p>
              </div>
              <div className="bg-white/95 rounded-xl border border-slate-200 shadow p-5">
                <p className="text-xs text-slate-500">Correct Answers</p>
                <p className="text-2xl font-bold text-emerald-600">{analytics.overall.totalCorrect}</p>
              </div>
              <div className="bg-white/95 rounded-xl border border-slate-200 shadow p-5">
                <p className="text-xs text-slate-500">Wrong Answers</p>
                <p className="text-2xl font-bold text-rose-600">{analytics.overall.totalWrong}</p>
              </div>
            </div>
          )}

        {!!scoreTrend.length && (
   <ScoreTrendGraph data={scoreTrend} />
)}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white/95 rounded-2xl border border-slate-200 shadow p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-blue-600" />
                Recent Interviews
              </h2>
              <div className="space-y-3 max-h-105 overflow-y-auto pr-1">
                {(analytics?.recentInterviews || []).map((item) => (
                  <button
                    key={item._id}
                    onClick={() => loadInterviewDetails(item._id)}
                    className={`w-full text-left p-4 rounded-xl border transition ${
                      selectedInterviewId === item._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.topic}</p>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span className="font-semibold text-blue-700">{item.scorePercentage ?? 0}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white/95 rounded-2xl border border-slate-200 shadow p-6">
              {detailsLoading ? (
                <div className="h-72 flex items-center justify-center text-slate-600 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading interview details...
                </div>
              ) : details ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{details.interview.title}</h2>
                    <p className="text-slate-600 mt-1">{details.interview.topic} • {details.interview.status}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-slate-500">Score</p>
                      <p className="text-lg font-bold text-blue-600">{details.analytics.scorePercentage}%</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-slate-500">Correct</p>
                      <p className="text-lg font-bold text-emerald-600 flex items-center gap-1"><CircleCheckBig className="w-4 h-4" />{details.analytics.correctAnswers}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-slate-500">Wrong</p>
                      <p className="text-lg font-bold text-rose-600 flex items-center gap-1"><CircleX className="w-4 h-4" />{details.analytics.wrongAnswers}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-slate-500">Answered</p>
                      <p className="text-lg font-bold text-slate-800">{details.analytics.answeredQuestions}/{details.analytics.totalQuestions}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-slate-500">Time</p>
                      <p className="text-lg font-bold text-slate-800 flex items-center gap-1"><Clock3 className="w-4 h-4" />{totalDurationMins}m</p>
                    </div>
                  </div>

                  <div className="rounded-xl border p-4 bg-slate-50/80">
                    <h3 className="font-semibold text-slate-800 mb-3">Per-Question Progress</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>Answered</span>
                          <span>{questionProgress.answeredPct}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full bg-blue-500 ${widthClassFromPercent(questionProgress.answeredPct)}`} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>Correct</span>
                          <span>{questionProgress.correctPct}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full bg-emerald-500 ${widthClassFromPercent(questionProgress.correctPct)}`} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>Wrong</span>
                          <span>{questionProgress.wrongPct}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full bg-rose-500 ${widthClassFromPercent(questionProgress.wrongPct)}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Question-wise Feedback</h3>
                    <div className="space-y-3 max-h-90 overflow-y-auto pr-1">
                      {details.questionsWithAnswers.map((q, idx) => (
                        <div key={q.questionId} className="border rounded-xl p-4 bg-white">
                          <p className="font-medium text-slate-800">Q{idx + 1}. {q.question}</p>
                          <p className="text-sm mt-2 text-slate-600"><span className="font-semibold">Your Answer:</span> {q.userAnswer || "Not answered"}</p>
                          <p className="text-sm mt-1 text-slate-600"><span className="font-semibold">Correct Answer:</span> {q.correctAnswer}</p>
                          {q.explanation && <p className="text-sm mt-1 text-slate-600"><span className="font-semibold">Explanation:</span> {q.explanation}</p>}
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <span className={q.isCorrect ? "text-emerald-700 font-semibold" : "text-rose-700 font-semibold"}>
                              {q.isCorrect ? "Correct" : "Wrong"}
                            </span>
                            <span className="text-slate-500">{q.timeTaken ? `${q.timeTaken}s` : "-"}</span>
                          </div>
                          <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full ${q.answered ? "w-full" : "w-4/12"} ${q.answered ? (q.isCorrect ? "bg-emerald-500" : "bg-rose-500") : "bg-slate-400"}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border p-4 bg-blue-50/60">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Weak Topics
                    </h3>
                    {details.weakTopics.length > 0 ? (
                      <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                        {details.weakTopics.map((item, idx) => (
                          <li key={`${item}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-600">No weak topics detected for this interview.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-slate-500">Select an interview to view details.</div>
              )}
            </div>
          </div>

          {!!analytics?.topicStats?.length && (
            <div className="bg-white/95 rounded-2xl border border-slate-200 shadow p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Topic Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b">
                      <th className="py-2">Topic</th>
                      <th className="py-2">Interviews</th>
                      <th className="py-2">Avg Score</th>
                      <th className="py-2">Correct</th>
                      <th className="py-2">Wrong</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topicStats.map((row) => (
                      <tr key={row._id} className="border-b last:border-b-0">
                        <td className="py-2 font-medium text-slate-800">{row._id}</td>
                        <td className="py-2">{row.totalInterviews}</td>
                        <td className="py-2">{Math.round(row.avgScore || 0)}%</td>
                        <td className="py-2 text-emerald-700">{row.totalCorrect}</td>
                        <td className="py-2 text-rose-700">{row.totalWrong}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FeedbackPage;
