'use client';
import { TrainingStep } from '@/lib/perceptron';

interface NetworkVisualizerProps {
  currentStep: TrainingStep | null;
  isAnimating: boolean;
}

function getWeightColor(w: number): string {
  if (w > 0) return `rgba(0, 212, 255, ${Math.min(0.9, Math.abs(w) * 0.6 + 0.2)})`;
  return `rgba(255, 107, 157, ${Math.min(0.9, Math.abs(w) * 0.6 + 0.2)})`;
}

function getWeightWidth(w: number): number {
  return Math.min(6, Math.abs(w) * 3 + 1);
}

export default function NetworkVisualizer({ currentStep, isAnimating }: NetworkVisualizerProps) {
  const weights = currentStep?.weights ?? [0.5, 0.5];
  const inputs = currentStep?.inputs ?? [0, 0];
  const output = currentStep?.activationOutput ?? 0;
  const net = currentStep?.weightedSum ?? 0;
  const bias = currentStep?.bias ?? 0;
  const isCorrect = currentStep?.isCorrect;
  const error = currentStep?.error;

  const inputActive = isAnimating;
  const outputColor = currentStep === null ? '#6C63FF'
    : isCorrect ? '#00FF94'
    : error !== 0 ? '#FF4444' : '#6C63FF';

  return (
    <div className="w-full flex flex-col items-center">
      <svg viewBox="0 0 480 280" className="w-full max-w-md" style={{ filter: 'drop-shadow(0 0 20px rgba(108,99,255,0.15))' }}>
        {/* Input A -> Sum */}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.3)" />
          </marker>
        </defs>

        {/* Input A connection */}
        <line x1="90" y1="80" x2="230" y2="145"
          stroke={getWeightColor(weights[0])}
          strokeWidth={getWeightWidth(weights[0])}
          strokeOpacity={inputs[0] ? 1 : 0.35}
          style={{ filter: inputActive && inputs[0] ? `drop-shadow(0 0 6px ${getWeightColor(weights[0])})` : 'none', transition: 'all 0.4s ease' }}
        />
        {/* W1 label */}
        <text x="145" y="95" fill={getWeightColor(weights[0])} fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">
          w₁={weights[0].toFixed(3)}
        </text>

        {/* Input B connection */}
        <line x1="90" y1="200" x2="230" y2="155"
          stroke={getWeightColor(weights[1])}
          strokeWidth={getWeightWidth(weights[1])}
          strokeOpacity={inputs[1] ? 1 : 0.35}
          style={{ filter: inputActive && inputs[1] ? `drop-shadow(0 0 6px ${getWeightColor(weights[1])})` : 'none', transition: 'all 0.4s ease' }}
        />
        {/* W2 label */}
        <text x="145" y="215" fill={getWeightColor(weights[1])} fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">
          w₂={weights[1].toFixed(3)}
        </text>

        {/* Bias connection from top */}
        <line x1="240" y1="30" x2="240" y2="120"
          stroke="rgba(255,184,0,0.6)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text x="270" y="55" fill="#FFB800" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
          b={bias.toFixed(3)}
        </text>

        {/* Bias node */}
        <circle cx="240" cy="22" r="12" fill="rgba(255,184,0,0.15)" stroke="rgba(255,184,0,0.5)" strokeWidth="1.5" />
        <text x="240" y="26" fill="#FFB800" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">b</text>

        {/* Summation -> Activation */}
        <line x1="270" y1="150" x2="340" y2="150"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <text x="305" y="143" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">net</text>

        {/* Activation -> Output */}
        <line x1="390" y1="150" x2="435" y2="150"
          stroke={outputColor}
          strokeWidth="2.5"
          markerEnd="url(#arrowhead)"
          style={{ filter: currentStep ? `drop-shadow(0 0 6px ${outputColor})` : 'none', transition: 'stroke 0.4s ease' }}
        />

        {/* ── Input A node ── */}
        <circle cx="70" cy="80" r="28" fill="rgba(108,99,255,0.1)" stroke={inputs[0] ? '#6C63FF' : 'rgba(108,99,255,0.3)'} strokeWidth="2"
          style={{ filter: inputs[0] ? 'drop-shadow(0 0 12px rgba(108,99,255,0.6))' : 'none', transition: 'all 0.4s ease' }}
        />
        <text x="70" y="76" fill="#E8E8F0" fontSize="12" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">A</text>
        <text x="70" y="92" fill={inputs[0] ? '#00FF94' : '#FF4444'} fontSize="14" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">{inputs[0]}</text>

        {/* ── Input B node ── */}
        <circle cx="70" cy="200" r="28" fill="rgba(108,99,255,0.1)" stroke={inputs[1] ? '#6C63FF' : 'rgba(108,99,255,0.3)'} strokeWidth="2"
          style={{ filter: inputs[1] ? 'drop-shadow(0 0 12px rgba(108,99,255,0.6))' : 'none', transition: 'all 0.4s ease' }}
        />
        <text x="70" y="196" fill="#E8E8F0" fontSize="12" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">B</text>
        <text x="70" y="212" fill={inputs[1] ? '#00FF94' : '#FF4444'} fontSize="14" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">{inputs[1]}</text>

        {/* ── Summation node ── */}
        <circle cx="250" cy="150" r="32" fill="rgba(0,0,0,0.5)" stroke="rgba(0,212,255,0.5)" strokeWidth="2"
          style={{ filter: isAnimating ? 'drop-shadow(0 0 15px rgba(0,212,255,0.4))' : 'none', transition: 'all 0.3s ease' }}
        />
        <text x="250" y="144" fill="#00D4FF" fontSize="18" textAnchor="middle" fontWeight="700">Σ</text>
        <text x="250" y="162" fill="rgba(0,212,255,0.8)" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">{net.toFixed(3)}</text>

        {/* ── Activation node ── */}
        <rect x="342" y="122" width="48" height="56" rx="10" fill="rgba(0,0,0,0.5)" stroke="rgba(108,99,255,0.5)" strokeWidth="2"
          style={{ filter: isAnimating ? 'drop-shadow(0 0 15px rgba(108,99,255,0.3))' : 'none', transition: 'all 0.3s ease' }}
        />
        <text x="366" y="145" fill="#6C63FF" fontSize="9" textAnchor="middle" fontWeight="600">Step</text>
        <text x="366" y="158" fill="#6C63FF" fontSize="9" textAnchor="middle">fn</text>
        <text x="366" y="170" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">θ=0.5</text>

        {/* ── Output node ── */}
        <circle cx="455" cy="150" r="28" fill="rgba(0,0,0,0.5)" stroke={outputColor} strokeWidth="2.5"
          style={{ filter: currentStep ? `drop-shadow(0 0 18px ${outputColor}80)` : 'none', transition: 'all 0.4s ease' }}
        />
        <text x="455" y="145" fill={outputColor} fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">OUT</text>
        <text x="455" y="161" fill={outputColor} fontSize="16" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">{output}</text>

        {/* Labels */}
        <text x="70" y="248" fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle">INPUTS</text>
        <text x="250" y="248" fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle">SUM</text>
        <text x="366" y="248" fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle">ACTIVATION</text>
        <text x="455" y="248" fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle">OUTPUT</text>
      </svg>

      {/* Step info badges */}
      {currentStep && (
        <div className="flex gap-3 flex-wrap justify-center mt-2">
          <span className={`badge ${currentStep.isCorrect ? 'badge-success' : 'badge-danger'}`}>
            {currentStep.isCorrect ? '✓ Correct' : `Error: ${currentStep.error}`}
          </span>
          <span className="badge badge-secondary">Net: {currentStep.weightedSum.toFixed(4)}</span>
          <span className="badge badge-primary">Epoch {currentStep.epoch}</span>
        </div>
      )}
    </div>
  );
}
