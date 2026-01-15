import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ChevronRight, Sparkles, BookOpen, Users } from 'lucide-react';
import { Batch } from './types';
import { fetchBatches } from './api';
import SearchBar from './SearchBar';
import SkeletonLoader from './SkeletonLoader';
import ErrorState from './ErrorState';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BatchListProps {
  onSelectBatch: (batch: Batch) => void;
}

const BatchList = ({ onSelectBatch }: BatchListProps) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingBatch, setPendingBatch] = useState<Batch | null>(null);
  const { user, enrollInBatch, isEnrolled } = useAuth();

  const loadBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBatches();
      setBatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const filteredBatches = batches.filter((batch) =>
    batch.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBatchClick = (batch: Batch) => {
    if (!user) {
      setPendingBatch(batch);
      setLoginModalOpen(true);
      return;
    }
    onSelectBatch(batch);
  };

  const handleEnroll = async (e: React.MouseEvent, batch: Batch) => {
    e.stopPropagation();
    if (!user) {
      setPendingBatch(batch);
      setLoginModalOpen(true);
      return;
    }
    try {
      await enrollInBatch(batch._id);
      toast.success('Successfully enrolled!');
    } catch (error) {
      toast.error('Failed to enroll');
    }
  };

  const handleLoginSuccess = () => {
    if (pendingBatch) {
      onSelectBatch(pendingBatch);
      setPendingBatch(null);
    }
  };

  return (
    <>
      <div className="screen-enter">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <motion.div 
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">VIDYAKUL STUDY HUB</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-gradient">Choose Your</span>
            <br />
            <span>Learning Path</span>
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground text-lg max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Select a batch to explore subjects and start learning today
          </motion.p>

          {/* 3D Floating Elements */}
          <div className="relative h-20 mt-6">
            <motion.div
              className="absolute left-1/4 top-0 w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center"
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <BookOpen className="w-6 h-6 text-primary" />
            </motion.div>
            <motion.div
              className="absolute right-1/4 top-4 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
              animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            >
              <Users className="w-5 h-5 text-primary" />
            </motion.div>
            <motion.div
              className="absolute left-1/3 top-8 w-8 h-8 rounded-lg bg-primary/5 border border-primary/10"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search batches..."
          />
        </div>

        {loading ? (
          <SkeletonLoader count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={loadBatches} />
        ) : filteredBatches.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {search ? 'No batches match your search' : 'No batches available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map((batch, index) => (
              <motion.div
                key={batch._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card-hover overflow-hidden group"
              >
                <button
                  onClick={() => handleBatchClick(batch)}
                  className="w-full text-left"
                >
                  {batch.image && (
                    <div className="w-full h-40 overflow-hidden">
                      <img 
                        src={batch.image} 
                        alt={batch.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 flex-1">
                        {batch.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      Tap to explore subjects
                    </p>
                  </div>
                </button>

                <div className="px-4 pb-4 flex gap-2">
                  <Button
                    onClick={(e) => handleEnroll(e, batch)}
                    disabled={isEnrolled(batch._id)}
                    className={isEnrolled(batch._id) ? 'flex-1 bg-muted text-muted-foreground cursor-default' : 'flex-1 btn-primary'}
                    size="sm"
                  >
                    {isEnrolled(batch._id) ? 'Enrolled ✓' : 'Enroll Now'}
                  </Button>
                  <Button
                    onClick={() => handleBatchClick(batch)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-primary text-primary hover:bg-primary/10"
                  >
                    Let's Study
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => { setLoginModalOpen(false); setPendingBatch(null); }}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default BatchList;
