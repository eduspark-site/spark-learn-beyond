import { ExternalLink, FileText } from "lucide-react";

const FlashcardsSection = () => {
  const flashcardsLink = "https://drive.google.com/drive/folders/1QO1pJbDnHwOgLfyoEM8e73rPy2fso-Mw";

  return (
    <div className="animate-fade-in">
      <div className="glass-card p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        
        <h3 className="font-heading font-semibold text-xl mb-2">
          Chapter-wise Flashcards
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Access all flashcards for quick revision. Perfect for last-minute preparation and memorizing key concepts.
        </p>
        
        <a
          href={flashcardsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 glow-effect"
        >
          <span>Open Flashcards</span>
          <ExternalLink className="w-4 h-4" />
        </a>
        
        <p className="text-xs text-muted-foreground mt-4">
          Opens in Google Drive
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        <div className="glass-card p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-science/20 flex items-center justify-center flex-shrink-0">
            <span className="text-science font-bold">📚</span>
          </div>
          <div>
            <h4 className="font-medium mb-1">Science Flashcards</h4>
            <p className="text-sm text-muted-foreground">Physics, Chemistry, Biology - All formulas & concepts</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-social/20 flex items-center justify-center flex-shrink-0">
            <span className="text-social font-bold">🌍</span>
          </div>
          <div>
            <h4 className="font-medium mb-1">Social Science Flashcards</h4>
            <p className="text-sm text-muted-foreground">History, Civics, Economics, Geography - Key dates & facts</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-maths/20 flex items-center justify-center flex-shrink-0">
            <span className="text-maths font-bold">🔢</span>
          </div>
          <div>
            <h4 className="font-medium mb-1">Maths Flashcards</h4>
            <p className="text-sm text-muted-foreground">All formulas, theorems & shortcuts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsSection;
