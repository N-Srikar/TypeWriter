import api from './api';

export interface TestResult {
  wpm: number;
  accuracy: number;
  testType: 'time' | 'words';
  testOption: number;
  duration?: number;
  wordCount?: number;
}

export interface Stats {
  testsCompleted: number;
  averageWpm: number;
  averageAccuracy: number;
  bestWpm: number;
  history: Array<{
    wpm: number;
    accuracy: number;
    testType: string;
    testOption: number;
    date: string;
  }>;
}

export const saveTestResult = async (result: TestResult) => {
  await api.post('/test-results', result);
};

export const getStats = async (mode: 'time' | 'words', option: number) => {
  try {
    const response = await api.get(`/test-results/stats?testType=${mode}&testOption=${option}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      testsCompleted: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      bestWpm: 0,
      history: []
    };
  }
};