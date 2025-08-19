"use client";

import Link from "next/link";
import { CheckCircle, BarChart3, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/button";
import { GradientBackground } from "@/components/gradient-background";

const InterviewCompletePage = () => {
  return (
    <>
      <GradientBackground />
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center border">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Interview Completed Successfully!
            </h1>
            <p className="text-xl text-gray-600">
              Great job! Your interview has been completed and processed by our AI system.
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">45 min</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">8/10</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-sm text-gray-600">Performance Score</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600" asChild>
              <Link href="/feedback" className="flex items-center justify-center gap-3">
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

          {/* Additional Info */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">What&apos;s Next?</h3>
            <p className="text-gray-600 text-sm">
              Your interview performance has been analyzed and feedback is ready. 
              Check your detailed feedback to see areas of improvement and track your progress over time.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewCompletePage;
