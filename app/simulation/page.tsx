'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import InputPanel from '@/components/simulation/InputPanel';
import NetworkVisualizer from '@/components/simulation/NetworkVisualizer';
import MathPanel from '@/components/simulation/MathPanel';
import TrainingTable from '@/components/simulation/TrainingTable';
import TrainingControls from '@/components/simulation/TrainingControls';
import ConvergenceModal from '@/components/simulation/ConvergenceModal';
import HistoryPanel from '@/components/simulation/HistoryPanel';
import LiveChartsPanel from '@/components/charts/LiveChartsPanel';
import { usePerceptronTrainer } from '@/hooks/usePerceptronTrainer';
import { saveSimulation } from '@/lib/history';
import { DataPoint } from '@/lib/perceptron';
import { GateType } from '@/lib/logicGates';
import { Activity, Network, Table, BarChart3, Calculator, History } from 'lucide-react';

type RightTab = 'network' | 'math' | 'table' | 'charts';

export default function SimulationPage() {
  const trainer = usePerceptronTrainer();
  const [showModal, setShowModal] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [currentDataset, setCurrentDataset] = useState<DataPoint[]>([]);
  const [currentGateName, setCurrentGateName] = useState('AND Gate');
  const [currentGateType, setCurrentGateType] = useState<GateType>('AND');
  const [currentLR, setCurrentLR] = useState(0.2);
  const [currentThreshold, setCurrentThreshold] = useState(0.5);
  const [rightTab, setRightTab] = useState<RightTab>('network');
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const trainStartRef = useRef<number>(0);
  const animPlayedRef = useRef<boolean>(false);
  const modalShownRef = useRef<boolean>(false); // prevents modal from reopening after Continue

  const handleTrain = useCallback((params: {
    dataset: DataPoint[];
    initialWeights: number[];
    initialBias: number;
    learningRate: number;
    threshold: number;
    maxEpochs: number;
    useRandom: boolean;
    gateName: string;
    gateType: GateType;
  }) => {
    const { dataset, initialWeights, initialBias, learningRate, threshold, maxEpochs, useRandom, gateName, gateType } = params;
    setCurrentDataset(dataset);
    setCurrentGateName(gateName);
    setCurrentGateType(gateType);
    setCurrentLR(learningRate);
    setCurrentThreshold(threshold);
    setShowModal(false);
    animPlayedRef.current = false;
    modalShownRef.current = false; // allow modal for this new training run
    trainStartRef.current = 0;

    const result = trainer.initTraining(dataset, initialWeights, initialBias, learningRate, threshold, maxEpochs, useRandom);

    // Save to history
    saveSimulation(gateType, gateName, learningRate, threshold, maxEpochs, initialWeights, initialBias, result);
    setHistoryRefresh(n => n + 1);
    // ✅ Do NOT auto-show modal here — let the user play the animation first.
    // Modal will appear automatically when animation reaches the end (via useEffect below).
  }, [trainer]);


  const handlePlay = useCallback(() => {
    if (!animPlayedRef.current) {
      trainStartRef.current = Date.now(); // start timing from when user presses Play
      animPlayedRef.current = true;
    }
    trainer.play();
  }, [trainer]);

  // Show modal ONCE when animation reaches the end
  useEffect(() => {
    if (trainer.status === 'finished' && trainer.result && !modalShownRef.current) {
      modalShownRef.current = true; // prevent re-triggering for this run
      const elapsed = Date.now() - trainStartRef.current;
      setTimeTaken(elapsed > 0 ? elapsed : 500);
      const t = setTimeout(() => setShowModal(true), 600);
      return () => clearTimeout(t);
    }
  }, [trainer.status, trainer.result]);

  const RIGHT_TABS = [
    { id: 'network' as const, label: 'Network', icon: Network },
    { id: 'math' as const, label: 'Math', icon: Calculator },
    { id: 'charts' as const, label: 'Charts', icon: BarChart3 },
    { id: 'table' as const, label: 'Log', icon: Table },
  ];

  const epochCount = trainer.currentStep ? trainer.currentStep.epoch : 0;
  const errorCount = trainer.currentStep ? Math.abs(trainer.currentStep.error) : 0;

  return (
    <div className="min-h-screen pt-16">
      <Navbar />

      {/* Header */}
      <div className="px-6 pt-6 pb-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4FF)' }}>
            <Activity size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-black gradient-text">Perceptron Training Lab</h1>
          <span className={`badge ml-2 ${
            trainer.status === 'idle' ? 'badge-primary'
            : trainer.status === 'training' ? 'badge-secondary'
            : trainer.status === 'paused' ? 'badge-warning'
            : 'badge-success'
          }`}>
            {trainer.status === 'idle' ? '◉ Ready'
            : trainer.status === 'training' ? '⟳ Training'
            : trainer.status === 'paused' ? '⏸ Paused'
            : '✓ Done'}
          </span>
        </div>
        <p className="text-[var(--text-muted)] text-xs ml-11">
          Configure a logic gate, train the perceptron, and watch it learn in real time.
        </p>
      </div>

      {/* Main Layout */}
      <div className="px-6 pb-8 max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">
        {/* ── Left Panel ──────────────────────────────────────────── */}
        <div className="space-y-4">
          <InputPanel
            onTrain={handleTrain}
            isTraining={trainer.status === 'training'}
          />
          <HistoryPanel refreshTrigger={historyRefresh} />
        </div>

        {/* ── Right Panel ─────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Quick stats */}
          {trainer.steps.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              <div className="stat-card">
                <div className="stat-value gradient-text">{epochCount}</div>
                <div className="stat-label">Epoch</div>
              </div>
              <div className="stat-card">
                <div className="stat-value text-[var(--text-muted)]">{trainer.currentStepIndex + 1}</div>
                <div className="stat-label">Step</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: errorCount === 0 ? '#00FF94' : '#FF4444' }}>
                  {trainer.currentStep?.error ?? '-'}
                </div>
                <div className="stat-label">Error</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: trainer.result?.converged ? '#00FF94' : '#FFB800' }}>
                  {trainer.result ? `${trainer.result.accuracy.toFixed(0)}%` : '-'}
                </div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
          )}

          {/* Controls */}
          {trainer.steps.length > 0 && (
            <div className="glass-card p-4">
              <TrainingControls
                status={trainer.status}
                speed={trainer.speed}
                currentStepIndex={trainer.currentStepIndex}
                totalSteps={trainer.totalSteps}
                onPlay={handlePlay}
                onPause={trainer.pause}
                onNext={trainer.nextStep}
                onPrev={trainer.prevStep}
                onReset={trainer.reset}
                onInstant={trainer.jumpToInstant}
                onSpeedChange={trainer.setSpeed}
              />
            </div>
          )}

          {/* Tab bar */}
          <div className="flex gap-1.5 flex-wrap">
            {RIGHT_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setRightTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  rightTab === id
                    ? 'bg-[rgba(108,99,255,0.2)] text-[#6C63FF] border border-[rgba(108,99,255,0.3)]'
                    : 'text-[var(--text-muted)] glass-card hover:text-white'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {rightTab === 'network' && (
            <div className="glass-card p-5">
              <NetworkVisualizer
                currentStep={trainer.currentStep}
                isAnimating={trainer.status === 'training'}
              />
            </div>
          )}

          {rightTab === 'math' && (
            <MathPanel
              currentStep={trainer.currentStep}
              threshold={currentThreshold}
              learningRate={currentLR}
            />
          )}

          {rightTab === 'charts' && (
            <div className="glass-card p-4">
              <h3 className="font-bold text-sm gradient-text mb-4">Live Training Charts</h3>
              <LiveChartsPanel
                steps={trainer.steps}
                currentStepIndex={trainer.currentStepIndex}
              />
            </div>
          )}

          {rightTab === 'table' && (
            <div className="glass-card p-4">
              <TrainingTable
                steps={trainer.steps}
                currentStepIndex={trainer.currentStepIndex}
                gateName={currentGateName}
              />
            </div>
          )}

          {/* Show all panels when finished and on network tab */}
          {rightTab === 'network' && trainer.steps.length > 0 && (
            <div className="space-y-4">
              <div className="glass-card p-4">
                <LiveChartsPanel
                  steps={trainer.steps}
                  currentStepIndex={trainer.currentStepIndex}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Convergence Modal */}
      {showModal && trainer.result && (
        <ConvergenceModal
          result={trainer.result}
          gateName={currentGateName}
          dataset={currentDataset}
          timeTaken={timeTaken}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
