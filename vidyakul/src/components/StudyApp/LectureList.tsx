import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Video, Clock, CheckCircle } from 'lucide-react';
import { Batch, Subject, Lecture } from './types';
import { fetchLectures } from './api';
import SearchBar from './SearchBar';
import SkeletonLoader from './SkeletonLoader';
import ErrorState from './ErrorState';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import KeyGenerationModal from '@/components/KeyGenerationModal';
import LoginModal from '@/components/LoginModal';

interface LectureListProps {
  batch: Batch;
  subject: Subject;
  onBack: () => void;
}

const LectureList = ({ batch, subject, onBack }: LectureListProps) => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingLecture, setPendingLecture] = useState<Lecture | null>(null);
  
  const { user, getLectureProgress, checkKeyValidity, appSettings, userKeyInfo } = useAuth();

  const loadLectures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLectures(batch._id, subject._id);
      setLectures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lectures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectures();
  }, [batch._id, subject._id]);

  // Check for key token in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const keyToken = urlParams.get('key_token');
    
    if (keyToken && user) {
      setShowKeyModal(true);
    }
  }, [user]);

  const getLectureTitle = (lecture: Lecture) => lecture.title || lecture.name || 'Untitled Lecture';
  const getSubjectName = () => subject.title || subject.subjectName || subject.name || 'Subject';

  const filteredLectures = lectures.filter((lecture) =>
    getLectureTitle(lecture).toLowerCase().includes(search.toLowerCase())
  );

  const sortedLectures = [...filteredLectures].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const handlePlayLecture = (lecture: Lecture) => {
    // Check if user is logged in
    if (!user) {
      setPendingLecture(lecture);
      setShowLoginModal(true);
      return;
    }
    
    // Check if key generation is enabled and user needs to generate key
    if (appSettings.keyGenerationEnabled && !checkKeyValidity()) {
      setPendingLecture(lecture);
      setShowKeyModal(true);
      return;
    }
    
    // Navigate to video player page
    navigateToWatch(lecture);
  };

  const navigateToWatch = (lecture: Lecture) => {
    navigate('/watch', {
      state: {
        videoUrl: lecture.link || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        lectureId: lecture._id,
        batchId: batch._id,
        subjectId: subject._id,
        title: getLectureTitle(lecture),
      }
    });
  };

  const handleKeyGenerated = () => {
    setShowKeyModal(false);
    if (pendingLecture) {
      navigateToWatch(pendingLecture);
      setPendingLecture(null);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (pendingLecture) {
      // After login, check for key generation
      if (appSettings.keyGenerationEnabled) {
        setShowKeyModal(true);
      } else {
        navigateToWatch(pendingLecture);
        setPendingLecture(null);
      }
    }
  };

  return (
    <div className="screen-enter">
      <button onClick={onBack} className="btn-back mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Subjects
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider line-clamp-1">
            {batch.title}
          </span>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1">
            <div className="pulse-dot" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              {getSubjectName()}
            </span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-gradient">Lectures</span>
        </h1>
        <p className="text-muted-foreground">
          {lectures.length} lectures available
        </p>
        
        {/* Key Status Badge */}
        {user && userKeyInfo && checkKeyValidity() && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500 font-medium">
              Key Active - {getRemainingTime(userKeyInfo.expiresAt)}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-md mb-8">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search lectures..."
        />
      </div>

      {loading ? (
        <SkeletonLoader count={8} type="lecture" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadLectures} />
      ) : sortedLectures.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Video className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {search ? 'No lectures match your search' : 'No lectures available'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedLectures.map((lecture, index) => {
            const progress = getLectureProgress(lecture._id);
            const isCompleted = progress && progress.progress >= 90;
            
            return (
              <div
                key={lecture._id}
                onClick={() => handlePlayLecture(lecture)}
                className="stagger-item glass-card-hover p-4 flex items-center gap-4 cursor-pointer group"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className={`lecture-number group-hover:scale-110 transition-transform ${isCompleted ? 'bg-green-500' : ''}`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    lecture.order ?? index + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {getLectureTitle(lecture)}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    {lecture.duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{lecture.duration}</span>
                      </div>
                    )}
                    {progress && progress.progress > 0 && (
                      <div className="flex items-center gap-2 flex-1 max-w-32">
                        <Progress value={progress.progress} className="h-1.5" />
                        <span className="text-xs text-muted-foreground">{progress.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Play className="w-4 h-4 text-primary ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Key Generation Modal */}
      <KeyGenerationModal
        isOpen={showKeyModal}
        onClose={() => { setShowKeyModal(false); setPendingLecture(null); }}
        onKeyGenerated={handleKeyGenerated}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => { setShowLoginModal(false); setPendingLecture(null); }}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

function getRemainingTime(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

export default LectureList;
