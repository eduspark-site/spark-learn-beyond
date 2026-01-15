import { useProgressTracking } from "@/hooks/useProgressTracking";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";

const TOTAL_VIDEOS = 12; // Total number of videos in the course

const ProgressOverview = () => {
  const { getOverallProgress, getCompletedCount, getAllProgress } = useProgressTracking();
  
  const overallProgress = getOverallProgress();
  const completedCount = getCompletedCount();
  const allProgress = getAllProgress();
  const watchedCount = Object.keys(allProgress).length;

  return (
    <div className="glass-card p-4 rounded-xl space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">Your Progress</h3>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Course Completion</span>
          <span className="text-foreground font-medium">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <div>
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-lg font-semibold text-foreground">{completedCount}/{TOTAL_VIDEOS}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
          <Clock className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Started</p>
            <p className="text-lg font-semibold text-foreground">{watchedCount}</p>
          </div>
        </div>
      </div>

      {watchedCount === 0 && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          Start watching to track your progress!
        </p>
      )}
    </div>
  );
};

export default ProgressOverview;
