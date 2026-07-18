import Navbar from '@/components/ui/Navbar';
import { Brain, Clock, AlertTriangle, CheckCircle, Zap, BookOpen } from 'lucide-react';

const CONCEPTS = [
  {
    term: 'Perceptron',
    color: '#6C63FF',
    definition: 'A single artificial neuron — the simplest form of a neural network. It takes multiple binary inputs, multiplies each by a weight, sums them up, and passes the result through a step activation function to produce a binary output (0 or 1).',
  },
  {
    term: 'Weighted Sum (net input)',
    color: '#00D4FF',
    definition: 'net = x₁·w₁ + x₂·w₂ + ... + xₙ·wₙ + bias. Each input is multiplied by its corresponding weight. A higher weight means that input has more influence on the output.',
  },
  {
    term: 'Threshold Activation',
    color: '#FF6B9D',
    definition: 'The step function: if net ≥ θ (threshold), output = 1, else output = 0. This mimics how a biological neuron fires or does not fire depending on whether input stimulation crosses a critical level.',
  },
  {
    term: 'Error',
    color: '#FF4444',
    definition: 'error = target − predicted. If the perceptron predicts correctly, error = 0 and no update happens. If error ≠ 0, weights must be adjusted.',
  },
  {
    term: 'Perceptron Learning Rule',
    color: '#00FF94',
    definition: 'w_new = w_old + η × error × input and b_new = b_old + η × error. The weight update is proportional to the learning rate, the error, and the input value that caused the error.',
  },
  {
    term: 'Learning Rate (η)',
    color: '#FFB800',
    definition: 'A hyperparameter that controls how large each weight update step is. Too large → overshooting. Too small → slow learning. Typical values: 0.01–0.5.',
  },
  {
    term: 'Epoch',
    color: '#6C63FF',
    definition: 'One complete pass through the entire training dataset. The perceptron may need multiple epochs before converging (all errors = 0). AND gate typically converges in 1–5 epochs.',
  },
  {
    term: 'Bias',
    color: '#FFB800',
    definition: 'An additional adjustable parameter (independent of any input) that shifts the activation threshold. It allows the perceptron to learn functions that do not pass through the origin.',
  },
  {
    term: 'Linear Separability',
    color: '#FF6B9D',
    definition: 'A dataset is linearly separable if a single straight line (in 2D) or hyperplane (in nD) can separate the 0-class and 1-class data points. AND, OR, NAND, NOR are linearly separable. XOR is NOT.',
  },
  {
    term: 'Convergence',
    color: '#00FF94',
    definition: 'Training converges when all training samples are classified correctly (zero errors across a full epoch). The Perceptron Convergence Theorem guarantees convergence for linearly separable datasets.',
  },
];

const GATES = [
  { name: 'AND', truth: [[0,0,0],[0,1,0],[1,0,0],[1,1,1]], separable: true },
  { name: 'OR',  truth: [[0,0,0],[0,1,1],[1,0,1],[1,1,1]], separable: true },
  { name: 'NAND',truth: [[0,0,1],[0,1,1],[1,0,1],[1,1,0]], separable: true },
  { name: 'NOR', truth: [[0,0,1],[0,1,0],[1,0,0],[1,1,0]], separable: true },
  { name: 'XOR', truth: [[0,0,0],[0,1,1],[1,0,1],[1,1,0]], separable: false },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
            <BookOpen size={14} /> Educational Reference
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            About the <span className="gradient-text">Perceptron</span>
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            The perceptron is the foundational building block of all modern neural networks.
            Understanding it deeply unlocks the entire field of machine learning.
          </p>
        </div>

        {/* History */}
        <div className="glass-card p-8 mb-8" style={{ border: '1px solid rgba(108,99,255,0.2)' }}>
          <div className="flex items-center gap-3 mb-5">
            <Clock size={20} className="text-[#6C63FF]" />
            <h2 className="text-xl font-bold gradient-text">History</h2>
          </div>
          <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed">
            <p>
              The perceptron was invented by <strong className="text-white">Frank Rosenblatt</strong> in <strong className="text-white">1957</strong> at the Cornell Aeronautical Laboratory. Inspired by biological neurons, it was implemented in hardware as the <em>Mark I Perceptron</em> — a machine that could learn to distinguish simple patterns.
            </p>
            <p>
              Rosenblatt proved the <strong className="text-white">Perceptron Convergence Theorem</strong>: if the training data is linearly separable, the learning algorithm is guaranteed to find a solution in a finite number of steps.
            </p>
            <p>
              In <strong className="text-white">1969</strong>, Minsky and Papert published <em>Perceptrons</em>, showing the single-layer perceptron cannot solve XOR, leading to the first <em>AI Winter</em>. This was overcome in the 1980s with the development of <strong className="text-white">multi-layer perceptrons (MLP)</strong> and <strong className="text-white">backpropagation</strong>, which form the basis of all modern deep learning.
            </p>
          </div>
        </div>

        {/* Advantages & Disadvantages */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="glass-card p-6" style={{ border: '1px solid rgba(0,255,148,0.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={18} className="text-[#00FF94]" />
              <h3 className="font-bold text-[#00FF94]">Advantages</h3>
            </div>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              {['Simple and easy to understand','Fast training for linearly separable data','Guaranteed convergence theorem','Foundation for deeper neural networks','No hidden layers needed for simple problems'].map(a => (
                <li key={a} className="flex items-start gap-2"><span className="text-[#00FF94] mt-0.5">✓</span>{a}</li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-6" style={{ border: '1px solid rgba(255,68,68,0.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-[#FF4444]" />
              <h3 className="font-bold text-[#FF4444]">Disadvantages</h3>
            </div>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              {['Cannot solve non-linearly separable problems','Limited to binary classification','No probabilistic outputs','Cannot model complex decision boundaries','Only works with binary inputs (classic version)'].map(a => (
                <li key={a} className="flex items-start gap-2"><span className="text-[#FF4444] mt-0.5">✗</span>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logic Gates */}
        <div className="glass-card p-8 mb-8" style={{ border: '1px solid rgba(0,212,255,0.2)' }}>
          <h2 className="text-xl font-bold gradient-text mb-6">Logic Gate Truth Tables</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {GATES.map(gate => (
              <div key={gate.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${gate.separable ? 'rgba(0,255,148,0.2)' : 'rgba(255,68,68,0.2)'}` }}>
                <div className="flex items-center justify-between px-3 py-2" style={{ background: gate.separable ? 'rgba(0,255,148,0.08)' : 'rgba(255,68,68,0.08)' }}>
                  <span className="font-bold text-sm font-mono">{gate.name}</span>
                  <span className={`text-[10px] ${gate.separable ? 'text-[#00FF94]' : 'text-[#FF4444]'}`}>
                    {gate.separable ? 'LS' : 'NOT LS'}
                  </span>
                </div>
                <table className="w-full text-xs font-mono text-center">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <th className="py-1.5 text-[var(--text-muted)]">A</th>
                      <th className="py-1.5 text-[var(--text-muted)]">B</th>
                      <th className="py-1.5 text-[var(--text-muted)]">Y</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gate.truth.map(([a, b, y], i) => (
                      <tr key={i} style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                        <td className="py-1">{a}</td>
                        <td className="py-1">{b}</td>
                        <td className="py-1" style={{ color: y === 1 ? '#00FF94' : '#FF6B9D', fontWeight: 700 }}>{y}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3">LS = Linearly Separable</p>
        </div>

        {/* Concepts */}
        <div className="mb-8">
          <h2 className="text-xl font-bold gradient-text mb-6">Key Concepts</h2>
          <div className="space-y-3">
            {CONCEPTS.map(({ term, color, definition }) => (
              <details key={term} className="glass-card" style={{ border: `1px solid ${color}22` }}>
                <summary className="px-6 py-4 cursor-pointer flex items-center gap-3 font-semibold text-sm select-none">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  {term}
                </summary>
                <div className="px-6 pb-4 text-[var(--text-muted)] text-sm leading-relaxed border-t" style={{ borderColor: `${color}20` }}>
                  {definition}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Applications */}
        <div className="glass-card p-8" style={{ border: '1px solid rgba(255,107,157,0.2)' }}>
          <div className="flex items-center gap-3 mb-5">
            <Zap size={20} className="text-[#FF6B9D]" />
            <h2 className="text-xl font-bold gradient-text-accent">Applications</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['Pattern Recognition', 'Handwriting, image classification'],
              ['Logic Gates', 'AND, OR, NAND, NOR computation'],
              ['Medical Diagnosis', 'Binary disease classification'],
              ['Spam Detection', 'Email spam vs. not spam'],
              ['Credit Approval', 'Approve or deny loan applications'],
              ['Sentiment Analysis', 'Positive vs. negative reviews'],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,107,157,0.05)', border: '1px solid rgba(255,107,157,0.1)' }}>
                <span className="text-[#FF6B9D] mt-0.5">▸</span>
                <div>
                  <div className="font-semibold text-sm">{title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
