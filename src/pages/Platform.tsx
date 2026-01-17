import { motion, Variants } from "framer-motion";
import { BookOpen, GraduationCap, Library, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import InstitutionCard from "@/components/InstitutionCard";
import OwnerSection from "@/components/OwnerSection";
import notesBloomLogo from "@/assets/notes-bloom-logo.jpg";

const institutions = [
  {
    name: "Vidyakul",
    logo: "https://i.postimg.cc/CLXDdSBQ/images-(2).png",
    description: "India's first vernacular e-learning platform that empowers state-board students by providing high-quality education in their native regional languages.",
    link: "https://eduspark-vidyakul.netlify.app",
    directLink: true,
  },
  {
    name: "Padhle Akshay",
    logo: "https://i.postimg.cc/FK9KHBZw/images.jpg",
    description: "A popular community-driven platform known for its 'brother-like' teaching vibe, offering humorous meme-based booklets and simplified notes to turn 'backbenchers into toppers.'",
    link: "https://eduspark-padhleakshay.netlify.app/",
    directLink: true,
  },
  {
    name: "Next Topper",
    logo: "https://i.postimg.cc/ZRHpqNpW/images-(1).png",
    description: "A fast-growing platform focused on Class 9–12 students, offering result-oriented online courses and simplified notes to help learners excel in their board exams.",
    link: "/coming-soon?platform=Next%20Topper",
    isComingSoon: true,
  },
  {
    name: "Physics Wallah",
    logo: "https://i.postimg.cc/7ZzH9yBj/e94d95f8db2942a231b82f7ba98234f0.jpg",
    description: "A revolution in Indian ed-tech that provides highly affordable, top-quality coaching for JEE, NEET, and board exams through Alakh Pandey's engaging teaching style.",
    link: "/coming-soon?platform=Physics%20Wallah",
    isComingSoon: true,
  },
  {
    name: "Unacademy",
    logo: "https://i.postimg.cc/L40g02TK/1-Ld-FNhp-Oe7u-In-b-HK9VUin-A.jpg",
    description: "One of India's largest learning platforms that connects millions of students with top educators for competitive exams like UPSC, IIT-JEE, and NEET through live interactive sessions.",
    link: "/coming-soon?platform=Unacademy",
    isComingSoon: true,
  },
];

const treasureChestItems = [
  {
    name: "Edu's Khazana",
    logo: "https://i.postimg.cc/VNbCXTMP/1768150071312.png",
    description: "Your ultimate treasure chest of knowledge! Access FREE books, notes, and study materials for all competitive exams. Every resource a student needs, all in one place.",
    link: "https://khzana-reloaded.vercel.app/",
    featured: true,
    directLink: true,
  },
  {
    name: "Tech Shivam",
    subtitle: "A part of Eduspark",
    logo: "https://i.postimg.cc/dtnfff9q/IMG-20260113-025520-247.jpg",
    description: "Get all MOD apks and premium unlocked Apps - Safe, fast & 100% working.",
    link: "https://ts-hub-official.vercel.app/",
    featured: true,
    directLink: true,
  },
  {
    name: "Notes Bloom",
    subtitle: "Powered by Eduspark",
    logo: notesBloomLogo,
    description: "Your go-to destination for comprehensive study notes and educational resources. Bloom your knowledge with quality notes!",
    link: "https://notes-bloom.vercel.app/",
    featured: true,
    directLink: true,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const Platform = () => {
  return (
    <div className="min-h-screen relative protected-content">
      {/* Background pattern with animated elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--gold)/0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--gold)/0.05)_0%,_transparent_50%)]" />
        
      {/* Static background orbs - no animation for performance */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl opacity-30" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 cursor-default"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <GraduationCap className="w-4 h-4 text-gold" />
            </motion.div>
            <span className="text-sm text-foreground">The Learning Hub</span>
            <Sparkles className="w-3 h-3 text-gold/60" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="text-foreground">Access Top </span>
            <motion.span 
              className="text-gradient-gold"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(212, 175, 55, 0)",
                  "0 0 30px rgba(212, 175, 55, 0.3)",
                  "0 0 20px rgba(212, 175, 55, 0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Educational Platforms
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            One unified gateway to India's best free educational resources. 
            No fees. No subscriptions. Pure learning.
          </motion.p>
        </motion.div>
      </section>

      {/* Featured Section - Edu's Khazana */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Library className="w-6 h-6 text-gold" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              The Treasure Chest
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {treasureChestItems.map((item, index) => (
              <InstitutionCard key={item.name} {...item} delay={0.1 + index * 0.15} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Institutions Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen className="w-6 h-6 text-gold" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Partner Platforms
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {institutions.map((institution, index) => (
              <InstitutionCard
                key={institution.name}
                {...institution}
                delay={0.1 + index * 0.1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Owner Section */}
      <OwnerSection />
    </div>
  );
};

export default Platform;
