import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';

const Watch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get lecture data from navigation state
  const lectureData = location.state as {
    videoUrl: string;
    lectureId: string;
    batchId: string;
    subjectId: string;
    title: string;
  } | null;

  useEffect(() => {
    if (!lectureData) {
      navigate('/');
    }
  }, [lectureData, navigate]);

  if (!lectureData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <VideoPlayer
        videoUrl={lectureData.videoUrl}
        lectureId={lectureData.lectureId}
        batchId={lectureData.batchId}
        subjectId={lectureData.subjectId}
        title={lectureData.title}
        onClose={() => navigate(-1)}
      />
    </div>
  );
};

export default Watch;
