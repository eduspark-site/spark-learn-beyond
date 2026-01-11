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
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({
  name,
  logo,
  description,
  link,
  featured = false,
  delay = 0,
  isComingSoon = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showTelegramPopup, setShowTelegramPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const translateZ = useTransform(mouseXSpring, [-0.5, 0.5], ["-5px", "5px"]);

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
      setShowTelegramPopup(true);
    }
  };

  const isInternalLink = link.startsWith("/");

  const ButtonContent = () => (
    <>
      {isComingSoon ? "Coming Soon" : "Let's Study"}
      <motion.span
        className="inline-block"
        animate={isHovered ? { x: [0, 5, 0] } : {}}
        transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
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
        initial={{ opacity: 0, y: 60, rotateX: -20, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.8, 
          delay, 
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: "1200px",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative group cursor-pointer",
          featured && "md:col-span-2"
        )}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 opacity-0 blur-xl transition-opacity duration-500"
          animate={{ opacity: isHovered ? 0.6 : 0 }}
        />

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "glass-card p-6 h-full relative overflow-hidden",
            featured && "border-2 border-gold/30"
          )}
          style={{ 
            transform: "translateZ(50px)",
            transformStyle: "preserve-3d"
          }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "200%" } : { x: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Floating particles */}
          {isHovered && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gold/40 rounded-full"
                  initial={{ 
                    x: Math.random() * 100, 
                    y: 100 + Math.random() * 50,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: -20,
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{ 
                    duration: 1.5 + Math.random(), 
                    delay: i * 0.2,
                    repeat: Infinity
                  }}
                />
              ))}
            </div>
          )}

          {featured && (
            <motion.div 
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
              className="absolute -top-3 left-6 px-4 py-1.5 bg-gradient-to-r from-gold to-gold-light rounded-full shadow-lg"
              style={{ transform: "translateZ(60px)" }}
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
              className="absolute -top-3 right-6 px-3 py-1 bg-secondary border border-border rounded-full"
              style={{ transform: "translateZ(60px)" }}
            >
              <span className="text-xs font-medium text-muted-foreground">Coming Soon</span>
            </motion.div>
          )}

          {/* Logo with 3D pop effect */}
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.15, z: 30 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 flex items-center justify-center mb-4 overflow-hidden shadow-lg"
            style={{ 
              transform: "translateZ(40px)",
              transformStyle: "preserve-3d"
            }}
          >
            <motion.img
              src={logo}
              alt={`${name} logo`}
              className="w-12 h-12 object-contain protected-content"
              whileHover={{ scale: 1.1 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D4AF37&color=0A1628&size=48&bold=true`;
              }}
            />
          </motion.div>

          {/* Content with depth */}
          <motion.h3 
            className={cn(
              "font-display text-xl font-bold mb-2",
              featured ? "text-gradient-gold" : "text-foreground"
            )}
            style={{ transform: "translateZ(30px)" }}
          >
            {name}
          </motion.h3>
          <motion.p 
            className="text-muted-foreground text-sm mb-6 line-clamp-3"
            style={{ transform: "translateZ(20px)" }}
          >
            {description}
          </motion.p>

          {/* Button with enhanced 3D */}
          <motion.div style={{ transform: "translateZ(50px)" }}>
            {isInternalLink ? (
              <Link
                to={link}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
                  isComingSoon
                    ? "bg-secondary border border-border text-muted-foreground hover:bg-secondary/80"
                    : featured
                    ? "bg-gradient-to-r from-gold to-gold-light text-navy hover:opacity-90 shadow-lg hover:shadow-gold/30"
                    : "glass border border-gold/20 text-gold hover:bg-gold/10"
                )}
              >
                <ButtonContent />
              </Link>
            ) : (
              <motion.button
                onClick={handleButtonClick}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                transition={{ type: "spring", stiffness: 400 }}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
                  featured
                    ? "bg-gradient-to-r from-gold to-gold-light text-navy hover:opacity-90 shadow-lg hover:shadow-gold/30"
                    : "glass border border-gold/20 text-gold hover:bg-gold/10"
                )}
              >
                <ButtonContent />
              </motion.button>
            )}
          </motion.div>

          {/* Enhanced hover glow */}
          <motion.div 
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{ 
              boxShadow: isHovered 
                ? "inset 0 0 30px rgba(212, 175, 55, 0.1), 0 0 40px rgba(212, 175, 55, 0.1)" 
                : "inset 0 0 0px transparent, 0 0 0px transparent"
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>

      {/* Telegram Popup */}
      <TelegramPopup 
        isOpen={showTelegramPopup} 
        onClose={() => setShowTelegramPopup(false)} 
      />
    </>
  );
};

export default InstitutionCard;
