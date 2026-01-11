import { motion } from "framer-motion";
import { ArrowLeft, Clock, Bell, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";

const ComingSoon = () => {
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "Platform";

  return (
    <div className="min-h-screen relative protected-content">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--gold)/0.08)_0%,_transparent_60%)]" />
      </div>

      <Navbar />

      <main className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border-2 border-dashed border-gold/30 flex items-center justify-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                  <Clock className="w-12 h-12 text-gold" />
                </div>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-navy" />
              </motion.div>
            </div>
          </motion.div>

          {/* Platform Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium">
              {platform}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="text-foreground">Coming </span>
            <span className="text-gradient-gold">Soon</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-muted-foreground mb-8 max-w-md mx-auto"
          >
            We're working hard to bring you access to {platform}'s resources. 
            Stay tuned for updates!
          </motion.p>

          {/* Notification Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card p-6 mb-8 max-w-sm mx-auto"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-gold" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Stay Updated</h3>
                <p className="text-sm text-muted-foreground">
                  Join our Telegram for notifications
                </p>
              </div>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              to="/platform"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Platform
            </Link>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-16"
          >
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-3">
              <span>Integration Progress</span>
            </div>
            <div className="w-64 h-2 mx-auto bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "45%" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">45% Complete</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ComingSoon;
