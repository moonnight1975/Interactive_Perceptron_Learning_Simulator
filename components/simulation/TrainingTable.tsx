'use client';

import { useEffect, useRef } from 'react';
import { TrainingStep } from '@/lib/perceptron';
import { exportCSV } from '@/lib/export';
import { Download } from 'lucide-react';

interface TrainingTableProps {
  steps: TrainingStep[];
  currentStepIndex: number;
  gateName: string;
}

export default function TrainingTable({
  steps,
  currentStepIndex,
  gateName,
}: TrainingTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleSteps = steps.slice(0, currentStepIndex + 1);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  }, [currentStepIndex]);

  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--text-muted)] text-sm">
        Training data will appear here...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm gradient-text">
          Training Log
        </h3>

        <div className="flex gap-2">
          <span className="badge badge-primary">
            {visibleSteps.length} / {steps.length} steps
          </span>

          <button
            onClick={() => exportCSV(steps, gateName)}
            className="neon-btn neon-btn-ghost px-3 py-1.5 text-xs flex items-center gap-1"
          >
            <Download size={13} />
            CSV
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="overflow-auto max-h-72 rounded-xl"
        style={{
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        <table className="training-table">
          <thead
            className="sticky top-0"
            style={{
              background: 'rgba(5,5,16,0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <tr>
              <th>Ep</th>
              <th>S</th>
              <th>A</th>
              <th>B</th>
              <th>W₁</th>
              <th>W₂</th>
              <th>Bias</th>
              <th>Net</th>
              <th>Out</th>
              <th>Tgt</th>
              <th>Err</th>
              <th>W₁&apos;</th>
              <th>W₂&apos;</th>
              <th>B&apos;</th>
            </tr>
          </thead>

          <tbody>
            {visibleSteps.map((step, idx) => (
              <tr
                key={idx}
                className={
                  idx === currentStepIndex ? 'current-row' : ''
                }
                style={{
                  opacity:
                    idx < currentStepIndex - 1 ? 0.6 : 1,
                }}
              >
                <td className="text-[var(--text-muted)]">
                  {step.epoch}
                </td>

                <td className="text-[var(--text-muted)]">
                  {step.sampleIndex + 1}
                </td>

                <td>{step.inputs[0]}</td>
                <td>{step.inputs[1]}</td>

                <td className="text-[#6C63FF]">
                  {step.weights[0].toFixed(3)}
                </td>

                <td className="text-[#6C63FF]">
                  {step.weights[1].toFixed(3)}
                </td>

                <td className="text-[#FFB800]">
                  {step.bias.toFixed(3)}
                </td>

                <td className="text-[#00D4FF]">
                  {step.weightedSum.toFixed(3)}
                </td>

                <td
                  style={{
                    color:
                      step.activationOutput === 1
                        ? '#00FF94'
                        : '#FF6B9D',
                  }}
                >
                  {step.activationOutput}
                </td>

                <td>{step.target}</td>

                <td
                  style={{
                    color:
                      step.error === 0
                        ? '#00FF94'
                        : '#FF4444',
                    fontWeight: 700,
                  }}
                >
                  {step.error}
                </td>

                <td className="text-[#00D4FF]">
                  {step.updatedWeights[0].toFixed(3)}
                </td>

                <td className="text-[#00D4FF]">
                  {step.updatedWeights[1].toFixed(3)}
                </td>

                <td className="text-[#FFB800]">
                  {step.updatedBias.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}