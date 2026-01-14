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
      link: "https://t.me/+QZVBgE0CI89iMjll",
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm"
          />

          {/* Popup Container - Fixed Center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 400,
              duration: 0.3
            }}
            className="relative w-full max-w-sm mx-auto z-10"
          >
            <div className="bg-card border border-gold/30 relative overflow-hidden rounded-2xl shadow-2xl shadow-gold/10 p-5">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-primary/5" />
              
              {/* Close button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-destructive/30 transition-all duration-200 z-50 cursor-pointer"
                aria-label="Close popup"
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Content */}
              <div className="relative z-10">
                {/* Telegram icon */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Send className="w-7 h-7 text-white" />
                </div>

                <h3 className="font-display text-xl font-bold text-center text-foreground mb-2">
                  Join Our Community! 🎉
                </h3>

                <p className="text-muted-foreground text-center text-sm mb-5">
                  Get instant updates & study materials!
                </p>

                {/* Channel buttons */}
                <div className="space-y-3">
                  {channels.map((channel) => (
                    <a
                      key={channel.name}
                      href={channel.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${channel.color} text-white font-medium transition-transform duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]`}
                    >
                      <channel.icon className="w-5 h-5" />
                      <span className="flex-1 text-base">{channel.name}</span>
                      <span className="text-lg">→</span>
                    </a>
                  ))}
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Tap to join via Telegram
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TelegramPopup;
