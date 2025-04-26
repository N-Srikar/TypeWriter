import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface TestResult {
  wpm: number;
  accuracy: number;
  testType: 'time' | 'words';
  testOption: number;
  duration?: number;
  wordCount?: number;
}

export const saveTestResult = async (result: TestResult, token: string) => {
  await axios.post(`${API_URL}/test-results`, result, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getStats = async (token: string) => {
  const response = await axios.get(`${API_URL}/test-results/stats`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};