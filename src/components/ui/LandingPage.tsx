import React, { useState, useEffect, memo, forwardRef, useRef } from "react";
import {
  ArrowRight,
  Menu,
  X,
  Zap,
  Layout,
  ShieldCheck,
  Sparkles,
  FileText,
  Target,
  FastForward,
  Layers,
  Mic,
  Database,
  Cpu,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Logo } from "./Logo";
import { SparklesCore } from "./sparkles";
import { FeatureCard } from "./grid-feature-cards";
import dashboardPreview from "../../assets/dashboard-preview.png";

/* ─── Custom SVG Icon ─── */
const GithubIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

/* ─── Scroll-Fade Section Wrapper ─── */
const FadeSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15], [60, 0]);
  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
};

/* ─── UI Primitives ─── */
const Button = forwardRef<HTMLButtonElement, any>(({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
  const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
  const v: Record<string, string> = {
    default: "bg-white text-zinc-950 hover:bg-zinc-200",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
    ghost: "hover:bg-zinc-800/50 text-white",
    gradient: "bg-gradient-to-b from-white via-white/95 to-zinc-400 text-black hover:scale-[1.02] active:scale-95 shadow-lg shadow-white/10",
  };
  const s: Record<string, string> = { default: "h-10 px-4 py-2 text-sm", sm: "h-9 px-4 text-xs", lg: "h-12 px-8 text-base" };
  return <button ref={ref} className={`${base} ${v[variant]} ${s[size]} ${className}`} {...props}>{children}</button>;
});
Button.displayName = "Button";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 ${className}`}>{children}</div>
);

/* ─── Inline Keyframe Styles (no external CSS dependency) ─── */
const heroStyles = `
@keyframes hero-float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -20px) scale(1.05); }
  50% { transform: translate(-20px, 15px) scale(0.95); }
  75% { transform: translate(15px, 25px) scale(1.08); }
}
@keyframes hero-float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 20px) scale(1.1); }
  66% { transform: translate(25px, -15px) scale(0.92); }
}
@keyframes hero-float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  30% { transform: translate(20px, 30px) scale(1.12); }
  60% { transform: translate(-30px, -20px) scale(0.88); }
}
@keyframes hero-glow {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.3; }
}
`;

/* ─── Navigation ─── */
const Navigation = memo(({ onAuthClick }: { onAuthClick: () => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "border-b border-zinc-800/50 bg-black/80 backdrop-blur-md" : "bg-transparent"}`}>
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={32} className="text-white" />
            <span className="text-xl font-bold tracking-tighter text-white">PromptOrb</span>
          </div>
          <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {["Why PRD?", "Features", "Architect"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-").replace("?", "")}`} className="text-sm text-zinc-400 hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onAuthClick}>Sign in</Button>
            <Button variant="default" size="sm" className="rounded-full px-6" onClick={onAuthClick}>Sign Up</Button>
          </div>
          <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-zinc-950 border-t border-zinc-800/50 overflow-hidden">
            <div className="px-6 py-8 flex flex-col gap-6">
              {["Why PRD?", "Features", "Architect"].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(" ", "-").replace("?", "")}`} className="text-lg text-zinc-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>{item}</a>
              ))}
              <div className="pt-4 border-t border-zinc-900 flex flex-col gap-3">
                <Button variant="ghost" onClick={onAuthClick}>Sign in</Button>
                <Button variant="default" onClick={onAuthClick}>Sign Up</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});
Navigation.displayName = "Navigation";

/* ─── Hero Section ─── */
const Hero = memo(({ onAuthClick }: { onAuthClick: () => void }) => (
  <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
    {/* Inject keyframes */}
    <style>{heroStyles}</style>

    {/* Animated mesh blobs — position:absolute, fully self-contained */}
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div
        style={{
          position: "absolute", top: "-15%", left: "-10%",
          width: "55vw", height: "55vw",
          background: "radial-gradient(circle, rgba(39, 39, 42, 0.5) 0%, transparent 70%)",
          filter: "blur(80px)", borderRadius: "50%", opacity: 0.6,
          animation: "hero-float-1 18s infinite ease-in-out",
        }}
      />
      <div
        style={{
          position: "absolute", bottom: "-15%", right: "-10%",
          width: "60vw", height: "60vw",
          background: "radial-gradient(circle, rgba(63, 63, 70, 0.35) 0%, transparent 70%)",
          filter: "blur(90px)", borderRadius: "50%", opacity: 0.5,
          animation: "hero-float-2 22s infinite ease-in-out",
        }}
      />
      <div
        style={{
          position: "absolute", top: "25%", left: "35%",
          width: "45vw", height: "45vw",
          background: "radial-gradient(circle, rgba(82, 82, 91, 0.2) 0%, transparent 70%)",
          filter: "blur(70px)", borderRadius: "50%", opacity: 0.4,
          animation: "hero-float-3 15s infinite ease-in-out",
        }}
      />
      {/* Center glow pulse */}
      <div
        style={{
          position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
          width: "40vw", height: "40vw",
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)",
          filter: "blur(60px)", borderRadius: "50%",
          animation: "hero-glow 6s infinite ease-in-out",
        }}
      />
    </div>

    {/* Sparkles particle overlay */}
    <div className="absolute inset-0" style={{ zIndex: 1 }}>
      <SparklesCore
        background="transparent"
        minSize={0.4}
        maxSize={1.2}
        particleDensity={50}
        particleColor="#ffffff"
        speed={0.3}
      />
    </div>

    {/* Hero content */}
    <div className="max-w-5xl mx-auto text-center relative" style={{ zIndex: 10 }}>
      <motion.aside initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <Sparkles size={14} className="text-zinc-200" />
        <span className="text-xs text-zinc-400">Synthesizing the Future of Development</span>
      </motion.aside>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-semibold text-center max-w-4xl leading-[1.1] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 tracking-tight">
        Give your big vision <br />the architecture it deserves
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-sm md:text-xl text-center text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
        PromptOrb is a premium, AI-driven architect that transforms raw visions into structured, actionable development roadmaps.
      </motion.p>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-4 justify-center">
        <Button variant="gradient" size="lg" className="rounded-xl px-10" onClick={onAuthClick}>Start Architecting <ArrowRight size={18} className="ml-2" /></Button>
      </motion.div>
    </div>
  </section>
));
Hero.displayName = "Hero";

/* ─── Dashboard Showcase with scroll parallax ─── */
const DashboardShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.3], [8, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

  return (
    <section ref={containerRef} className="py-24 px-6 bg-zinc-950 border-t border-zinc-900/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div style={{ opacity }} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-4 tracking-tight">The Architect's Workspace</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Manage your projects with a streamlined, professional interface designed for technical clarity.</p>
        </motion.div>
        <motion.div style={{ y, rotateX, scale, perspective: 1200 }} className="relative group mx-auto max-w-5xl">
          <div className="absolute -inset-4 bg-gradient-to-r from-zinc-500/10 via-zinc-400/5 to-zinc-800/10 rounded-[2rem] blur-3xl opacity-60" />
          <div className="relative rounded-[1.25rem] overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50">
            <img src={dashboardPreview} alt="PromptOrb Dashboard" className="w-full h-auto block" loading="lazy" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── PRD Section ─── */
const PRDSection = () => (
  <section id="why-prd" className="py-32 px-6 bg-zinc-950 relative border-t border-zinc-900/50">
    <div className="max-w-7xl mx-auto">
      <FadeSection>
        <div className="flex flex-col md:flex-row gap-16 items-start">
          <div className="md:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-6">
              <FileText size={14} /><span>Blueprint Foundation</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-8 tracking-tight">What is a <span className="text-zinc-500 italic">PRD?</span></h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              A <strong>Product Requirements Document</strong> is the source of truth. It defines purpose and functionality before a single line of code is written.
            </p>
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 italic text-zinc-500 text-sm">
              "Without a PRD, development is just guessing. PromptOrb turns guessing into architecture."
            </div>
          </div>
          <div className="md:w-2/3 grid sm:grid-cols-2 gap-6">
            <GlassCard className="col-span-full border-zinc-800/80 mb-4">
              <h3 className="text-xl font-bold text-zinc-100 mb-4">The PromptOrb Protocol</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">Our engine treats the PRD as a high-fidelity blueprint. It parses user stories and technical constraints to generate granular checklists.</p>
              <div className="flex flex-wrap gap-2">
                {["User Stories", "Technical Stack", "MVP Boundaries", "UI Specs"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{tag}</span>
                ))}
              </div>
            </GlassCard>
            {[
              { title: "Strategic Alignment", description: "Every stakeholder understands the core 'Why' behind every feature.", icon: Target },
              { title: "Clarity & Scoping", description: "Avoid 'Scope Creep' by defining explicit boundaries for a lean MVP.", icon: ShieldCheck },
              { title: "Accelerated Dev", description: "Reducing ambiguity leads to faster code synthesis.", icon: FastForward },
              { title: "Technical Mastery", description: "Synthesize roadmaps from PRDs in seconds.", icon: Zap },
            ].map((b, i) => (
              <FeatureCard key={i} feature={b} className="bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900 transition-all rounded-3xl" />
            ))}
          </div>
        </div>
      </FadeSection>
    </div>
  </section>
);

/* ─── Feature Grid ─── */
const FeatureGrid = () => (
  <section id="features" className="py-24 px-6 bg-zinc-950 border-t border-zinc-900/50">
    <div className="max-w-7xl mx-auto">
      <FadeSection>
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-4 tracking-tight">Technical Powerhouse</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Precision-engineered for the modern architect who needs more than just code.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "Architecture Synthesis", desc: "Full-stack blueprints with granular checklists.", icon: <Layers className="text-zinc-100" /> },
            { title: "Voice-to-Text", desc: "Hands-free project ideation in real-time.", icon: <Mic className="text-zinc-100" /> },
            { title: "Supabase Persistence", desc: "Roadmaps saved to your personal repository.", icon: <Database className="text-zinc-100" /> },
            { title: "Gooey Synthesis", desc: "Visualizing AI 'thinking' during roadmap generation.", icon: <Zap className="text-zinc-100" /> },
          ].map((f, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-xl font-bold text-zinc-100 mb-3">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </FadeSection>
    </div>
  </section>
);

/* ─── Architect Hub ─── */
const ArchitectHub = () => (
  <section id="architect" className="py-32 px-6 bg-zinc-950 relative overflow-hidden border-t border-zinc-900/50">
    <div className="max-w-7xl mx-auto">
      <FadeSection>
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-6">
              <Layout size={14} /><span>Architect Hub</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-zinc-100 mb-8 tracking-tighter leading-tight">
              From vision to <span className="text-zinc-500">technical mastery.</span>
            </h2>
            <ul className="space-y-4 mb-10">
              {["Interactive mesh backgrounds", "Sleek glassmorphism panels", "Real-time roadmap persistence", "Full-stack synthesis"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300 font-medium">
                  <CheckCircle size={20} className="text-zinc-500" /> {item}
                </li>
              ))}
            </ul>
            <Button variant="secondary" size="lg" className="rounded-xl">Explore Documentation</Button>
          </div>
          <div className="lg:w-1/2 w-full relative">
            <div className="absolute -inset-1 bg-zinc-100/10 blur-3xl rounded-full" />
            <GlassCard className="p-0 overflow-hidden border-zinc-700/50 shadow-2xl relative z-10">
              <div className="bg-zinc-800/50 p-4 border-b border-zinc-700/50 flex justify-between">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-zinc-700" /><div className="w-3 h-3 rounded-full bg-zinc-700" /></div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Synthesis Engine v2.5</span>
              </div>
              <div className="p-8 space-y-8">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-sm text-zinc-400 italic">"Build a premium AI playlist curator with Spotify API..."</div>
                <div className="flex justify-center">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center shadow-lg">
                    <Cpu size={24} className="text-black" />
                  </motion.div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3 ${i === 3 ? "opacity-40" : ""}`}>
                      <span className="text-[10px] font-bold text-zinc-600">{i}</span>
                      <span className="text-xs text-zinc-200">{i === 1 ? "OAuth2 Security Layer" : i === 2 ? "Vector DB Mood Analysis" : "Frontend Frame system..."}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </FadeSection>
    </div>
  </section>
);

/* ─── Main Export ─── */
export default function LandingPage({ onAuthClick }: { onAuthClick: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-white selection:text-zinc-950">
      <Navigation onAuthClick={onAuthClick} />
      <main>
        <Hero onAuthClick={onAuthClick} />
        <DashboardShowcase />
        <PRDSection />
        <FeatureGrid />
        <ArchitectHub />

        <section className="py-32 px-6 relative border-t border-zinc-900/50">
          <FadeSection>
            <div className="max-w-5xl mx-auto rounded-[3rem] bg-white p-12 md:p-24 text-zinc-950 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-900/5 blur-[80px] rounded-full" />
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">Ready to map your vision?</h2>
              <p className="text-zinc-600 text-xl mb-12 max-w-xl mx-auto font-medium">Join the elite architects building the next generation of masterpieces.</p>
              <Button size="lg" className="rounded-2xl px-12 py-8 text-2xl bg-zinc-950 text-white hover:bg-zinc-800 shadow-xl transition-all hover:scale-105 active:scale-95" onClick={onAuthClick}>Get Started for Free</Button>
            </div>
          </FadeSection>
        </section>
      </main>

      <footer className="bg-zinc-950 border-t border-zinc-900 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Logo size={24} className="text-white" />
            <span className="text-xl font-bold tracking-tighter text-white">PromptOrb</span>
          </div>
          <p className="text-zinc-600 text-xs">© 2026 PromptOrb Architecture Studio. Built for the future of development.</p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="p-2 bg-zinc-900 rounded-lg text-white hover:bg-zinc-800"><GithubIcon size={18} /></Button>
            <Button variant="ghost" size="sm" className="p-2 bg-zinc-900 rounded-lg text-white hover:bg-zinc-800"><Sparkles size={18} /></Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
