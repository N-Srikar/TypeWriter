"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/authContext";
import { getStats } from "@/lib/testResults";
import Header from "@/components/header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BarChart3, Clock, Keyboard, User, Trophy } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Interface for user stats data structure
interface Stats {
  testsCompleted: number;
  averageWpm: number;
  averageAccuracy: number;
  bestWpm: number;
  history: Array<{
    wpm: number;
    accuracy: number;
    testType: "time" | "words";
    testOption: number;
    date: string;
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  // State to hold user stats
  const [stats, setStats] = useState<Stats>({
    testsCompleted: 0,
    averageWpm: 0,
    averageAccuracy: 0,
    bestWpm: 0,
    history: [],
  });

  // States for selecting mode and options
  const [selectedMode, setSelectedMode] = useState<"time" | "words">("time");
  const [selectedTimeOption, setSelectedTimeOption] = useState("15");
  const [selectedWordsOption, setSelectedWordsOption] = useState("50");

  // Redirect to home page if user is not logged in
  useEffect(() => {
    if (user === null) {
      router.replace("/");
    }
  }, [user, router]);

  // Fetch stats whenever user or selection changes
  useEffect(() => {
    if (!user) return;
    const currentOption = selectedMode === "time" 
      ? parseInt(selectedTimeOption, 10)
      : parseInt(selectedWordsOption, 10);

    getStats(selectedMode, currentOption)
      .then((data) => setStats(data))
      .catch(console.error);
  }, [user, selectedMode, selectedTimeOption, selectedWordsOption]);

  // Return nothing while waiting for auth to load
  if (user === undefined) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <div className="container mx-auto flex flex-1 flex-col p-4 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          {/* Profile picture and username */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-2xl font-bold text-yellow-950">
              <User className="h-8 w-8 text-yellow-950" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.username || "User"}</h1>
            </div>
          </div>

          {/* Button to start a new typing test */}
          <Button
            onClick={() => router.push("/test")}
            className="flex items-center gap-2 bg-yellow-500 text-yellow-950 hover:bg-yellow-600"
          >
            <Keyboard className="h-4 w-4" />
            Start Typing
          </Button>
        </div>

        {/* Render user stats and selection controls */}
        <ProfileStats
          stats={stats}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          selectedTimeOption={selectedTimeOption}
          setSelectedTimeOption={setSelectedTimeOption}
          selectedWordsOption={selectedWordsOption}
          setSelectedWordsOption={setSelectedWordsOption}
        />
      </div>
    </main>
  );
}

// Component to display profile statistics
function ProfileStats({
  stats,
  selectedMode,
  setSelectedMode,
  selectedTimeOption,
  setSelectedTimeOption,
  selectedWordsOption,
  setSelectedWordsOption,
}: {
  stats: Stats;
  selectedMode: "time" | "words";
  setSelectedMode: React.Dispatch<React.SetStateAction<"time" | "words">>;
  selectedTimeOption: string;
  setSelectedTimeOption: React.Dispatch<React.SetStateAction<string>>;
  selectedWordsOption: string;
  setSelectedWordsOption: React.Dispatch<React.SetStateAction<string>>;
}) {
  const timeOptions = ["15", "30", "60", "120"];
  const wordsOptions = ["50", "100", "150"];

  return (
    <div className="space-y-8">
      {/* Mode and Option selectors */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-white">Mode:</span>
          <Select
            value={selectedMode}
            onValueChange={(v) => setSelectedMode(v as "time" | "words")}
          >
            <SelectTrigger className="w-[180px] border-gray-700 bg-[#2c2c2c] text-white">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-[#2c2c2c] text-white">
              <SelectItem value="time">Time Mode</SelectItem>
              <SelectItem value="words">Word Count</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Option selector based on mode */}
        <div className="flex items-center gap-2">
          <span className="text-white">Option:</span>
          {selectedMode === "time" ? (
            <Select
              value={selectedTimeOption}
              onValueChange={setSelectedTimeOption}
            >
              <SelectTrigger className="w-[180px] border-gray-700 bg-[#2c2c2c] text-white">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-[#2c2c2c] text-white">
                {timeOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}s
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select
              value={selectedWordsOption}
              onValueChange={setSelectedWordsOption}
            >
              <SelectTrigger className="w-[180px] border-gray-700 bg-[#2c2c2c] text-white">
                <SelectValue placeholder="Select words" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-[#2c2c2c] text-white">
                {wordsOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt} words
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Cards showing stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-[#2c2c2c] border-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/80">
              Average Speed
            </CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <BarChart3 className="h-5 w-5 text-yellow-500" />
              {stats.averageWpm} WPM
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-[#2c2c2c] border-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/80">
              Best Speed
            </CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {stats.bestWpm} WPM
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-[#2c2c2c] border-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/80">
              Tests Completed
            </CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <Clock className="h-5 w-5 text-yellow-500" />
              {stats.testsCompleted}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Table showing test history */}
      <Card className="bg-[#2c2c2c] border-none">
        <CardHeader>
          <CardTitle className="text-white">
            {selectedMode === "time"
              ? `${selectedTimeOption}s Mode`
              : `${selectedWordsOption} Words Mode`}
          </CardTitle>
          <CardDescription className="text-white/80">
            Your last 10 test results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-md border border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-left text-sm">
                  <th className="p-3 text-white">Date</th>
                  <th className="p-3 text-white">WPM</th>
                  <th className="p-3 text-white">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {stats.history.length > 0 ? (
                  stats.history.map((r, i) => (
                    <tr key={i} className="border-b border-gray-700 text-sm">
                      <td className="p-3 text-white">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-medium text-white">{r.wpm}</td>
                      <td className="p-3 text-white">{r.accuracy}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-3 text-center text-white/70">
                      No tests found for this option.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
