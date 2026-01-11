import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full glass p-1 cursor-pointer overflow-hidden"
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDark
            ? "linear-gradient(135deg, hsl(222, 47%, 11%), hsl(222, 40%, 20%))"
            : "linear-gradient(135deg, hsl(43, 80%, 90%), hsl(43, 74%, 70%))",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Toggle circle */}
      <motion.div
        className="relative w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
        animate={{
          x: isDark ? 32 : 0,
          backgroundColor: isDark ? "hsl(43, 74%, 52%)" : "hsl(43, 74%, 49%)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          animate={{ rotate: isDark ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-navy" />
          ) : (
            <Sun className="w-4 h-4 text-navy" />
          )}
        </motion.div>
      </motion.div>

      {/* Stars for dark mode */}
      {isDark && (
        <>
          <motion.div
            className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          />
          <motion.div
            className="absolute top-3 left-4 w-0.5 h-0.5 bg-white rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          />
          <motion.div
            className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          />
        </>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
