import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, ExternalLink, Clock } from "lucide-react";
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

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

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
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 400 }}
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
        initial={{ opacity: 0, y: 50, rotateX: -15 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, type: "spring" }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative group cursor-pointer",
          featured && "md:col-span-2"
        )}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "glass-card p-6 h-full",
            featured && "border border-gold/20"
          )}
          style={{ transform: "translateZ(50px)" }}
        >
          {featured && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3, type: "spring" }}
              className="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-gold to-gold-light rounded-full"
            >
              <span className="text-xs font-bold text-navy">✨ Featured</span>
            </motion.div>
          )}

          {isComingSoon && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 }}
              className="absolute -top-3 right-6 px-3 py-1 bg-secondary border border-border rounded-full"
            >
              <span className="text-xs font-medium text-muted-foreground">Coming Soon</span>
            </motion.div>
          )}

          {/* Logo */}
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4 overflow-hidden"
            style={{ transform: "translateZ(30px)" }}
          >
            <img
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
            "font-display text-xl font-bold mb-2",
            featured ? "text-gradient-gold" : "text-foreground"
          )}>
            {name}
          </h3>
          <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
            {description}
          </p>

          {/* Button */}
          {isInternalLink ? (
            <Link
              to={link}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 btn-3d",
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
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 btn-3d",
                featured
                  ? "bg-gradient-to-r from-gold to-gold-light text-navy hover:opacity-90"
                  : "glass border border-gold/20 text-gold hover:bg-gold/10"
              )}
            >
              <ButtonContent />
            </motion.button>
          )}

          {/* Hover glow effect - subtle */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/3 via-transparent to-gold/3" />
          </div>
        </motion.div>
      </motion.div>

      {/* Telegram Popup */}
      <TelegramPopup isOpen={showTelegramPopup} onClose={() => setShowTelegramPopup(false)} />
    </>
  );
};

export default InstitutionCard;
