"use client";
import dynamic from "next/dynamic";
import "chart.js/auto";
import Slider from "@/components/slider/page";
import { interviewPerformanceData, monthlyProgressData, skillBreakdownData } from "@/Api/points";
import { useState } from "react";
import { Calendar, Clock, Award, TrendingUp, Edit, Save, X } from "lucide-react";

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

const Radar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Radar), {
  ssr: false,
});

const FeedbackPage = () => {
  const [selectedInterview, setSelectedInterview] = useState(interviewPerformanceData[0]);
  const [editMode, setEditMode] = useState(false);
  const [editedFeedback, setEditedFeedback] = useState(selectedInterview.feedback);

  // Chart options for better styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Bar chart data for individual interview scores
  const individualScoreData = {
    labels: ["Technical", "Communication", "Problem Solving", "Coding"],
    datasets: [
      {
        label: "Score",
        data: [
          selectedInterview.technicalScore,
          selectedInterview.communicationScore,
          selectedInterview.problemSolvingScore,
          selectedInterview.codingScore,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleEditFeedback = () => {
    setEditMode(true);
    setEditedFeedback(selectedInterview.feedback);
  };

  const handleSaveFeedback = () => {
    // In a real application, you would update the data in your backend
    selectedInterview.feedback = editedFeedback;
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedFeedback(selectedInterview.feedback);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      {/* Sidebar */}
      <div className="w-[20%] m-4">
        <Slider />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-500" />
            Interview Performance Dashboard
          </h1>
          <p className="text-gray-600">Track your progress and improve your interview skills</p>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{interviewPerformanceData.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(interviewPerformanceData.reduce((acc, curr) => acc + curr.overallScore, 0) / interviewPerformanceData.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(...interviewPerformanceData.map(i => i.overallScore))}%
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interviewPerformanceData.reduce((acc, curr) => acc + curr.interviewDuration, 0)}m
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Over Time Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Progress Over Time</h2>
            <div className="h-80">
              <Line data={monthlyProgressData} options={chartOptions} />
            </div>
          </div>

          {/* Skill Breakdown Radar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Skill Breakdown</h2>
            <div className="h-80">
              <Radar data={skillBreakdownData} options={radarOptions} />
            </div>
          </div>
        </div>

        {/* Interview Selection and Individual Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interview Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Interview History</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {interviewPerformanceData.map((interview) => (
                <div
                  key={interview.id}
                  onClick={() => setSelectedInterview(interview)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedInterview.id === interview.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{interview.companyName}</h3>
                      <p className="text-sm text-gray-600">{interview.position}</p>
                      <p className="text-xs text-gray-500">{interview.interviewDate}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      interview.overallScore >= 90 ? "bg-green-100 text-green-800" :
                      interview.overallScore >= 80 ? "bg-yellow-100 text-yellow-800" :
                      interview.overallScore >= 70 ? "bg-orange-100 text-orange-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {interview.overallScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Interview Scores */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {selectedInterview.companyName} - Individual Scores
            </h2>
            <div className="h-80">
              <Bar data={individualScoreData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Detailed Interview Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Interview Details & Feedback</h2>
            {!editMode && (
              <button
                onClick={handleEditFeedback}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Feedback
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Company & Position</h3>
                <p className="text-gray-600">{selectedInterview.companyName} - {selectedInterview.position}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Interview Metrics</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{selectedInterview.interviewDuration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Questions</p>
                    <p className="font-medium">{selectedInterview.questionsAnswered}/{selectedInterview.questionsAsked} answered</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-medium">{selectedInterview.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{selectedInterview.interviewDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700">Feedback</h3>
                {editMode && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveFeedback}
                      className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              {editMode ? (
                <textarea
                  value={editedFeedback}
                  onChange={(e) => setEditedFeedback(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter your feedback..."
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedInterview.feedback}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
