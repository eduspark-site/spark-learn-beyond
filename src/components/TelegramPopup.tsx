import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Users } from "lucide-react";

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
            style={{ perspective: "1000px" }}
          >
            <div className="glass-card p-6 border border-gold/20 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-blue-500/5 animate-pulse" />
              
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Content */}
              <div className="relative z-10">
                {/* Telegram icon with 3D effect */}
                <motion.div
                  initial={{ rotateY: -180 }}
                  animate={{ rotateY: 0 }}
                  transition={{ type: "spring", damping: 15, delay: 0.2 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Send className="w-8 h-8 text-white" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-xl font-bold text-center text-foreground mb-2"
                >
                  Join Our Community! 🎉
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-center text-sm mb-6"
                >
                  Get instant updates, study materials, and connect with fellow learners!
                </motion.p>

                {/* Channel buttons */}
                <div className="space-y-3">
                  {channels.map((channel, index) => (
                    <motion.a
                      key={channel.name}
                      href={channel.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -30, rotateY: -30 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      whileHover={{ 
                        scale: 1.02, 
                        x: 5,
                        boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.3)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${channel.color} text-white font-medium transition-all duration-300`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <channel.icon className="w-5 h-5" />
                      <span className="flex-1">{channel.name}</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.span>
                    </motion.a>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-center text-muted-foreground mt-4"
                >
                  Click to join via Telegram app
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TelegramPopup;
