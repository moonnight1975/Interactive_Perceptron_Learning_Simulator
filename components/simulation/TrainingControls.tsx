'use client';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Zap, Shuffle } from 'lucide-react';
import { TrainerStatus, SpeedLevel } from '@/hooks/usePerceptronTrainer';

interface TrainingControlsProps {
  status: TrainerStatus;
  speed: SpeedLevel;
  currentStepIndex: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onInstant: () => void;
  onSpeedChange: (s: SpeedLevel) => void;
}

const SPEED_OPTIONS: { value: SpeedLevel; label: string }[] = [
  { value: 'very-slow', label: 'Very Slow' },
  { value: 'slow', label: 'Slow' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast' },
  { value: 'instant', label: 'Instant' },
];

export default function TrainingControls({
  status, speed, currentStepIndex, totalSteps,
  onPlay, onPause, onNext, onPrev, onReset, onInstant, onSpeedChange,
}: TrainingControlsProps) {
  const isPlaying = status === 'training';
  const isFinished = status === 'finished';
  const hasSteps = totalSteps > 0;
  const progress = hasSteps ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress */}
      {hasSteps && (
        <div>
          <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
            <span>Progress</span>
            <span className="font-mono">{Math.max(0, currentStepIndex + 1)} / {totalSteps}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Main controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={onPrev}
          disabled={!hasSteps || currentStepIndex <= 0}
          className="neon-btn neon-btn-ghost px-3 py-2.5"
          title="Previous step"
        >
          <SkipBack size={16} />
        </button>

        {isPlaying ? (
          <button
            onClick={onPause}
            disabled={!hasSteps}
            className="neon-btn neon-btn-secondary px-5 py-2.5"
          >
            <Pause size={16} /> Pause
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={!hasSteps || isFinished}
            className="neon-btn neon-btn-primary px-5 py-2.5"
          >
            <Play size={16} /> Play
          </button>
        )}

        <button
          onClick={onNext}
          disabled={!hasSteps || isFinished}
          className="neon-btn neon-btn-ghost px-3 py-2.5"
          title="Next step"
        >
          <SkipForward size={16} />
        </button>

        <button
          onClick={onInstant}
          disabled={!hasSteps || isFinished}
          className="neon-btn neon-btn-ghost px-3 py-2.5"
          title="Jump to end"
        >
          <Zap size={16} />
        </button>

        <button
          onClick={onReset}
          disabled={!hasSteps}
          className="neon-btn neon-btn-ghost px-3 py-2.5"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Speed */}
      <div>
        <div className="section-label">Animation Speed</div>
        <div className="flex gap-1.5 flex-wrap">
          {SPEED_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSpeedChange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                speed === opt.value
                  ? 'bg-[rgba(108,99,255,0.2)] border-[rgba(108,99,255,0.5)] text-[#6C63FF]'
                  : 'bg-transparent border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[rgba(108,99,255,0.3)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
