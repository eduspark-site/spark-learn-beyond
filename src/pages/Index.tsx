import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, BookOpen, Users, Sparkles } from "lucide-react";
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
      gradient: "from-blue-500/20 to-cyan-500/10",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of learners on the same journey",
      gradient: "from-purple-500/20 to-pink-500/10",
    },
    {
      icon: Shield,
      title: "Trusted Content",
      description: "Curated from India's top educational platforms",
      gradient: "from-green-500/20 to-emerald-500/10",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

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
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 hover-3d-tilt cursor-default"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-4 h-4 text-gold" />
            </motion.div>
            <span className="text-sm text-foreground">
              India's Free Learning Revolution
            </span>
            <Sparkles className="w-3 h-3 text-gold/60" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-foreground">One Platform.</span>
            <br />
            <motion.span 
              className="text-gradient-gold inline-block"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(212, 175, 55, 0)",
                  "0 0 40px rgba(212, 175, 55, 0.4)",
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
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Access lectures, batches, and study materials from India's top educators. 
            No fees. No barriers. Just pure education.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="perspective-1000"
          >
            <RippleButton
              onClick={handleExplore}
              size="lg"
              className="btn-3d"
            >
              Explore Now
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </RippleButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
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
                transition={{ duration: 0.5, delay: 1.2 + index * 0.15, type: "spring" }}
                whileHover={{ 
                  scale: 1.15, 
                  rotateY: 15,
                  z: 20,
                }}
                className="text-center hover-3d-tilt cursor-default glass rounded-xl p-4"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div 
                  className="font-display text-2xl md:text-3xl font-bold text-gradient-gold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
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
                initial={{ opacity: 0, y: 50, rotateX: -20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.15, 
                  type: "spring", 
                  stiffness: 120,
                  damping: 12
                }}
                whileHover={{ 
                  scale: 1.08, 
                  rotateY: 8,
                  rotateX: -5,
                  z: 50,
                }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 text-center cursor-pointer relative overflow-hidden group"
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                {/* Background gradient */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.6 }}
                />

                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mx-auto mb-4 relative"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <feature.icon className="w-7 h-7 text-gold" />
                  
                  {/* Icon glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gold/20 blur-xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                <motion.h3 
                  className="font-display font-bold text-lg text-foreground mb-2 relative"
                  style={{ transform: "translateZ(30px)" }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-sm text-muted-foreground relative"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {feature.description}
                </motion.p>

                {/* Bottom glow line */}
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-gold/0 via-gold to-gold/0 group-hover:w-3/4 transition-all duration-500"
                />
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
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2"
        >
          <motion.div 
            className="w-1.5 h-3 rounded-full bg-gold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            © 2024 EduSpark Reloaded. Built with ❤️ for students everywhere.
          </motion.p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
