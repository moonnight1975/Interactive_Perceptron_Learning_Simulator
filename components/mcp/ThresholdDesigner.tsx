'use client';
import { useState, useEffect } from 'react';
import { calculateThreshold } from '@/lib/mcpNeuron';
import { Calculator, Sparkles } from 'lucide-react';

interface ThresholdDesignerProps {
  onThresholdCalculated: (theta: number, n: number, w: number, p: number) => void;
  initialN?: number;
  initialW?: number;
  initialP?: number;
}

export default function ThresholdDesigner({ onThresholdCalculated, initialN = 2, initialW = 1, initialP = 0 }: ThresholdDesignerProps) {
  const [n, setN] = useState(initialN);
  const [w, setW] = useState(initialW);
  const [p, setP] = useState(initialP);
  const [calculated, setCalculated] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setN(initialN);
    setW(initialW);
    setP(initialP);
    setCalculated(false);
  }, [initialN, initialW, initialP]);

  const theta = calculateThreshold(n, w, p);

  const handleCalculate = () => {
    setAnimating(true);
    setCalculated(true);
    onThresholdCalculated(theta, n, w, p);
    setTimeout(() => setAnimating(false), 800);
  };

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator size={16} className="text-[#FFB800]" />
        <h3 className="font-bold text-sm" style={{ color: '#FFB800' }}>Threshold Designer</h3>
      </div>

      <div className="formula-box text-center">
        <div className="text-xs text-[var(--text-muted)] mb-1">General Formula</div>
        <div className="text-lg font-mono font-bold" style={{ color: '#FFB800' }}>θ ≥ nw − p</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <div className="section-label">n (excitatory)</div>
          <input type="number" min="0" max="10" step="1" value={n} onChange={e => { setN(Number(e.target.value)); setCalculated(false); }} className="neon-input text-center" />
        </div>
        <div>
          <div className="section-label">w (weight)</div>
          <input type="number" min="0.1" max="10" step="0.1" value={w} onChange={e => { setW(Number(e.target.value)); setCalculated(false); }} className="neon-input text-center" />
        </div>
        <div>
          <div className="section-label">p (inhibitory)</div>
          <input type="number" min="0" max="10" step="1" value={p} onChange={e => { setP(Number(e.target.value)); setCalculated(false); }} className="neon-input text-center" />
        </div>
      </div>

      {/* Live formula animation */}
      <div className={`formula-box transition-all duration-500 ${animating ? 'glow-primary' : ''}`} style={{ borderColor: calculated ? 'rgba(255,184,0,0.4)' : 'rgba(108,99,255,0.2)' }}>
        <div className="text-xs text-[var(--text-muted)] mb-2">Live Calculation</div>
        <div className="font-mono text-sm space-y-1">
          <div>θ ≥ nw − p</div>
          <div style={{ color: '#00D4FF' }}>θ ≥ ({n} × {w}) − {p}</div>
          <div className="text-lg font-bold" style={{ color: '#FFB800' }}>θ ≥ {theta}</div>
        </div>
      </div>

      {calculated && (
        <div className="rounded-xl p-3 text-center animate-fade-in-up" style={{ background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.3)' }}>
          <div className="text-xs text-[var(--text-muted)] mb-1">Recommended Threshold</div>
          <div className="text-2xl font-mono font-black" style={{ color: '#FFB800' }}>θ = {theta}</div>
          <div className="flex items-center justify-center gap-1 mt-1 text-xs" style={{ color: '#00FF94' }}>
            <Sparkles size={12} /> Applied to neuron
          </div>
        </div>
      )}

      <button onClick={handleCalculate} className="neon-btn neon-btn-primary w-full py-3 text-sm" style={{ background: 'linear-gradient(135deg, #FFB800, #FF6B9D)' }}>
        <Calculator size={16} /> Calculate Threshold
      </button>

      {/* Symbol table */}
      <div className="text-xs space-y-1.5">
        <div className="section-label">Symbol Reference</div>
        <div className="grid grid-cols-[40px_1fr] gap-y-1 text-[var(--text-muted)]">
          <span className="font-mono font-bold" style={{ color: '#FFB800' }}>θ</span><span>Threshold</span>
          <span className="font-mono font-bold" style={{ color: '#00D4FF' }}>n</span><span>Number of Excitatory Inputs</span>
          <span className="font-mono font-bold" style={{ color: '#00D4FF' }}>w</span><span>Weight of Excitatory Inputs</span>
          <span className="font-mono font-bold" style={{ color: '#FF6B9D' }}>p</span><span>Number of Inhibitory Inputs</span>
        </div>
      </div>
    </div>
  );
}
