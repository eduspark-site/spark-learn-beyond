import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Maximize, 
  Minimize,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Maximize2
} from "lucide-react";
import { useProgressTracking } from "@/hooks/useProgressTracking";

const VideoPlayer = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const { saveProgress, getProgress } = useProgressTracking();
  const videoTitle = (location.state as any)?.title || "Physics";

  // Load YouTube IFrame API with security considerations
  useEffect(() => {
    const loadPlayer = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        createPlayer();
      } else {
        // Check if script already exists to prevent duplicate loading
        const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
        if (existingScript) {
          (window as any).onYouTubeIframeAPIReady = createPlayer;
          return;
        }

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        
        // Add error handling for script loading failures
        tag.onerror = () => {
          console.error('Failed to load YouTube IFrame API');
          setIsReady(false);
        };

        // Validate the script source before insertion
        const allowedDomain = 'https://www.youtube.com/';
        if (!tag.src.startsWith(allowedDomain)) {
          console.error('Invalid YouTube API source');
          return;
        }

        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        (window as any).onYouTubeIframeAPIReady = createPlayer;
      }
    };

    const createPlayer = () => {
      const existingDiv = document.getElementById('yt-player-container');
      if (!existingDiv) return;

      const savedProgress = getProgress(videoId || "");
      const startTime = savedProgress ? Math.floor(savedProgress.currentTime) : 0;

      const ytPlayer = new (window as any).YT.Player('yt-player-container', {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 1,
          playsinline: 1,
          origin: window.location.origin,
          start: startTime,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            setDuration(event.target.getDuration());
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === 1);
            if (event.data === 1) {
              setHasStarted(true);
            }
          },
        },
      });
      setPlayer(ytPlayer);
    };

    loadPlayer();

    return () => {
      (window as any).onYouTubeIframeAPIReady = null;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [videoId]);

  // Track progress
  useEffect(() => {
    if (isPlaying && player) {
      progressIntervalRef.current = setInterval(() => {
        const current = player.getCurrentTime?.() || 0;
        const dur = player.getDuration?.() || 0;
        setCurrentTime(current);
        setDuration(dur);
        if (dur > 0) {
          setProgress((current / dur) * 100);
          saveProgress(videoId || "", current, dur);
        }
      }, 1000);
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, player, videoId, saveProgress]);

  const togglePlay = useCallback(() => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  }, [player, isPlaying]);

  const seekForward = useCallback(() => {
    if (player) {
      const current = player.getCurrentTime();
      player.seekTo(current + 10, true);
    }
  }, [player]);

  const seekBackward = useCallback(() => {
    if (player) {
      const current = player.getCurrentTime();
      player.seekTo(Math.max(0, current - 10), true);
    }
  }, [player]);

  const toggleMute = useCallback(() => {
    if (player) {
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
      setIsMuted(!isMuted);
    }
  }, [player, isMuted]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        // Request fullscreen and try to lock orientation to landscape
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
        
        // Try to lock screen orientation to landscape
        if (screen.orientation && (screen.orientation as any).lock) {
          try {
            await (screen.orientation as any).lock('landscape');
          } catch (e) {
            console.log('Orientation lock not supported');
          }
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        
        // Unlock orientation
        if (screen.orientation && (screen.orientation as any).unlock) {
          try {
            (screen.orientation as any).unlock();
          } catch (e) {
            console.log('Orientation unlock not supported');
          }
        }
      }
    } catch (error) {
      console.log('Fullscreen error:', error);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const seekTime = percentage * duration;
    player.seekTo(seekTime, true);
    setProgress(percentage * 100);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    container?.addEventListener('touchstart', handleMouseMove);

    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
      container?.removeEventListener('touchstart', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="container flex items-center h-14 gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-foreground font-semibold truncate">{videoTitle}</h1>
            <p className="text-xs text-muted-foreground">
              Powered By <span className="text-primary font-semibold">EDUSPARK</span>
            </p>
          </div>
        </div>
      </header>

      {/* Video Container - Half screen initially */}
      <div className="px-4 py-4">
        <div 
          ref={containerRef}
          className={`relative bg-black rounded-2xl overflow-hidden ${
            isFullscreen ? 'fixed inset-0 z-[100] rounded-none' : 'aspect-video'
          }`}
        >
          {/* Dark overlay to hide YouTube thumbnail until video starts */}
          {!hasStarted && (
            <div className="absolute inset-0 bg-black z-[25]" />
          )}

          {/* YouTube Player Container */}
          <div className={`absolute inset-0 ${hasStarted ? 'visible' : 'invisible'}`}>
            <div className="absolute inset-0 scale-[1.5] origin-center">
              <div id="yt-player-container" className="absolute inset-0 w-full h-full" />
            </div>
          </div>
          
          {/* Full overlay layer to capture clicks */}
          <div 
            className="absolute inset-0 bg-transparent cursor-pointer z-10"
            onClick={togglePlay}
          />
          
          {/* Top overlay gradient */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-20" />
          
          {/* Bottom overlay gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20" />
          
          {/* Quality Badge - Top Left */}
          <div className={`absolute top-3 left-3 z-30 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">
              1080p
            </span>
          </div>

          {/* Fullscreen Button - Top Right (visible before playing) */}
          {!isFullscreen && (
            <button 
              onClick={toggleFullscreen}
              className={`absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-all ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
          )}
          
          {/* Center Play Button */}
          {!isPlaying && isReady && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <button 
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors shadow-2xl"
              >
                <Play className="w-10 h-10 text-white ml-1" fill="white" />
              </button>
            </div>
          )}

          {/* Loading indicator */}
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-black">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Custom Controls */}
          <div 
            className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 z-40 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Progress Bar */}
            <div 
              className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer group"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-primary rounded-full relative transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg" />
              </div>
            </div>

            {/* Time Display */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <span className="text-xs text-white bg-white/20 px-2 py-0.5 rounded">
                1080p
              </span>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <VolumeX className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Center Controls */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={seekBackward}
                  className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <SkipBack className="w-5 h-5 text-white" />
                </button>

                <button 
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors shadow-xl"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" fill="white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                  )}
                </button>

                <button 
                  onClick={seekForward}
                  className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <button 
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Settings className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5 text-white" />
                  ) : (
                    <Maximize className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Branding in fullscreen */}
          {isFullscreen && (
            <div className={`absolute bottom-24 left-0 right-0 text-center z-40 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-xs text-white/60">
                Powered By <span className="text-primary font-semibold">EDUSPARK</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Branding below player (when not fullscreen) */}
      {!isFullscreen && (
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">
            Powered By <span className="text-primary font-semibold">EDUSPARK</span>
          </p>
        </div>
      )}

      {/* Additional content area below video */}
      {!isFullscreen && (
        <div className="flex-1 px-4 py-4">
          <div className="bg-card rounded-xl p-4 border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-2">{videoTitle}</h2>
            <p className="text-sm text-muted-foreground">
              Watch this video to learn more about the topic.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
