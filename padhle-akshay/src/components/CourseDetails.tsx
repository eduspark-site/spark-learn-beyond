import { useState } from "react";
import { X, Calendar, Trophy, Rocket, FileText, Target, Zap, Bot, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import VideoSection from "./VideoSection";
import FlashcardsSection from "./FlashcardsSection";
import ProgressOverview from "./ProgressOverview";

interface CourseDetailsProps {
  onClose: () => void;
}

type TabType = "overview" | "video" | "flashcards";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is this course really free?",
    answer: "Yes! This course is completely free and accessible to all students."
  },
  {
    question: "How long do I have access?",
    answer: "You have access till your result date, so you can learn at your own pace."
  },
  {
    question: "What's included in the course?",
    answer: "Full NCERT syllabus videos, flashcards, notes, and AI doubt solver."
  },
];

const features = [
  {
    icon: Rocket,
    title: "Full NCERT Syllabus Covered",
    description: "Complete 24 Hours of comprehensive content"
  },
  {
    icon: FileText,
    title: "Premium Lecture Notes & One-Pagers",
    points: [
      "Clean, concise, printable notes for last-minute revision",
      "Easy-to-understand diagrams & solved examples",
      "One-Page revision sheets with high-yield facts highlighted"
    ]
  },
  {
    icon: Target,
    title: "Chapter-wise Quizzes",
    points: [
      "MCQs, competency-based questions, and PYQs",
      "Instant results to track performance and identify weak areas"
    ]
  },
  {
    icon: Zap,
    title: "Flashcards for Every Chapter",
    points: [
      "Perfect for memory-based learning and quick recall",
      "Includes important definitions, formulas, and concepts"
    ]
  },
  {
    icon: Bot,
    title: "AI Doubt Solver (24×7)",
    points: [
      "Your private AI tutor inside the app",
      "Ask unlimited questions and get instant, stress-free answers"
    ]
  },
];

const CourseDetails = ({ onClose }: CourseDetailsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "video", label: "Video" },
    { id: "flashcards", label: "Flash Cards" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Home</span>
            <span className="text-muted-foreground/50">›</span>
            <span className="text-foreground">A.I x Akshay Crash Course</span>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="container py-6">
        {/* Title Section */}
        <div className="mb-6 animate-slide-up">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-4">
            A.I × Akshay — 24 Hour Full Syllabus Crash Course (Class 10th)
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Validity: Till Result Date</span>
          </div>
          <span className="text-2xl font-heading font-bold text-success">Free</span>
        </div>

        {/* Tabs */}
        <div className="flex bg-secondary rounded-lg p-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* What You Get */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-heading font-semibold text-primary">What You Get</h2>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="glass-card p-5 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold pt-2">{feature.title}</h3>
                    </div>
                    {feature.description && (
                      <p className="text-muted-foreground ml-13">{feature.description}</p>
                    )}
                    {feature.points && (
                      <ul className="space-y-2 ml-13">
                        {feature.points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-heading font-semibold text-primary">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className="glass-card overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full p-4 flex items-center justify-between text-left"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {openFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    {openFAQ === index && (
                      <div className="px-4 pb-4 text-muted-foreground animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "video" && (
          <div className="space-y-6">
            <ProgressOverview />
            <VideoSection />
          </div>
        )}
        {activeTab === "flashcards" && <FlashcardsSection />}

        {/* Powered By Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          Powered By <span className="text-primary font-semibold">EDUSPARK</span>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
