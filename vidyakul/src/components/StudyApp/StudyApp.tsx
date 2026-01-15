import { useState, useEffect } from 'react';
import { Batch, Subject, Screen } from './types';
import BatchList from './BatchList';
import SubjectList from './SubjectList';
import LectureList from './LectureList';
import KeyGenerationModal from '@/components/KeyGenerationModal';
import { useAuth } from '@/contexts/AuthContext';

const StudyApp = () => {
  const [screen, setScreen] = useState<Screen>('batches');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const { user, generateKey } = useAuth();

  // Check for key_token in URL on mount (for returning from shortener)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const keyToken = urlParams.get('key_token');
    
    if (keyToken) {
      if (user) {
        // User is logged in, show key verification modal
        setShowKeyModal(true);
      } else {
        // Store token for after login
        sessionStorage.setItem('pending_key_token', keyToken);
      }
    }
  }, [user]);

  // Check for pending key token after login
  useEffect(() => {
    if (user) {
      const pendingToken = sessionStorage.getItem('pending_key_token');
      if (pendingToken) {
        sessionStorage.removeItem('pending_key_token');
        // Verify the token
        generateKey(pendingToken).then(success => {
          if (success) {
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        });
      }
    }
  }, [user, generateKey]);

  const handleSelectBatch = (batch: Batch) => {
    console.log('[StudyApp] Batch selected, storing:', batch._id);
    setSelectedBatch(batch);
    setScreen('subjects');
  };

  const handleSelectSubject = (subject: Subject) => {
    console.log('[StudyApp] Subject selected, storing:', subject._id);
    setSelectedSubject(subject);
    setScreen('lectures');
  };

  const handleBackToBatches = () => {
    setSelectedBatch(null);
    setSelectedSubject(null);
    setScreen('batches');
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setScreen('subjects');
  };

  const handleKeyGenerated = () => {
    setShowKeyModal(false);
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        {screen === 'batches' && (
          <BatchList onSelectBatch={handleSelectBatch} />
        )}
        
        {screen === 'subjects' && selectedBatch && (
          <SubjectList
            batch={selectedBatch}
            onSelectSubject={handleSelectSubject}
            onBack={handleBackToBatches}
          />
        )}
        
        {screen === 'lectures' && selectedBatch && selectedSubject && (
          <LectureList
            batch={selectedBatch}
            subject={selectedSubject}
            onBack={handleBackToSubjects}
          />
        )}
      </div>

      {/* Key Generation Modal for returning users */}
      <KeyGenerationModal
        isOpen={showKeyModal}
        onClose={() => {
          setShowKeyModal(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }}
        onKeyGenerated={handleKeyGenerated}
      />
    </div>
  );
};

export default StudyApp;
