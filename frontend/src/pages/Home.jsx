import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    viewport={{ once: true, margin: "-50px" }}
    className="glass-card p-8 rounded-2xl hover:-translate-y-1.5 transition-transform duration-300"
  >
    <div className="w-12 h-12 rounded-xl bg-primary-light border border-[#FDE68A] flex items-center justify-center mb-6 text-primary shadow-sm">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-display font-semibold text-text-primary mb-3 tracking-tight">{title}</h3>
    <p className="text-text-muted leading-relaxed text-sm">{desc}</p>
  </motion.div>
);

const Home = () => {
  return (
    <div className="overflow-hidden bg-background">
      
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-32">
        {/* Background Effects (Updated for Light Mode) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] mix-blend-multiply animate-pulse delay-1000" />
          {/* Very subtle noise for texture */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Version Badge */}
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary-light text-sm font-medium text-primary-hover mb-8 shadow-sm">
                <Sparkles className="w-4 h-4" />
                Introducing Notivo 1.0
              </span>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-text-primary mb-6 leading-[1.05] tracking-tight">
                Write with <span className="text-gradient">absolute</span> clarity.
              </h1>
              
              <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                A premium, distraction-free environment for editorial thinking. 
                Experience cinematic design meets powerful publishing tools.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto gap-2 group shadow-lg shadow-primary/20">
                    Start Writing
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/blogs">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-surface hover:bg-surface-2 text-text-primary border border-border">
                    Explore Stories
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-32 bg-surface-2 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-5 tracking-tight">
              Crafted for creators
            </h2>
            <p className="text-text-secondary text-lg">
              Everything you need to publish world-class content, without the visual noise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard 
              icon={Feather}
              title="Cinematic Editor"
              desc="A rich-text editor that gets out of your way. Formatting tools appear only when you need them."
              delay={0.1}
            />
            <FeatureCard 
              icon={Zap}
              title="Lightning Fast"
              desc="Built on a modern tech stack ensuring your pages load instantly and feel incredibly snappy."
              delay={0.2}
            />
            <FeatureCard 
              icon={Shield}
              title="Secure by Default"
              desc="Enterprise-grade security protecting your content, your data, and your audience."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-subtle" />
        <div className="absolute bottom-0 inset-x-0 h-3/4 bg-gradient-to-t from-background to-transparent" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-text-primary mb-8 tracking-tight">
              Ready to elevate your writing?
            </h2>
            <Link to="/register">
              <Button size="lg" className="px-10 h-14 text-lg shadow-xl shadow-primary/20">
                Join Notivo Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;