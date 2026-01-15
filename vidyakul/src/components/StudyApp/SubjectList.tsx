import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, ArrowLeft, Library } from 'lucide-react';
import { Batch, Subject } from './types';
import { fetchSubjects } from './api';
import SearchBar from './SearchBar';
import SkeletonLoader from './SkeletonLoader';
import ErrorState from './ErrorState';

interface SubjectListProps {
  batch: Batch;
  onSelectSubject: (subject: Subject) => void;
  onBack: () => void;
}

const SubjectList = ({ batch, onSelectSubject, onBack }: SubjectListProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubjects(batch._id);
      setSubjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [batch._id]);

  const getSubjectName = (subject: Subject) => subject.title || subject.subjectName || subject.name || 'Untitled Subject';

  const filteredSubjects = subjects.filter((subject) =>
    getSubjectName(subject).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="screen-enter">
      <button onClick={onBack} className="btn-back mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Batches
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="pulse-dot" />
          <span className="text-sm font-medium text-primary uppercase tracking-wider line-clamp-1">
            {batch.title}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-gradient">Subjects</span>
        </h1>
        <p className="text-muted-foreground">
          Choose a subject to start learning
        </p>
      </div>

      <div className="max-w-md mb-8">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search subjects..."
        />
      </div>

      {loading ? (
        <SkeletonLoader count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadSubjects} />
      ) : filteredSubjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Library className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {search ? 'No subjects match your search' : 'No subjects available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject, index) => (
            <button
              key={subject._id}
              onClick={() => onSelectSubject(subject)}
              className="stagger-item glass-card-hover p-6 text-left group"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 to-primary/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {getSubjectName(subject)}
              </h3>
              {subject.totalVideos !== undefined && (
                <span className="badge">
                  {subject.totalVideos} Videos
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectList;
