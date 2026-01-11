import { motion } from "framer-motion";
import { Shield, AlertTriangle, Mail, MessageCircle } from "lucide-react";

const DisclaimerSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6 md:p-8 border border-gold/10 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gold/5 to-transparent rounded-tr-full" />

          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <Shield className="w-6 h-6 text-gold" />
              </motion.div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                Important Notice & Disclaimer
              </h3>
            </motion.div>

            {/* Content */}
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-foreground">EduSpark Reloaded</strong> is a non-profit educational initiative 
                  dedicated to making quality education accessible to all students across India. We firmly believe 
                  in the democratization of education and equal learning opportunities for everyone, regardless of 
                  their financial background.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-3"
              >
                <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <p>
                  We want to make it unequivocally clear that <strong className="text-foreground">we do not support, 
                  endorse, or promote piracy in any form</strong>. All the content and resources shared through this 
                  platform are materials that are already publicly available on the internet and accessible through 
                  legitimate channels.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-3"
              >
                <MessageCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <p>
                  Our sole purpose is to aggregate and organize these freely available educational resources in 
                  one convenient location, making it easier for students to discover and access learning materials 
                  that can help them achieve their academic goals.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex items-start gap-3"
              >
                <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <p>
                  If you are a content creator, educational institution, or rights holder and believe that any 
                  content linked through our platform infringes upon your intellectual property rights or violates 
                  any terms of service, <strong className="text-foreground">please contact us immediately</strong>. 
                  We commit to addressing your concerns promptly and will take appropriate action, including removal 
                  of the concerned material, within a reasonable timeframe.
                </p>
              </motion.div>
            </div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mt-6 pt-6 border-t border-border text-center"
            >
              <p className="text-sm text-muted-foreground">
                For any concerns or inquiries, please reach out to our support team via Telegram.
              </p>
              <motion.a
                href="https://t.me/Me_Nitesh"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl glass border border-gold/20 text-gold text-sm font-medium transition-all hover:bg-gold/10"
              >
                <Mail className="w-4 h-4" />
                Contact Support Team
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DisclaimerSection;
