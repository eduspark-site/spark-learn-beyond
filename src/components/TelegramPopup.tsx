import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Users } from "lucide-react";
import { useEffect } from "react";

interface TelegramPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TelegramPopup: React.FC<TelegramPopupProps> = ({ isOpen, onClose }) => {
  const channels = [
    {
      name: "EduSpark Main Channel",
      link: "https://t.me/+JkDtn9klaYtlMjA1",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "EduSpark Community",
      link: "https://t.me/+4rAfCNku8DBjZDdl",
      icon: MessageCircle,
      color: "from-purple-500 to-pink-500",
    },
  ];

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: 15 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.5
            }}
            className="relative w-full max-w-md mx-auto"
            style={{ perspective: "1000px" }}
          >
            <div className="glass-card p-6 border border-gold/20 relative overflow-hidden rounded-2xl">
              {/* Animated background gradients */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-blue-500/10"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gold/30 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + i * 12}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              
              {/* Close button - Enhanced */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.85 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-destructive/20 transition-all duration-300 z-50 cursor-pointer"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Content */}
              <div className="relative z-10">
                {/* Telegram icon with 3D effect */}
                <motion.div
                  initial={{ rotateY: -180, scale: 0 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 15, delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Send className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="font-display text-2xl font-bold text-center text-foreground mb-3"
                >
                  Join Our Community! 🎉
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-center text-sm mb-8"
                >
                  Get instant updates, study materials, and connect with fellow learners!
                </motion.p>

                {/* Channel buttons with enhanced 3D */}
                <div className="space-y-4">
                  {channels.map((channel, index) => (
                    <motion.a
                      key={channel.name}
                      href={channel.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -50, rotateY: -45 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ 
                        delay: 0.5 + index * 0.15, 
                        type: "spring",
                        stiffness: 200 
                      }}
                      whileHover={{ 
                        scale: 1.03, 
                        x: 8,
                        rotateY: 5,
                        boxShadow: "0 15px 40px -10px rgba(59, 130, 246, 0.4)"
                      }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r ${channel.color} text-white font-medium transition-all duration-300 shadow-lg`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <channel.icon className="w-6 h-6" />
                      </motion.div>
                      <span className="flex-1 text-lg">{channel.name}</span>
                      <motion.span
                        animate={{ x: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                        className="text-xl"
                      >
                        →
                      </motion.span>
                    </motion.a>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-xs text-center text-muted-foreground mt-6"
                >
                  Click to join via Telegram app
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TelegramPopup;
