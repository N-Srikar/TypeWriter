"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Timer, Type } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/authContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TestResults from "@/components/test-results";
import { generateWords } from "@/lib/words";

type TestModeType = "time" | "words";
type TimeOption = 15 | 30 | 60 | 120;
type WordsOption = 50 | 100 | 150;

interface TestOptions {
  punctuation: boolean;
  numbers: boolean;
}

interface ResultPayload {
  wpm: number;
  accuracy: number;
  testType: TestModeType;
  testOption: number;
  duration?: number;
  wordCount?: number;
}

export default function TypingTest() {
  const router = useRouter();
  const { user } = useAuth();

  // ——— Configuration ———
  const [testMode, setTestMode] = useState<TestModeType>("time");
  const [timeOption, setTimeOption] = useState<TimeOption>(60);
  const [wordsOption, setWordsOption] = useState<WordsOption>(50);
  const [options, setOptions] = useState<TestOptions>({
    punctuation: false,
    numbers: false,
  });

  // ——— Core state ———
  const [text, setText] = useState<string>("");
  const [input, setInput] = useState<string>("");              // current word being typed
  const [typedHistory, setTypedHistory] = useState<string[]>([]); // all completed words
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [testActive, setTestActive] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // ——— Submission state ———
  const [results, setResults] = useState<ResultPayload | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // ——— Refs for fresh closures ———
  const typedHistoryRef = useRef<string[]>(typedHistory);
  const inputRefState = useRef<string>(input);
  useEffect(() => { typedHistoryRef.current = typedHistory }, [typedHistory]);
  useEffect(() => { inputRefState.current = input }, [input]);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ——— Generate new test ———
  const resetTest = useCallback(() => {
    const count = testMode === "words" ? wordsOption : 300;
    const wordsArr = generateWords(count, options.punctuation, options.numbers);
    setText(wordsArr.join(" "));
    setInput("");
    setTypedHistory([]);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setTestActive(false);
    setTestComplete(false);
    setStartTime(null);
    setTimeLeft(testMode === "time" ? timeOption : null);
    setResults(null);
    setHasSubmitted(false);
    inputRef.current?.focus();
  }, [testMode, wordsOption, timeOption, options]);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // ——— Start the test ———
  const startTest = useCallback(() => {
    setTestActive(true);
    setStartTime(Date.now());
    if (testMode === "time") setTimeLeft(timeOption);
  }, [testMode, timeOption]);

  // ——— Compute WPM & accuracy from a given history ———
  const calculateResults = (history: string[]): { wpm: number; accuracy: number } => {
    if (!startTime || history.length === 0) {
      return { wpm: 0, accuracy: 100 };
    }
    const originalWords = text.split(" ");
    let correctChars = 0;
    let totalChars = 0;

    // completed words
    history.forEach((word, i) => {
      const original = originalWords[i] || "";
      const maxLen = Math.min(word.length, original.length);
      for (let j = 0; j < maxLen; j++) {
        if (word[j] === original[j]) correctChars++;
      }
      totalChars += word.length;
    });

    // time in minutes
    const minutes = (Date.now() - startTime) / 60000;
    const wpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    return { wpm, accuracy };
  };

  // ——— Finish test and queue results ———
  const finishTest = useCallback(() => {
    if (results) return;      // already computed
    setTestActive(false);
    setTestComplete(true);

    // build the complete history including the last word
    const finalHistory = [
      ...typedHistoryRef.current,
      inputRefState.current.trim(),
    ];
    const { wpm, accuracy } = calculateResults(finalHistory);

    setResults({
      wpm,
      accuracy,
      testType: testMode,
      testOption: testMode === "time" ? timeOption : wordsOption,
      duration: testMode === "time" ? timeOption : undefined,
      wordCount: testMode === "words" ? wordsOption : undefined,
    });
  }, [testMode, timeOption, wordsOption, startTime, text, results]);

  // ——— Timer effect ———
  useEffect(() => {
    if (testActive && testMode === "time" && timeLeft !== null) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t === null || t <= 1) {
            clearInterval(timerRef.current!);
            finishTest();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testActive, testMode, timeLeft, finishTest]);

  // ——— Submit results exactly once ———
  useEffect(() => {
    if (testComplete && results && !hasSubmitted && user) {
      setHasSubmitted(true);
      api
        .post("/test-results", {
          user: user.id,
          ...results,
        })
        .catch((e) => console.error("Error submitting test result:", e));
    }
  }, [testComplete, results, hasSubmitted, user]);

  // ——— Handle typing input ———
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!testActive && !testComplete && val.length > 0) startTest();

    if (val.endsWith(" ")) {
      setTypedHistory((h) => [...h, val.trim()]);
      setCurrentWordIndex((i) => i + 1);
      setCurrentCharIndex(0);
      setInput("");
      if (testMode === "words" && typedHistory.length + 1 >= wordsOption) {
        finishTest();
      }
    } else {
      setInput(val);
      setCurrentCharIndex(val.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      resetTest();
    }
  };

  // ——— Visible words window ———
  const wordsArr = text.split(" ");
  const getVisibleWords = () => {
    const start = Math.max(0, currentWordIndex - 5);
    const end = Math.min(wordsArr.length, currentWordIndex + 30);
    return wordsArr.slice(start, end);
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6 p-4 md:p-8">
      {/* Options Bar */}
      <div className="flex w-full flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-700 bg-[#2c2c2c] p-3">
        <div className="flex items-center gap-2">
          <Select value={testMode} onValueChange={(v) => setTestMode(v as TestModeType)}>
            <SelectTrigger className="h-8 w-[120px] border-gray-700 bg-[#232323] text-sm text-gray-300">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-[#2c2c2c] text-white">
              <SelectItem value="time">
                <div className="flex items-center gap-1">
                  <Timer className="h-3.5 w-3.5" />
                  Time
                </div>
              </SelectItem>
              <SelectItem value="words">
                <div className="flex items-center gap-1">
                  <Type className="h-3.5 w-3.5" />
                  Words
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {testMode === "time" ? (
            <Select value={timeOption.toString()} onValueChange={(v) => setTimeOption(parseInt(v) as TimeOption)}>
              <SelectTrigger className="h-8 w-[80px] border-gray-700 bg-[#232323] text-sm text-gray-300">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-[#2c2c2c] text-white">
                {[15, 30, 60, 120].map((s) => (
                  <SelectItem key={s} value={s.toString()}>
                    {s}s
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select value={wordsOption.toString()} onValueChange={(v) => setWordsOption(parseInt(v) as WordsOption)}>
              <SelectTrigger className="h-8 w-[80px] border-gray-700 bg-[#232323] text-sm text-gray-300">
                <SelectValue placeholder="Words" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-[#2c2c2c] text-white">
                {[50, 100, 150].map((w) => (
                  <SelectItem key={w} value={w.toString()}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={options.punctuation ? "default" : "outline"}
            size="sm"
            onClick={() => setOptions((o) => ({ ...o, punctuation: !o.punctuation }))}
            className={cn(
              "h-8 text-xs transition-all border",
              options.punctuation
                ? "bg-yellow-500 text-yellow-950 border-yellow-500"
                : "bg-[#232323] border-gray-700 text-gray-300"
            )}
          >
            Punctuation
          </Button>

          <Button
            variant={options.numbers ? "default" : "outline"}
            size="sm"
            onClick={() => setOptions((o) => ({ ...o, numbers: !o.numbers }))}
            className={cn(
              "h-8 text-xs transition-all border",
              options.numbers
                ? "bg-yellow-500 text-yellow-950 border-yellow-500"
                : "bg-[#232323] border-gray-700 text-gray-300"
            )}
          >
            Numbers
          </Button>

          <Button variant="outline" size="sm" onClick={resetTest} className="h-8 text-xs border-gray-600 bg-[#232323] text-gray-300">
            Reset
          </Button>
        </div>
      </div>

      {/* Test area */}
      <div className="relative w-full">
        {testComplete ? (
          <TestResults
            wpm={results?.wpm ?? 0}
            accuracy={results?.accuracy ?? 100}
            testDuration={testMode === "time" ? timeOption : null}
            wordCount={testMode === "words" ? wordsOption : typedHistoryRef.current.length}
            testMode={testMode}
            timeOption={timeOption}
            wordsOption={wordsOption}
          />
        ) : (
          <>
            <div
              className="relative mb-8 min-h-[300px] w-full cursor-default rounded-lg border border-gray-700 bg-[#2c2c2c] p-6 pt-10 text-xl leading-relaxed tracking-wide"
              onClick={() => inputRef.current?.focus()}
            >
              {testActive && timeLeft !== null && testMode === "time" && (
                <div className="absolute right-4 top-4 text-sm font-medium text-yellow-500">
                  {timeLeft}s
                </div>
              )}

              <div className="flex flex-wrap gap-x-2 gap-y-2 text-gray-500">
                {getVisibleWords().map((word, idx) => {
                  const absIdx = idx + Math.max(0, currentWordIndex - 5);
                  const isCurrent = absIdx === currentWordIndex;
                  return (
                    <div key={absIdx} className={cn("relative", isCurrent && "text-gray-300")}>
                      {word.split("").map((ch, cIdx) => {
                        const isChar = isCurrent && cIdx === currentCharIndex;
                        const wasTyped = isCurrent && cIdx < currentCharIndex;
                        const correct = wasTyped && input[cIdx] === ch;
                        const incorrect = wasTyped && input[cIdx] !== ch;
                        return (
                          <span
                            key={cIdx}
                            className={cn(
                              isChar &&
                                "relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:animate-pulse after:bg-yellow-500",
                              correct && "text-green-400",
                              incorrect && "text-red-400 bg-red-900/30"
                            )}
                          >
                            {ch}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              className="absolute left-0 top-0 h-full w-full opacity-0"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </>
        )}
      </div>
    </div>
  );
}
