'use client';
import { TrainingResult } from '@/lib/perceptron';
import { X, Trophy, AlertTriangle } from 'lucide-react';
import { exportCSV, exportJSON } from '@/lib/export';
import { DataPoint } from '@/lib/perceptron';

interface ConvergenceModalProps {
  result: TrainingResult;
  gateName: string;
  dataset: DataPoint[];
  timeTaken: number;
  onClose: () => void;
}

export default function ConvergenceModal({ result, gateName, dataset, timeTaken, onClose }: ConvergenceModalProps) {
  const { converged, finalWeights, finalBias, finalEpoch, accuracy, steps } = result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
      <div className="glass-card w-full max-w-lg p-8 relative animate-fade-in-up" style={{ border: `1px solid ${converged ? 'rgba(0,255,148,0.3)' : 'rgba(255,68,68,0.3)'}` }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition-colors">
          <X size={20} />
        </button>

        {/* Icon + Title */}
        <div className="text-center mb-6">
          {converged ? (
            <>
              <div className="text-6xl mb-3 animate-float">🎉</div>
              <h2 className="text-2xl font-bold text-[#00FF94] mb-1">Perceptron Learned!</h2>
              <p className="text-[var(--text-muted)] text-sm">Successfully converged on <span className="text-white font-semibold">{gateName}</span></p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-3">⚠️</div>
              <h2 className="text-2xl font-bold text-[#FFB800] mb-1">Max Epochs Reached</h2>
              <p className="text-[var(--text-muted)] text-sm">Training did not converge within the limit</p>
            </>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="stat-card">
            <div className="stat-value" style={{ color: converged ? '#00FF94' : '#FFB800' }}>{finalEpoch}</div>
            <div className="stat-label">Epochs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-[#6C63FF]">{accuracy.toFixed(0)}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-[#00D4FF]">{finalWeights[0].toFixed(4)}</div>
            <div className="stat-label">Final W₁</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-[#00D4FF]">{finalWeights[1].toFixed(4)}</div>
            <div className="stat-label">Final W₂</div>
          </div>
          <div className="stat-card col-span-2">
            <div className="stat-value text-[#FFB800]">{finalBias.toFixed(4)}</div>
            <div className="stat-label">Final Bias</div>
          </div>
        </div>

        <div className="text-center text-xs text-[var(--text-muted)] mb-4">
          Training completed in {(timeTaken / 1000).toFixed(2)}s · {steps.length} total steps
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => exportCSV(steps, gateName)}
            className="neon-btn neon-btn-secondary flex-1"
          >
            ↓ CSV
          </button>
          <button
            onClick={() => exportJSON(result, gateName, dataset)}
            className="neon-btn neon-btn-secondary flex-1"
          >
            ↓ JSON
          </button>
          <button onClick={onClose} className="neon-btn neon-btn-primary flex-1">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
