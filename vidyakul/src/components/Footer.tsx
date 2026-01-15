import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4"
        >
          {/* Powered by EDUSPARK Box */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card px-6 py-3 flex items-center gap-2 border-2 border-primary/30"
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg">
              <span className="text-muted-foreground">POWERED BY</span>{' '}
              <span className="text-gradient">EDUSPARK</span>
            </span>
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>

          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} VidyaKul. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
