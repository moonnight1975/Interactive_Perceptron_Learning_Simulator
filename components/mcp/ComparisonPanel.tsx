'use client';
import { Settings, Zap } from 'lucide-react';

export default function ComparisonPanel() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-sm gradient-text">Threshold Methods</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Manual Method */}
        <div className="glass-card p-5" style={{ border: '1px solid rgba(108,99,255,0.25)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Settings size={16} className="text-[#6C63FF]" />
            <h4 className="font-bold text-sm text-[#6C63FF]">Manual Method</h4>
          </div>
          <ul className="space-y-2 text-xs text-[var(--text-muted)]">
            <li className="flex items-start gap-2"><span className="text-[#6C63FF]">1.</span>Choose weights for each input</li>
            <li className="flex items-start gap-2"><span className="text-[#6C63FF]">2.</span>Compute weighted sums for all input combinations</li>
            <li className="flex items-start gap-2"><span className="text-[#6C63FF]">3.</span>Select a threshold by inspecting which value separates 0 and 1 outputs</li>
          </ul>
          <div className="mt-4 space-y-1.5">
            <div className="section-label" style={{ color: '#00FF94' }}>Advantages</div>
            <div className="text-xs text-[var(--text-muted)] flex items-start gap-1.5"><span className="text-[#00FF94]">✓</span>Full control over threshold</div>
            <div className="text-xs text-[var(--text-muted)] flex items-start gap-1.5"><span className="text-[#00FF94]">✓</span>Intuitive trial-and-error learning</div>
            <div className="section-label mt-3" style={{ color: '#FF4444' }}>Disadvantages</div>
            <div className="text-xs text-[var(--text-muted)] flex items-start gap-1.5"><span className="text-[#FF4444]">✗</span>Time-consuming for many inputs</div>
            <div className="text-xs text-[var(--text-muted)] flex items-start gap-1.5"><span className="text-[#FF4444]">✗</span>Error-prone without systematic approach</div>
          </div>
        </div>

        {/* Formula Method */}
        <div className="glass-card p-5" style={{ border: '1px solid rgba(255,184,0,0.25)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-[#FFB800]" />
            <h4 className="font-bold text-sm text-[#FFB800]">Formula Method</h4>
          </div>
          <ul className="space-y-2 text-xs text-[var(--text-muted)]">
            <li className="flex items-start gap-2"><span className="text-[#FFB800]">1.</span>Count excitatory inputs (n) and their weight (w)</li>
            <li className="flex items-start gap-2"><span className="text-[#FFB800]">2.</span>Count inhibitory inputs (p)</li>
            <li className="flex items-start gap-2"><span className="text-[#FFB800]">3.</span>Apply θ ≥ nw − p to get threshold instantly</li>
          </ul>
          <div className="mt-4 space-y-1.5">
            <div className="section-label" style={{ color: '#00FF94' }}>Advantages</div>
            <div className="text-xs text-[var(--text-muted)] flex items-start gap-1.5"><span className="text-[#00FF94]">✓</span>Instant, systematic calculation</div>
            <div className="text-xs text-[var(--text-muted)] flex items-start gap-1.5"><span className="text-[#00FF94]">✓</span>Scales to any number of inputs</div>
            <div className="section-label mt-3" style={{ color: '#FF4444' }}>Disadvantages</div>
            <div className="text-xs text-[var(--text-muted)] flex items-start gap-1.5"><span className="text-[#FF4444]">✗</span>Only works for standard excitatory weights</div>
            <div className="text-xs text-[var(--text-muted)] flex items-start gap-1.5"><span className="text-[#FF4444]">✗</span>May need adjustment for special gates (OR)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
