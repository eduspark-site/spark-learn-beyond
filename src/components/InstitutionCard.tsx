import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, ExternalLink, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import TelegramPopup from "./TelegramPopup";

interface InstitutionCardProps {
  name: string;
  logo: string;
  description: string;
  link: string;
  featured?: boolean;
  delay?: number;
  isComingSoon?: boolean;
  subtitle?: string;
  directLink?: boolean;
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({
  name,
  logo,
  description,
  link,
  featured = false,
  delay = 0,
  isComingSoon = false,
  subtitle,
  directLink = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showTelegramPopup, setShowTelegramPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smoother springs with higher damping to prevent flickering
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 30 });

  // Reduced rotation for smoother feel
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    if (!isComingSoon && !link.startsWith("/")) {
      e.preventDefault();
      if (directLink) {
        // Direct link - open immediately
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        setShowTelegramPopup(true);
      }
    }
  };
  
  const handlePopupClose = () => {
    setShowTelegramPopup(false);
    // Redirect to the card's link after popup closes
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const isInternalLink = link.startsWith("/");

  // Determine button text based on card type
  const getButtonText = () => {
    if (isComingSoon) return "Coming Soon";
    if (name === "Tech Shivam") return "Visit Here";
    return "Let's Study";
  };

  const ButtonContent = () => (
    <>
      {getButtonText()}
      <motion.span
        className="inline-block"
        animate={isHovered ? { x: [0, 4, 0] } : {}}
        transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0 }}
      >
        {isComingSoon ? (
          <Clock className="w-4 h-4" />
        ) : featured ? (
          <ArrowRight className="w-4 h-4" />
        ) : (
          <ExternalLink className="w-4 h-4" />
        )}
      </motion.span>
    </>
  );

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.6, 
          delay, 
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative group cursor-pointer",
          featured && "md:col-span-2"
        )}
      >
        {/* Featured Badge - positioned to overlap on top */}
        {featured && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
            className="absolute -top-4 left-6 z-20 px-4 py-1.5 bg-gradient-to-r from-gold to-gold-light rounded-full shadow-lg"
          >
            <span className="text-xs font-bold text-navy flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          </motion.div>
        )}

        {isComingSoon && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 }}
            className="absolute -top-4 right-6 z-20 px-3 py-1 bg-secondary border border-border rounded-full"
          >
            <span className="text-xs font-medium text-muted-foreground">Coming Soon</span>
          </motion.div>
        )}

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "glass-card p-6 h-full relative overflow-hidden",
            featured && "border-2 border-gold/30",
            "pt-8" // Extra padding for badges
          )}
        >
          {/* Subtle shine effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "200%" } : { x: "-100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Logo with smooth hover */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 flex items-center justify-center mb-4 overflow-hidden"
          >
            <motion.img
              src={logo}
              alt={`${name} logo`}
              className="w-12 h-12 object-contain protected-content"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D4AF37&color=0A1628&size=48&bold=true`;
              }}
            />
          </motion.div>

          {/* Content */}
          <h3 className={cn(
            "font-display text-xl font-bold mb-1",
            featured ? "text-gradient-gold" : "text-foreground"
          )}>
            {name}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground italic mb-2">{subtitle}</p>
          )}
          <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
            {description}
          </p>

          {/* Button */}
          <div>
            {isInternalLink ? (
              <Link
                to={link}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
                  isComingSoon
                    ? "bg-secondary border border-border text-muted-foreground hover:bg-secondary/80"
                    : featured
                    ? "bg-gradient-to-r from-gold to-gold-light text-navy hover:opacity-90"
                    : "glass border border-gold/20 text-gold hover:bg-gold/10"
                )}
              >
                <ButtonContent />
              </Link>
            ) : (
              <motion.button
                onClick={handleButtonClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
                  featured
                    ? "bg-gradient-to-r from-gold to-gold-light text-navy hover:opacity-90"
                    : "glass border border-gold/20 text-gold hover:bg-gold/10"
                )}
              >
                <ButtonContent />
              </motion.button>
            )}
          </div>

          {/* Subtle border glow on hover */}
          <motion.div 
            className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-gold/0"
            animate={{ 
              borderColor: isHovered ? "rgba(212, 175, 55, 0.2)" : "rgba(212, 175, 55, 0)"
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>

      {/* Telegram Popup */}
      <TelegramPopup 
        isOpen={showTelegramPopup} 
        onClose={handlePopupClose} 
      />
    </>
  );
};

export default InstitutionCard;
