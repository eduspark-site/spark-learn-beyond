import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogIn, Sun, Moon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import vidyakulLogo from '@/assets/vidyakul-logo.png';

const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-card border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.img
            src={vidyakulLogo}
            alt="VidyaKul"
            className="w-8 h-8 object-contain"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gradient">VidyaKul</span>
            <span className="text-[10px] text-muted-foreground -mt-1">POWERED BY EDUSPARK</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>

          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
              <span className="font-medium">{user.displayName?.split(' ')[0] || 'Profile'}</span>
            </motion.button>
          ) : (
            <Button onClick={() => navigate('/login')} className="btn-primary gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-4 pb-4 flex flex-col gap-3"
        >
          <button
            onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {user ? (
            <button
              onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 p-3 rounded-xl bg-primary/10"
            >
              <User className="w-5 h-5 text-primary" />
              <span>Profile</span>
            </button>
          ) : (
            <button
              onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 p-3 rounded-xl btn-primary"
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </button>
          )}
        </motion.div>
      )}
    </header>
  );
};

export default Header;
