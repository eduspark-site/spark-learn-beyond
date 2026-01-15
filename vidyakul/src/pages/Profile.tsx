import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, BookOpen, Shield, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { fetchBatches } from '@/components/StudyApp/api';
import { Batch } from '@/components/StudyApp/types';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const Profile = () => {
  const { user, userProfile, logout, isAdmin, getBatchProgress } = useAuth();
  const navigate = useNavigate();
  const [enrolledBatches, setEnrolledBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnrolledBatches = async () => {
      if (!userProfile?.enrolledBatches.length) {
        setLoading(false);
        return;
      }
      try {
        const allBatches = await fetchBatches();
        const enrolled = allBatches.filter(b => userProfile.enrolledBatches.includes(b._id));
        setEnrolledBatches(enrolled);
      } catch (error) {
        console.error('Failed to load enrolled batches:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEnrolledBatches();
  }, [userProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // Calculate overall progress
  const overallProgress = userProfile?.lectureProgress?.length
    ? Math.round(
        userProfile.lectureProgress.reduce((acc, p) => acc + p.progress, 0) / 
        userProfile.lectureProgress.length
      )
    : 0;

  const completedLectures = userProfile?.lectureProgress?.filter(p => p.progress >= 90).length || 0;

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/" className="btn-back inline-flex mb-6">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>
          
          <div className="glass-card p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <motion.div 
                className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-primary" />
                )}
              </motion.div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold mb-2">{user.displayName || 'User'}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary/10">
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" onClick={handleLogout} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Your Progress</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-bold text-gradient">{overallProgress}%</p>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-bold text-gradient">{completedLectures}</p>
              <p className="text-sm text-muted-foreground">Completed Lectures</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-bold text-gradient">{enrolledBatches.length}</p>
              <p className="text-sm text-muted-foreground">Enrolled Batches</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Enrolled Batches</h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="skeleton h-32 rounded-2xl" />
              ))}
            </div>
          ) : enrolledBatches.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">You haven't enrolled in any batches yet</p>
              <Link to="/">
                <Button className="btn-primary">Explore Batches</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolledBatches.map((batch, index) => {
                const batchProgress = getBatchProgress(batch._id);
                return (
                  <motion.div
                    key={batch._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card-hover p-4 cursor-pointer"
                    onClick={() => navigate('/')}
                  >
                    {batch.image && (
                      <div className="w-full h-24 rounded-xl overflow-hidden mb-3">
                        <img src={batch.image} alt={batch.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h3 className="font-semibold line-clamp-2 mb-2">{batch.title}</h3>
                    <div className="flex items-center gap-2">
                      <Progress value={batchProgress} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground">{batchProgress}%</span>
                    </div>
                    <p className="text-sm text-primary mt-2">Continue Learning →</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
