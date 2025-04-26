"use client";

import { BarChart3, Clock, Type } from "lucide-react";

interface TestResultsProps {
  wpm: number; // Words per minute
  accuracy: number; // Typing accuracy percentage
  testDuration: number | null; // Duration of the test in seconds, if applicable
  wordCount: number; // Total words in the test
  testMode: "time" | "words"; // Mode of the test, whether time-based or word-based
  timeOption: 15 | 30 | 60 | 120; // Time options (in seconds) for time-based tests
  wordsOption: 50 | 100 | 150; // Word options for word-based tests
}

export default function TestResults({
  wpm,
  accuracy,
  testDuration,
  wordCount
}: TestResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* WPM Results */}
        <div className="flex flex-col items-center rounded-lg border border-gray-700 bg-[#2c2c2c] p-6">
          <BarChart3 className="mb-2 h-6 w-6 text-yellow-500" />
          <span className="text-3xl font-bold">{wpm}</span>
          <span className="text-sm text-gray-400">WPM</span>
        </div>

        {/* Time Taken or Duration */}
        <div className="flex flex-col items-center rounded-lg border border-gray-700 bg-[#2c2c2c] p-6">
          <Clock className="mb-2 h-6 w-6 text-yellow-500" />
          <span className="text-3xl font-bold">
            {/* If testDuration is provided, use it; otherwise, calculate time taken */}
            {testDuration ? `${testDuration}s` : `${Math.round((wordCount / wpm) * 60)}s`}
          </span>
          <span className="text-sm text-gray-400">{testDuration ? "duration" : "time taken"}</span>
        </div>

        {/* Accuracy Results */}
        <div className="flex flex-col items-center rounded-lg border border-gray-700 bg-[#2c2c2c] p-6">
          <Type className="mb-2 h-6 w-6 text-yellow-500" />
          <span className="text-3xl font-bold">{accuracy}%</span>
          <span className="text-sm text-gray-400">accuracy</span>
        </div>
      </div>
    </div>
  );
}
