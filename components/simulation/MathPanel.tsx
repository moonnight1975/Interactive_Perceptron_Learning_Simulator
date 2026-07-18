'use client';
import { TrainingStep } from '@/lib/perceptron';

interface MathPanelProps {
  currentStep: TrainingStep | null;
  threshold: number;
  learningRate: number;
}

function Val({ v, color = '#00D4FF' }: { v: number | string; color?: string }) {
  return <span style={{ color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{v}</span>;
}

export default function MathPanel({ currentStep, threshold, learningRate }: MathPanelProps) {
  if (!currentStep) {
    return (
      <div className="glass-card p-5 h-full flex items-center justify-center">
        <div className="text-center text-[var(--text-muted)]">
          <div className="text-4xl mb-3">🧮</div>
          <div className="font-semibold text-sm">Mathematical Explanation</div>
          <div className="text-xs mt-1">Start training to see step-by-step formulas</div>
        </div>
      </div>
    );
  }

  const { inputs, weights, bias, weightedSum, activationOutput, target, error, updatedWeights, updatedBias } = currentStep;
  const net = weightedSum;

  return (
    <div className="glass-card p-5 space-y-4 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#6C63FF] text-lg">🧮</span>
        <h3 className="font-bold text-[15px] gradient-text">Step-by-Step Math</h3>
        <span className="badge badge-primary ml-auto">Epoch {currentStep.epoch} · Sample {currentStep.sampleIndex + 1}</span>
      </div>

      {/* Weighted Sum */}
      <div className="formula-box">
        <div className="section-label mb-2">1. Weighted Sum (net input)</div>
        <div className="space-y-1 text-[12px]">
          <div>net = x₁·w₁ + x₂·w₂ + bias</div>
          <div className="text-[var(--text-muted)]">
            = <Val v={inputs[0]} color="#00D4FF"/> × <Val v={weights[0].toFixed(4)}/> + <Val v={inputs[1]} color="#00D4FF"/> × <Val v={weights[1].toFixed(4)}/> + <Val v={bias.toFixed(4)} color="#FFB800"/>
          </div>
          <div className="text-[var(--success)] font-bold">= {net.toFixed(6)}</div>
        </div>
      </div>

      {/* Activation */}
      <div className="formula-box">
        <div className="section-label mb-2">2. Step Activation Function</div>
        <div className="text-[12px] space-y-1">
          <div>If net ≥ θ → Output = 1, else Output = 0</div>
          <div className="text-[var(--text-muted)]">
            <Val v={net.toFixed(4)}/> {net >= threshold ? '≥' : '<'} <Val v={threshold} color="#FFB800"/> → Output = <Val v={activationOutput} color={activationOutput === 1 ? '#00FF94' : '#FF4444'}/>
          </div>
        </div>
      </div>

      {/* Error */}
      <div className="formula-box">
        <div className="section-label mb-2">3. Error Calculation</div>
        <div className="text-[12px] space-y-1">
          <div>Error = Target − Predicted</div>
          <div className="text-[var(--text-muted)]">
            = <Val v={target} color="#00FF94"/> − <Val v={activationOutput} color={activationOutput === 1 ? '#00FF94' : '#FF4444'}/> = <Val v={error} color={error === 0 ? '#00FF94' : '#FF4444'}/>
          </div>
          {error === 0 && <div className="text-[#00FF94] font-bold">✓ No update needed!</div>}
          {error !== 0 && <div className="text-[#FF4444] font-bold">⚡ Weights will update!</div>}
        </div>
      </div>

      {/* Weight Updates */}
      {error !== 0 && (
        <div className="formula-box">
          <div className="section-label mb-2">4. Weight Updates (Perceptron Rule)</div>
          <div className="text-[12px] space-y-1.5">
            <div className="text-[var(--text-muted)]">w_new = w_old + lr × error × input</div>
            <div>
              w₁: <Val v={weights[0].toFixed(4)}/> + (<Val v={learningRate} color="#FFB800"/> × <Val v={error} color="#FF4444"/> × <Val v={inputs[0]} color="#00D4FF"/>)
              {' = '}<Val v={updatedWeights[0].toFixed(4)} color="#00FF94"/>
            </div>
            <div>
              w₂: <Val v={weights[1].toFixed(4)}/> + (<Val v={learningRate} color="#FFB800"/> × <Val v={error} color="#FF4444"/> × <Val v={inputs[1]} color="#00D4FF"/>)
              {' = '}<Val v={updatedWeights[1].toFixed(4)} color="#00FF94"/>
            </div>
            <div className="text-[var(--text-muted)]">bias_new = bias_old + lr × error</div>
            <div>
              b: <Val v={bias.toFixed(4)}/> + (<Val v={learningRate} color="#FFB800"/> × <Val v={error} color="#FF4444"/>)
              {' = '}<Val v={updatedBias.toFixed(4)} color="#00FF94"/>
            </div>
          </div>
        </div>
      )}

      {error === 0 && (
        <div className="formula-box" style={{ borderColor: 'rgba(0,255,148,0.3)' }}>
          <div className="section-label mb-1">4. No Update Required</div>
          <div className="text-[12px] text-[#00FF94]">
            Since error = 0, all weights remain unchanged.
          </div>
        </div>
      )}
    </div>
  );
}
