import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Library } from "lucide-react";
import Navbar from "@/components/Navbar";
import InstitutionCard from "@/components/InstitutionCard";
import OwnerSection from "@/components/OwnerSection";

const institutions = [
  {
    name: "Physics Wallah",
    logo: "https://i.postimg.cc/7ZzH9yBj/e94d95f8db2942a231b82f7ba98234f0.jpg",
    description: "A revolution in Indian ed-tech that provides highly affordable, top-quality coaching for JEE, NEET, and board exams through Alakh Pandey's engaging teaching style.",
    link: "/coming-soon?platform=Physics%20Wallah",
    isComingSoon: true,
  },
  {
    name: "Next Topper",
    logo: "https://i.postimg.cc/ZRHpqNpW/images-(1).png",
    description: "A fast-growing platform focused on Class 9–12 students, offering result-oriented online courses and simplified notes to help learners excel in their board exams.",
    link: "https://nexttoppers.com/",
  },
  {
    name: "Vidyakul",
    logo: "https://i.postimg.cc/CLXDdSBQ/images-(2).png",
    description: "India's first vernacular e-learning platform that empowers state-board students by providing high-quality education in their native regional languages.",
    link: "https://www.vidyakul.com/",
  },
  {
    name: "Unacademy",
    logo: "https://i.postimg.cc/L40g02TK/1-Ld-FNhp-Oe7u-In-b-HK9VUin-A.jpg",
    description: "One of India's largest learning platforms that connects millions of students with top educators for competitive exams like UPSC, IIT-JEE, and NEET through live interactive sessions.",
    link: "/coming-soon?platform=Unacademy",
    isComingSoon: true,
  },
  {
    name: "Padhle Akshay",
    logo: "https://i.postimg.cc/FK9KHBZw/images.jpg",
    description: "A popular community-driven platform known for its 'brother-like' teaching vibe, offering humorous meme-based booklets and simplified notes to turn 'backbenchers into toppers.'",
    link: "https://padhleakshay.com/",
  },
];

const edusKhazana = {
  name: "Edu's Khazana",
  logo: "https://i.postimg.cc/VNbCXTMP/1768150071312.png",
  description: "Your ultimate treasure chest of knowledge! Access FREE books, notes, and study materials for all competitive exams. Every resource a student needs, all in one place.",
  link: "https://telegram.me/eduskhazana",
  featured: true,
};

const Platform = () => {
  return (
    <div className="min-h-screen relative protected-content">
      {/* Background pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--gold)/0.05)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--gold)/0.03)_0%,_transparent_50%)]" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6"
          >
            <GraduationCap className="w-4 h-4 text-gold" />
            <span className="text-sm text-foreground">The Learning Hub</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="text-foreground">Access Top </span>
            <span className="text-gradient-gold">Educational Platforms</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            One unified gateway to India's best free educational resources. 
            No fees. No subscriptions. Pure learning.
          </motion.p>
        </div>
      </section>

      {/* Featured Section - Edu's Khazana */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <Library className="w-6 h-6 text-gold" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              The Treasure Chest
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <InstitutionCard {...edusKhazana} delay={0.1} />
          </div>
        </div>
      </section>

      {/* Institutions Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <BookOpen className="w-6 h-6 text-gold" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              Partner Platforms
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((institution, index) => (
              <InstitutionCard
                key={institution.name}
                {...institution}
                delay={0.1 + index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Owner Section */}
      <OwnerSection />
    </div>
  );
};

export default Platform;
