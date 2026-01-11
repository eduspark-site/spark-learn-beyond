import { motion } from "framer-motion";
import { Heart, MapPin, Calendar, BookOpen, Sparkles } from "lucide-react";

const OwnerSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            About the Creator
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-gold to-gold-light mx-auto rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 md:p-10"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar with actual image */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="relative"
            >
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-gold to-gold-light p-1">
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <img 
                    src="https://i.postimg.cc/P5nW2dXn/IMG-20260111-223737.jpg"
                    alt="Nitesh Prakash"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-gold to-gold-light flex items-center justify-center">
                <span className="text-sm">🇮🇳</span>
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-1">
                <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold-light bg-clip-text text-transparent">
                  Nitesh Prakash
                </span>
              </h3>
              <p className="text-muted-foreground font-medium mb-4">
                Also known as{" "}
                <span className="text-gradient-gold font-bold">EduSpark</span>
                {" / "}
                <span className="text-gradient-gold font-bold">Sparky</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground mb-6">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span>Bihar, Bharat 🇮🇳</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>Birthday: 26 November</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>Preparing for NEET (PCMB)</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Heart className="w-4 h-4 text-gold" />
                  <span>Building for better education</span>
                </div>
              </div>

              <p className="text-foreground/80 text-sm leading-relaxed">
                Passionate about making quality education accessible to everyone. 
                EduSpark Reloaded is my contribution to help students across India 
                access the best learning resources without barriers.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-muted-foreground text-xs mt-8"
        >
          © 2024 EduSpark Reloaded. Built with ❤️ for students everywhere.
        </motion.p>
      </div>
    </section>
  );
};

export default OwnerSection;
