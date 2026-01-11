import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, BookOpen, Users } from "lucide-react";
import FloatingGeometry from "@/components/FloatingGeometry";
import Navbar from "@/components/Navbar";
import RippleButton from "@/components/RippleButton";
import DisclaimerSection from "@/components/DisclaimerSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/platform");
  };

  const features = [
    {
      icon: BookOpen,
      title: "Free Resources",
      description: "Access quality study materials without any cost",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of learners on the same journey",
    },
    {
      icon: Shield,
      title: "Trusted Content",
      description: "Curated from India's top educational platforms",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden protected-content page-3d">
      {/* Three.js Background */}
      <FloatingGeometry />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      {/* Navbar */}
      <Navbar />

      {/* Hero Content */}
      <main className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -30 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 hover-3d-tilt"
          >
            <Zap className="w-4 h-4 text-gold" />
            <span className="text-sm text-foreground">
              India's Free Learning Revolution
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-foreground">One Platform.</span>
            <br />
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
              Infinite Free Learning.
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Access lectures, batches, and study materials from India's top educators. 
            No fees. No barriers. Just pure education.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: -20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
            className="perspective-1000"
          >
            <RippleButton
              onClick={handleExplore}
              size="lg"
              className="btn-3d"
            >
              Explore Now
              <ArrowRight className="w-5 h-5" />
            </RippleButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: "6+", label: "Platforms" },
              { value: "100%", label: "Free" },
              { value: "∞", label: "Resources" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, rotateY: -30 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.4, delay: 1.2 + index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1, rotateY: 10 }}
                className="text-center hover-3d-tilt cursor-default"
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-gradient-gold">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Why Choose <span className="text-gradient-gold italic">EduSpark Reloaded</span>?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
                }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-6 text-center cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mx-auto mb-4"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <feature.icon className="w-7 h-7 text-gold" />
                </motion.div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <DisclaimerSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-gold" />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 EduSpark Reloaded. Built with ❤️ for students everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
