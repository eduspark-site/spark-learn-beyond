import { ArrowRight } from "lucide-react";
import padhleAkshayLogo from "@/assets/padhle-akshay-logo.jpg";
import batchImage from "@/assets/batch-image.png";

interface HeroSectionProps {
  onExploreClick: () => void;
}

const HeroSection = ({ onExploreClick }: HeroSectionProps) => {
  return (
    <section className="relative py-12 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        {/* Logo & Title */}
        <div className="flex flex-col items-center text-center mb-8 animate-slide-up">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/30 glow-effect">
              <img 
                src={padhleAkshayLogo} 
                alt="Padhle Akshay" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">✓</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">
            Padhle Akshay
          </h1>
          <p className="text-muted-foreground text-lg">
            Premium Education Accessible to All
          </p>
        </div>

        {/* Course Card */}
        <div 
          className="glass-card p-4 max-w-md mx-auto hover-lift cursor-pointer animate-fade-in"
          onClick={onExploreClick}
          style={{ animationDelay: '0.2s' }}
        >
          <div className="relative rounded-lg overflow-hidden mb-4">
            <img 
              src={batchImage} 
              alt="24 Hours Crash Course" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
          
          <h3 className="font-heading font-semibold text-lg mb-3">
            A.I × Akshay — 24 Hour Full Syllabus Crash Course (Class 10th)
          </h3>
          
          <button 
            className="w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 glow-effect"
          >
            Explore
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
