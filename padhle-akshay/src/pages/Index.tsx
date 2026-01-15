import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CourseDetails from "@/components/CourseDetails";

const Index = () => {
  const [showCourseDetails, setShowCourseDetails] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {showCourseDetails ? (
        <CourseDetails onClose={() => setShowCourseDetails(false)} />
      ) : (
        <HeroSection onExploreClick={() => setShowCourseDetails(true)} />
      )}
      
      {/* Footer */}
      {!showCourseDetails && (
        <footer className="py-8 text-center border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Powered By <span className="text-primary font-semibold">EDUSPARK</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © 2026 EDUSPARK. All rights reserved.
          </p>
        </footer>
      )}
    </div>
  );
};

export default Index;
