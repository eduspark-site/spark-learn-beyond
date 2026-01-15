import { useState, useEffect, useCallback } from "react";

interface VideoProgress {
  videoId: string;
  progress: number; // 0-100
  currentTime: number;
  duration: number;
  completed: boolean;
  lastWatched: string;
}

interface ProgressData {
  [videoId: string]: VideoProgress;
}

const STORAGE_KEY = "eduspark_progress";

export const useProgressTracking = () => {
  const [progressData, setProgressData] = useState<ProgressData>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProgressData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse progress data");
      }
    }
  }, []);

  const saveProgress = useCallback((videoId: string, currentTime: number, duration: number) => {
    if (duration <= 0) return;

    const progress = Math.min((currentTime / duration) * 100, 100);
    const completed = progress >= 90;

    setProgressData((prev) => {
      const newData = {
        ...prev,
        [videoId]: {
          videoId,
          progress,
          currentTime,
          duration,
          completed,
          lastWatched: new Date().toISOString(),
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const getProgress = useCallback((videoId: string): VideoProgress | null => {
    return progressData[videoId] || null;
  }, [progressData]);

  const getAllProgress = useCallback((): ProgressData => {
    return progressData;
  }, [progressData]);

  const getOverallProgress = useCallback((): number => {
    const videos = Object.values(progressData);
    if (videos.length === 0) return 0;
    const totalProgress = videos.reduce((acc, v) => acc + v.progress, 0);
    return totalProgress / videos.length;
  }, [progressData]);

  const getCompletedCount = useCallback((): number => {
    return Object.values(progressData).filter((v) => v.completed).length;
  }, [progressData]);

  return {
    saveProgress,
    getProgress,
    getAllProgress,
    getOverallProgress,
    getCompletedCount,
  };
};
