import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, MapPin, Calendar, BookOpen, Code, Palette, Terminal, Database, Cpu, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

interface Creator {
  name: string;
  nickname: string;
  image: string;
  location: string;
  birthday: string;
  preparation: string;
  description: string;
  skills: { name: string; icon: React.ElementType }[];
}

const creators: Creator[] = [
  {
    name: "Nitesh Prakash",
    nickname: "EduSpark / Sparky",
    image: "https://i.postimg.cc/P5nW2dXn/IMG-20260111-223737.jpg",
    location: "Bihar, Bharat 🇮🇳",
    birthday: "26 November",
    preparation: "NEET (PCMB)",
    description: "Passionate about making quality education accessible to everyone.",
    skills: [
      { name: "Python", icon: Terminal },
      { name: "Node.js", icon: Database },
      { name: "TypeScript", icon: Code },
      { name: "UI/UX Designer", icon: Palette },
      { name: "Frontend Dev", icon: Code },
      { name: "Backend Dev", icon: Database },
    ],
  },
  {
    name: "Shivam Kumar",
    nickname: "Tech Shivam",
    image: "https://i.postimg.cc/htWnS6dV/IMG-20260113-WA0015.jpg",
    location: "Bihar, Bharat 🇮🇳",
    birthday: "06 January",
    preparation: "JEE (PCM)",
    description: "Building the future of accessible technology and education.",
    skills: [
      { name: "HTML", icon: Code },
      { name: "Java", icon: Cpu },
      { name: "JavaScript", icon: Terminal },
      { name: "Backend Support", icon: Database },
      { name: "Python", icon: Terminal },
      { name: "C++", icon: Code },
    ],
  },
];

const CreatorCard = ({ creator, index }: { creator: Creator; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smoother springs with higher damping to prevent flickering
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 25 });

  // Reduced rotation for smoother, less jittery feel
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

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

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {/* Subtle floating particles - reduced for performance */}
      {isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold/50 rounded-full pointer-events-none"
              style={{
                left: `${30 + i * 20}%`,
                top: "50%",
              }}
              animate={{ 
                y: [-20, -60],
                opacity: [0, 0.8, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}

      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative overflow-hidden rounded-3xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Static gradient background for performance */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-purple-500/5 to-blue-500/5" />

        {/* Glass morphism card */}
        <div className="relative backdrop-blur-md bg-background/50 border border-gold/20 p-8 rounded-3xl">
          {/* Simple shine effect on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}

          {/* Simple border highlight on hover */}
          {isHovered && (
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none border border-gold/30"
            />
          )}

          <div className="flex flex-col items-center text-center relative z-10">
            {/* Avatar with subtle 3D effect */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative mb-6"
            >
              {/* Subtle ring */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-gold/40 via-yellow-400/30 to-gold-light/40 opacity-60" />
              
              {/* Avatar container */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-3 border-gold/30">
                <img 
                  src={creator.image}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Flag badge */}
              <motion.div 
                className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-gradient-to-r from-gold to-gold-light flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-lg">🇮🇳</span>
              </motion.div>
            </motion.div>

            {/* Name with 3D depth */}
            <motion.h3 
              className="font-display text-2xl md:text-3xl font-bold mb-1"
              style={{ transform: "translateZ(30px)" }}
            >
              <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold-light bg-clip-text text-transparent">
                {creator.name}
              </span>
            </motion.h3>

            <motion.p 
              className="text-muted-foreground font-medium mb-4"
              style={{ transform: "translateZ(20px)" }}
            >
              Also known as <span className="text-gold font-bold">{creator.nickname}</span>
            </motion.p>

            {/* Info grid with 3D cards */}
            <motion.div 
              className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-6 w-full"
              style={{ transform: "translateZ(15px)" }}
            >
              {[
                { icon: MapPin, text: creator.location },
                { icon: Calendar, text: `Birthday: ${creator.birthday}` },
                { icon: BookOpen, text: `Preparing for ${creator.preparation}` },
                { icon: Heart, text: "Building for better education" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 bg-background/30 backdrop-blur-sm rounded-xl px-3 py-2 border border-border/50"
                >
                  <item.icon className="w-4 h-4 text-gold flex-shrink-0" />
                  <span className="text-xs truncate">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p 
              className="text-foreground/80 text-sm leading-relaxed mb-6"
              style={{ transform: "translateZ(10px)" }}
            >
              {creator.description}
            </motion.p>

            {/* Skills Section with 3D floating pills */}
            <motion.div 
              className="w-full"
              style={{ transform: "translateZ(25px)" }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Skills & Expertise
                </span>
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                {creator.skills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ 
                      scale: 1.1, 
                      y: -5,
                      boxShadow: "0 10px 20px -5px rgba(212, 175, 55, 0.4)",
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 rounded-full cursor-default"
                  >
                    <skill.icon className="w-3 h-3 text-gold" />
                    <span className="text-xs font-medium text-foreground">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const OwnerSection = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-foreground">Meet The Team</span>
            <Sparkles className="w-4 h-4 text-gold" />
          </motion.div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            About the <span className="text-gradient-gold">Creators</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full" />
        </motion.div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {creators.map((creator, index) => (
            <CreatorCard key={creator.name} creator={creator} index={index} />
          ))}
        </div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-muted-foreground text-sm mt-16"
        >
          © 2024 EduSpark Reloaded. Built with ❤️ for students everywhere.
        </motion.p>
      </div>
    </section>
  );
};

export default OwnerSection;