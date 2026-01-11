import { motion } from "framer-motion";
import { Send, MessageCircle, Users, User } from "lucide-react";

const ContactSection = () => {
  const contacts = [
    {
      name: "Telegram Channel 1",
      description: "Main updates & announcements",
      link: "https://t.me/+JkDtn9klaYtlMjA1",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
    },
    {
      name: "Telegram Channel 2",
      description: "Community discussions",
      link: "https://t.me/+4rAfCNku8DBjZDdl",
      icon: MessageCircle,
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
    },
    {
      name: "WhatsApp Channel",
      description: "Quick updates on WhatsApp",
      link: "https://whatsapp.com/channel/0029VaoeKYx3mFYErON0tj0P",
      icon: Send,
      color: "from-green-500 to-emerald-500",
      iconBg: "bg-green-500/10",
    },
    {
      name: "Contact Creator",
      description: "Direct message to Nitesh",
      link: "https://t.me/Me_Nitesh",
      icon: User,
      color: "from-gold to-gold-light",
      iconBg: "bg-gold/10",
    },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold-light mb-4"
          >
            <Send className="w-8 h-8 text-navy" />
          </motion.div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Get in Touch
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connect with us on your preferred platform for updates, resources, and support.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-gold to-gold-light mx-auto rounded-full mt-4" />
        </motion.div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacts.map((contact, index) => (
            <motion.a
              key={contact.name}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
              whileHover={{ 
                scale: 1.03, 
                y: -5,
                rotateY: 5,
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)"
              }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-5 flex items-center gap-4 group cursor-pointer relative overflow-hidden"
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              {/* Hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${contact.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className={`w-12 h-12 rounded-xl ${contact.iconBg} flex items-center justify-center flex-shrink-0`}
                style={{ transform: "translateZ(30px)" }}
              >
                <contact.icon className={`w-6 h-6 bg-gradient-to-r ${contact.color} bg-clip-text`} style={{ color: contact.color.includes("gold") ? "hsl(var(--gold))" : undefined }} />
              </motion.div>

              {/* Content */}
              <div className="flex-1 relative z-10">
                <h3 className="font-display font-bold text-foreground group-hover:text-gold transition-colors">
                  {contact.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {contact.description}
                </p>
              </div>

              {/* Arrow */}
              <motion.span
                className="text-muted-foreground group-hover:text-gold transition-colors"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
