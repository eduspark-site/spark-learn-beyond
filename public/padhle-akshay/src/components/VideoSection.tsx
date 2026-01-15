import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, BookOpen, Calculator, Trophy, Play, CheckCircle2, Key, Clock } from "lucide-react";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { useKeyGeneration } from "@/hooks/useKeyGeneration";
import KeyGenerationPopup from "./KeyGenerationPopup";

interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
}

interface SubjectCategory {
  id: string;
  name: string;
  icon: typeof Flame;
  color: string;
  subjects: VideoItem[];
}

const categories: SubjectCategory[] = [
  {
    id: "welcome",
    name: "",
    icon: Trophy,
    color: "primary",
    subjects: [
      { id: "welcome", title: "WELCOME TO A.I X AKSHAY", youtubeId: "HfcNLVqykRU" }
    ]
  },
  {
    id: "science",
    name: "Science",
    icon: Flame,
    color: "science",
    subjects: [
      { id: "physics", title: "Physics", youtubeId: "qO8ZU984P1I" },
      { id: "chemistry", title: "Chemistry", youtubeId: "I9WDaKEo7E0" },
      { id: "biology", title: "Biology", youtubeId: "UA6dLo9NOJA" },
    ]
  },
  {
    id: "social",
    name: "Social Science",
    icon: BookOpen,
    color: "social",
    subjects: [
      { id: "history", title: "History", youtubeId: "B2QJmGa33TE" },
      { id: "civics", title: "Civics", youtubeId: "3JEHDKjyu_E" },
      { id: "economics", title: "Economics", youtubeId: "Pdbq3NahvVw" },
      { id: "geography", title: "Geography", youtubeId: "LN-SyGCG954" },
    ]
  },
  {
    id: "maths",
    name: "Maths",
    icon: Calculator,
    color: "maths",
    subjects: [
      { id: "math-part1", title: "Part 1", youtubeId: "mwXM0PThklg" },
      { id: "math-part2", title: "Part 2", youtubeId: "0B9PDksbIHA" },
      { id: "math-part3", title: "Part 3", youtubeId: "ODWs83eMsRU" },
    ]
  },
  {
    id: "finale",
    name: "",
    icon: Trophy,
    color: "finale",
    subjects: [
      { id: "finale", title: "The Finale", youtubeId: "HfcNLVqykRU" }
    ]
  },
];

const VideoSection = () => {
  const navigate = useNavigate();
  const { getProgress } = useProgressTracking();
  const { hasValidKey, timeRemaining } = useKeyGeneration();
  const [showKeyPopup, setShowKeyPopup] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<VideoItem | null>(null);

  const handleVideoClick = (subject: VideoItem) => {
    if (hasValidKey) {
      // Key is valid, navigate directly
      navigate(`/video/${subject.youtubeId}`, { state: { title: subject.title } });
    } else {
      // Show key generation popup
      setSelectedSubject(subject);
      setShowKeyPopup(true);
    }
  };

  const handleKeyActivated = () => {
    setShowKeyPopup(false);
    if (selectedSubject) {
      navigate(`/video/${selectedSubject.youtubeId}`, { state: { title: selectedSubject.title } });
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      primary: { bg: "bg-primary", text: "text-primary", icon: "bg-primary/20" },
      science: { bg: "bg-science", text: "text-science", icon: "bg-science/20" },
      social: { bg: "bg-social", text: "text-social", icon: "bg-social/20" },
      maths: { bg: "bg-maths", text: "text-maths", icon: "bg-maths/20" },
      finale: { bg: "bg-finale", text: "text-warning", icon: "bg-warning/20" },
    };
    return colors[color] || colors.primary;
  };

  return (
    <>
      {/* Key Status Banner */}
      {hasValidKey && (
        <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/20 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Ad-Free Access Active</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{timeRemaining}</span>
          </div>
        </div>
      )}

      <div className="space-y-6 animate-fade-in">
        {categories.map((category, catIndex) => {
          const colorClasses = getColorClasses(category.color);
          const isSpecial = category.id === "welcome" || category.id === "finale";

          return (
            <div key={category.id} className="animate-slide-up" style={{ animationDelay: `${catIndex * 0.1}s` }}>
              {/* Category Header */}
              {category.name && (
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg ${colorClasses.icon} flex items-center justify-center`}>
                    <category.icon className={`w-5 h-5 ${colorClasses.text}`} />
                  </div>
                  <h3 className={`font-heading font-semibold text-lg ${colorClasses.text}`}>
                    {category.name}
                  </h3>
                </div>
              )}

              {/* Subjects */}
              <div className="space-y-2">
                {category.subjects.map((subject, index) => {
                  const progress = getProgress(subject.youtubeId);
                  const isCompleted = progress?.completed;
                  const progressPercent = progress?.progress || 0;

                  return (
                    <button
                      key={subject.id}
                      onClick={() => handleVideoClick(subject)}
                      className={`w-full p-4 rounded-xl flex items-center justify-between transition-all duration-300 hover-lift ${
                        isSpecial 
                          ? `${colorClasses.bg} text-primary-foreground` 
                          : "glass-card hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-lg ${isSpecial ? "bg-white/20" : "bg-secondary"} flex items-center justify-center flex-shrink-0`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          ) : isSpecial ? (
                            <Trophy className="w-5 h-5" />
                          ) : (
                            <Play className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <span className={`font-medium block truncate ${isSpecial ? "" : "text-foreground"}`}>
                            {subject.title}
                          </span>
                          {progressPercent > 0 && !isCompleted && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1 bg-secondary/50 rounded-full max-w-[100px]">
                                <div 
                                  className="h-full bg-primary rounded-full" 
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground">{Math.round(progressPercent)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!hasValidKey && (
                          <Key className="w-4 h-4 text-muted-foreground" />
                        )}
                        <div className={`w-9 h-9 rounded-full ${isSpecial ? "bg-white/20" : "bg-secondary"} flex items-center justify-center flex-shrink-0`}>
                          <Play className={`w-4 h-4 ${isSpecial ? "" : "text-muted-foreground"}`} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Generation Popup */}
      <KeyGenerationPopup
        isOpen={showKeyPopup}
        onClose={() => setShowKeyPopup(false)}
        onKeyActivated={handleKeyActivated}
        subjectTitle={selectedSubject?.title}
      />
    </>
  );
};

export default VideoSection;
