'use client';
import { MCPResult } from '@/lib/mcpNeuron';

interface MCPMathProofProps {
  result: MCPResult | null;
  threshold: number;
}

function Val({ v, color = '#00D4FF' }: { v: number | string; color?: string }) {
  return <span style={{ color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{v}</span>;
}

export default function MCPMathProof({ result, threshold }: MCPMathProofProps) {
  if (!result) {
    return (
      <div className="glass-card p-5 text-center text-[var(--text-muted)] text-sm">
        <div className="text-3xl mb-2">🧮</div>
        <div>Click a row in the truth table</div>
        <div className="text-xs mt-1">to see the step-by-step mathematical proof</div>
      </div>
    );
  }

  const { inputs, weightedSum, output, comparisonMet } = result;

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🧮</span>
        <h3 className="font-bold text-[15px] gradient-text">Step-by-Step Proof</h3>
        <span className="badge badge-primary ml-auto">({inputs.map(i => i.value).join(', ')})</span>
      </div>

      {/* Step 1: Input Values */}
      <div className="formula-box">
        <div className="section-label mb-2">Step 1 — Inputs</div>
        <div className="flex gap-4 flex-wrap text-sm font-mono">
          {inputs.map((inp, i) => (
            <div key={i}>
              <Val v={inp.label} color="#E8E8F0" /> = <Val v={inp.value} color={inp.value === 1 ? '#00FF94' : '#FF6B9D'} />
              <span className="text-xs ml-1" style={{ color: inp.type === 'excitatory' ? 'rgba(0,255,148,0.5)' : 'rgba(255,68,68,0.5)' }}>
                ({inp.type === 'excitatory' ? 'exc' : 'inh'})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Weighted Sum */}
      <div className="formula-box">
        <div className="section-label mb-2">Step 2 — Weighted Sum</div>
        <div className="text-[12px] font-mono space-y-1">
          <div>Y<sub>in</sub> = {inputs.map((inp, i) => (
            <span key={i}>
              {i > 0 && ' + '}
              <Val v={inp.value} color="#00D4FF" /> × <Val v={inp.weight} color={inp.type === 'excitatory' ? '#00FF94' : '#FF4444'} />
            </span>
          ))}</div>
          <div className="text-[var(--text-muted)]">
            = {inputs.map((inp, i) => (
              <span key={i}>{i > 0 && ' + '}{inp.value * inp.weight}</span>
            ))}
          </div>
          <div className="text-lg font-bold" style={{ color: '#00D4FF' }}>Y<sub>in</sub> = {weightedSum}</div>
        </div>
      </div>

      {/* Step 3: Threshold */}
      <div className="formula-box">
        <div className="section-label mb-2">Step 3 — Threshold</div>
        <div className="font-mono text-lg font-bold" style={{ color: '#FFB800' }}>θ = {threshold}</div>
      </div>

      {/* Step 4: Comparison */}
      <div className="formula-box" style={{ borderColor: comparisonMet ? 'rgba(0,255,148,0.3)' : 'rgba(255,68,68,0.3)' }}>
        <div className="section-label mb-2">Step 4 — Comparison</div>
        <div className="font-mono text-sm">
          <Val v={weightedSum} color="#00D4FF" />
          {' '}
          <Val v={comparisonMet ? '≥' : '<'} color={comparisonMet ? '#00FF94' : '#FF4444'} />
          {' '}
          <Val v={threshold} color="#FFB800" />
        </div>
        <div className="text-xs mt-1" style={{ color: comparisonMet ? '#00FF94' : '#FF4444' }}>
          {comparisonMet ? '✓ Threshold is met' : '✗ Threshold is NOT met'}
        </div>
      </div>

      {/* Step 5: Output */}
      <div className="formula-box" style={{ borderColor: output === 1 ? 'rgba(0,255,148,0.3)' : 'rgba(255,68,68,0.3)', background: output === 1 ? 'rgba(0,255,148,0.05)' : 'rgba(255,68,68,0.05)' }}>
        <div className="section-label mb-2">Step 5 — Output</div>
        <div className="text-center">
          <div className="text-3xl font-mono font-black" style={{ color: output === 1 ? '#00FF94' : '#FF4444' }}>Y = {output}</div>
          <div className="text-xs mt-1" style={{ color: output === 1 ? '#00FF94' : '#FF4444' }}>
            {output === 1 ? '⚡ Neuron FIRES!' : '○ Neuron does NOT fire'}
          </div>
        </div>
      </div>
    </div>
  );
}
