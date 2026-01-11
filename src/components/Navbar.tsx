import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import edusparkLogo from "@/assets/eduspark-logo.png";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center"
            >
              <img 
                src={edusparkLogo} 
                alt="EduSpark Logo" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg italic bg-gradient-to-r from-gold via-yellow-400 to-gold-light bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                EduSpark Reloaded
              </span>
              <span className="text-xs text-muted-foreground -mt-1">Version 2.0</span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-gold whitespace-nowrap ${
                isHome ? "text-gold" : "text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/platform"
              className={`text-sm font-medium transition-colors hover:text-gold whitespace-nowrap ${
                !isHome ? "text-gold" : "text-foreground"
              }`}
            >
              Platform
            </Link>
          </div>

          {/* Theme Toggle */}
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
