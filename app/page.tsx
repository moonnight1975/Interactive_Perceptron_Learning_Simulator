import Link from 'next/link';
import { Brain, Zap, BarChart3, BookOpen, ArrowRight, ChevronRight, Cpu, GitBranch, Layers } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';

const FEATURES = [
  {
    icon: Brain,
    color: '#6C63FF',
    title: 'Auto Learning',
    desc: 'Watch the perceptron adjust weights automatically until it correctly predicts every input. Step-by-step animation.',
  },
  {
    icon: BarChart3,
    color: '#00D4FF',
    title: 'Live Analytics',
    desc: 'Real-time charts track W₁, W₂, bias, and error across every training step and epoch.',
  },
  {
    icon: Zap,
    color: '#FF6B9D',
    title: 'Mathematical Clarity',
    desc: 'Every step explained with actual numbers substituted into formulas. Learn the perceptron learning rule deeply.',
  },
  {
    icon: Cpu,
    color: '#00FF94',
    title: 'Network Visualization',
    desc: 'Animated SVG neural network shows signal flow, weight magnitudes, and activation in real time.',
  },
  {
    icon: GitBranch,
    color: '#FFB800',
    title: 'Logic Gate Library',
    desc: 'Pre-loaded datasets for AND, OR, NAND, NOR. XOR comes with educational explanation of linear separability.',
  },
  {
    icon: Layers,
    color: '#FF6B9D',
    title: 'Full Control',
    desc: 'Tune learning rate, threshold, epochs, and weights. Play, pause, step through, or jump instantly to the end.',
  },
];

const STEPS = [
  { n: '01', title: 'Configure', desc: 'Select a logic gate, set hyperparameters, choose initial weights' },
  { n: '02', title: 'Train', desc: 'Click Train — the perceptron immediately computes all steps' },
  { n: '03', title: 'Visualize', desc: 'Play the animation, step through, or view charts and the training table' },
  { n: '04', title: 'Converge', desc: 'Training stops when all outputs match targets or max epochs reached' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-16">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)' }} />

        <div className="text-center max-w-5xl mx-auto relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 badge badge-primary text-sm">
            <span className="w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse" />
            Interactive AI Learning Lab
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Interactive
            <br />
            <span className="gradient-text">Perceptron</span>
            <br />
            Learning Simulator
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Learn how AI adjusts its weights <strong className="text-white">automatically</strong> until it predicts
            the correct answer. Watch a perceptron learn logic gates step by step — with live animations,
            charts, and mathematical explanations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/simulation" className="neon-btn neon-btn-primary text-base px-8 py-4">
              <Brain size={20} /> Start Simulation
              <ArrowRight size={16} />
            </Link>
            <Link href="/about" className="neon-btn neon-btn-secondary text-base px-8 py-4">
              <BookOpen size={20} /> About Perceptron
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 justify-center mt-16">
            {[
              { value: '5', label: 'Logic Gates' },
              { value: '∞', label: 'Custom Datasets' },
              { value: '4', label: 'Live Charts' },
              { value: '100%', label: 'Client-Side' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black gradient-text">{value}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────── */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Everything You Need to <span className="gradient-text">Understand AI</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            A complete learning environment for engineering students and AI enthusiasts.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="glass-card glass-card-hover p-6 space-y-3" style={{ border: `1px solid ${color}22` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-1" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="font-bold text-base">{title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────── */}
      <section className="px-6 py-20" style={{ background: 'rgba(108,99,255,0.03)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black mb-4">How It <span className="gradient-text">Works</span></h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map(({ n, title, desc }, i) => (
              <div key={n} className="relative text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center font-mono font-black text-lg" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,212,255,0.2))', border: '1px solid rgba(108,99,255,0.3)' }}>
                  <span className="gradient-text">{n}</span>
                </div>
                <h3 className="font-bold mb-2 text-sm">{title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+36px)] right-[-50%]">
                    <ChevronRight size={16} className="text-[rgba(108,99,255,0.4)] mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto glass-card p-10" style={{ border: '1px solid rgba(108,99,255,0.3)' }}>
          <div className="text-5xl mb-4 animate-float">🧠</div>
          <h2 className="text-3xl font-black mb-3">
            Ready to Watch AI <span className="gradient-text">Learn?</span>
          </h2>
          <p className="text-[var(--text-muted)] mb-8">
            Open the simulator and train your first perceptron in seconds.
          </p>
          <Link href="/simulation" className="neon-btn neon-btn-primary text-base px-10 py-4 inline-flex">
            <Zap size={18} /> Launch Simulator
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t text-center py-6 text-xs text-[var(--text-muted)]" style={{ borderColor: 'var(--glass-border)' }}>
        Perceptron Learning Simulator · Built for Engineering Education
      </footer>
    </div>
  );
}
