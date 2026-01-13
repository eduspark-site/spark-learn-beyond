import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import edusparkLogo from "@/assets/eduspark-logo.png";
import { Menu, X, Home, BookOpen, Info, MessageCircle, Send, Instagram, Youtube } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Resources", path: "/platform", icon: BookOpen },
    { name: "About", path: "/#about", icon: Info },
    { name: "Contact", path: "/#contact", icon: MessageCircle },
  ];

  const socialLinks = [
    { name: "WhatsApp", url: "https://whatsapp.com/channel/0029VaoeKYx3mFYErON0tj0P", icon: MessageCircle, color: "text-green-500" },
    { name: "Telegram", url: "https://t.me/+QZVBgE0CI89iMjll", icon: Send, color: "text-blue-500" },
    { name: "Instagram", url: "https://www.instagram.com/stylewithnitesh?igsh=MTZxNjBtbDRjNnk0YQ==", icon: Instagram, color: "text-pink-500" },
    { name: "YouTube", url: "https://youtube.com/@edusparkk-org?si=_PYBM2UfXxWR3Pr-", icon: Youtube, color: "text-red-500" },
  ];

  const handleNavClick = (path: string) => {
    setIsSidebarOpen(false);
    if (path.includes("#")) {
      const sectionId = path.split("#")[1];
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleJoinChannel = () => {
    window.open("https://t.me/+QZVBgE0CI89iMjll", "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
            {/* Hamburger Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </motion.button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group min-w-0">
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
                <span className="font-display font-bold text-base sm:text-lg italic bg-gradient-to-r from-gold via-yellow-400 to-gold-light bg-clip-text text-transparent group-hover:opacity-80 transition-opacity block truncate max-w-[10.5rem] sm:max-w-none">
                  EduSpark Reloaded
                </span>
                <span className="text-xs text-muted-foreground -mt-1 hidden sm:block">Version 2.0</span>
              </div>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold whitespace-nowrap ${
                    (link.path === "/" && isHome) || (link.path === "/platform" && !isHome)
                      ? "text-gold"
                      : "text-foreground"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right side - Join Channel + Theme Toggle */}
            <div className="flex items-center gap-3">
              {/* Join Channel Button - Desktop */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJoinChannel}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Join Channel
              </motion.button>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-background border-r border-border z-[101] flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link to="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-2">
                  <img src={edusparkLogo} alt="EduSpark" className="w-8 h-8 rounded-lg" />
                  <span className="font-display font-bold italic bg-gradient-to-r from-gold via-yellow-400 to-gold-light bg-clip-text text-transparent">EduSpark Reloaded</span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 py-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => handleNavClick(link.path)}
                      className={`flex items-center gap-3 px-6 py-3 text-base font-medium transition-colors hover:bg-secondary/50 ${
                        (link.path === "/" && isHome) || (link.path === "/platform" && !isHome)
                          ? "text-gold bg-gold/10"
                          : "text-foreground"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Social Links Section */}
              <div className="border-t border-border p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Connect With Us
                </p>
                <div className="space-y-1">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
                    >
                      <social.icon className={`w-5 h-5 ${social.color}`} />
                      <span className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">
                        {social.name}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
