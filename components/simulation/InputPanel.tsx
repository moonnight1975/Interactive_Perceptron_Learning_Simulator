'use client';
import { useState, useCallback } from 'react';
import { GateType, LOGIC_GATES } from '@/lib/logicGates';
import { DataPoint, randomWeights } from '@/lib/perceptron';
import { Shuffle, Play, Brain, Info } from 'lucide-react';
import DatasetEditor from './DatasetEditor';

interface InputPanelProps {
  onTrain: (params: {
    dataset: DataPoint[];
    initialWeights: number[];
    initialBias: number;
    learningRate: number;
    threshold: number;
    maxEpochs: number;
    useRandom: boolean;
    gateName: string;
    gateType: GateType;
  }) => void;
  isTraining: boolean;
}

export default function InputPanel({ onTrain, isTraining }: InputPanelProps) {
  const [gate, setGate] = useState<GateType>('AND');
  const [dataset, setDataset] = useState<DataPoint[]>(LOGIC_GATES.AND.dataset);
  const [w1, setW1] = useState('0.5');
  const [w2, setW2] = useState('0.5');
  const [bias, setBias] = useState('0');
  const [lr, setLr] = useState('0.2');
  const [threshold, setThreshold] = useState('0.5');
  const [maxEpochs, setMaxEpochs] = useState('20');
  const [useRandom, setUseRandom] = useState(false);
  const [showDatasetEditor, setShowDatasetEditor] = useState(false);

  const selectedGate = LOGIC_GATES[gate];
  const isXOR = gate === 'XOR';

  const handleGateChange = (g: GateType) => {
    setGate(g);
    if (g !== 'CUSTOM') {
      setDataset(LOGIC_GATES[g].dataset);
      setShowDatasetEditor(false);
    } else {
      setShowDatasetEditor(true);
    }
  };

  const handleRandomize = () => {
    const rw = randomWeights(2);
    setW1(rw[0].toFixed(4));
    setW2(rw[1].toFixed(4));
  };

  const handleTrain = () => {
    onTrain({
      dataset,
      initialWeights: [parseFloat(w1) || 0.5, parseFloat(w2) || 0.5],
      initialBias: parseFloat(bias) || 0,
      learningRate: parseFloat(lr) || 0.2,
      threshold: parseFloat(threshold) || 0.5,
      maxEpochs: parseInt(maxEpochs) || 20,
      useRandom,
      gateName: selectedGate.name,
      gateType: gate,
    });
  };

  return (
    <div className="space-y-4">
      {/* Gate Selector */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Brain size={16} className="text-[#6C63FF]" />
          <h3 className="font-bold text-sm gradient-text">Logic Gate</h3>
        </div>
        <div>
          <div className="section-label">Select Gate</div>
          <select
            value={gate}
            onChange={e => handleGateChange(e.target.value as GateType)}
            className="neon-select"
          >
            {(Object.keys(LOGIC_GATES) as GateType[]).map(g => (
              <option key={g} value={g}>{LOGIC_GATES[g].name}</option>
            ))}
          </select>
          <p className="text-xs text-[var(--text-muted)] mt-1.5">{selectedGate.description}</p>
        </div>

        {/* XOR Warning */}
        {isXOR && (
          <div className="rounded-xl p-4 mt-2" style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.3)' }}>
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <div className="font-bold text-[#FFB800] text-sm mb-1">XOR is not linearly separable</div>
                <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                  A single-layer perceptron <strong className="text-[#FFB800]">cannot learn XOR</strong>.
                  The XOR truth table cannot be separated by a single straight line.
                  To solve XOR, you need a <strong className="text-white">Multi-Layer Perceptron (MLP)</strong> with at least one hidden layer.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Truth Table */}
        <div>
          <div className="section-label">Truth Table</div>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--glass-border)' }}>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th className="py-2 px-4 text-[var(--text-muted)]">A</th>
                  <th className="py-2 px-4 text-[var(--text-muted)]">B</th>
                  <th className="py-2 px-4 text-[var(--text-muted)]">Target</th>
                </tr>
              </thead>
              <tbody>
                {dataset.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < dataset.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                    <td className="py-1.5 px-4 text-center">{row.inputs[0]}</td>
                    <td className="py-1.5 px-4 text-center">{row.inputs[1]}</td>
                    <td className="py-1.5 px-4 text-center" style={{ color: row.target === 1 ? '#00FF94' : '#FF6B9D', fontWeight: 700 }}>
                      {row.target}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dataset Editor for Custom */}
        {gate === 'CUSTOM' && (
          <DatasetEditor dataset={dataset} onChange={setDataset} />
        )}
      </div>

      {/* Hyperparameters */}
      <div className="glass-card p-4 space-y-3">
        <h3 className="font-bold text-sm gradient-text mb-1">Hyperparameters</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="section-label">Learning Rate (η)</div>
            <input type="number" step="0.01" min="0.01" max="2" value={lr} onChange={e => setLr(e.target.value)} className="neon-input" />
          </div>
          <div>
            <div className="section-label">Threshold (θ)</div>
            <input type="number" step="0.1" min="0" max="2" value={threshold} onChange={e => setThreshold(e.target.value)} className="neon-input" />
          </div>
          <div>
            <div className="section-label">Max Epochs</div>
            <input type="number" step="1" min="1" max="500" value={maxEpochs} onChange={e => setMaxEpochs(e.target.value)} className="neon-input" />
          </div>
          <div>
            <div className="section-label">Initial Bias</div>
            <input type="number" step="0.1" value={bias} onChange={e => setBias(e.target.value)} className="neon-input" disabled={useRandom} />
          </div>
        </div>

        {/* Weights */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="section-label">Initial Weights</div>
            <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] cursor-pointer">
              <input
                type="checkbox"
                checked={useRandom}
                onChange={e => setUseRandom(e.target.checked)}
              />
              Random
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="section-label text-[10px]">W₁</div>
              <input type="number" step="0.01" value={w1} onChange={e => setW1(e.target.value)} className="neon-input" disabled={useRandom} />
            </div>
            <div>
              <div className="section-label text-[10px]">W₂</div>
              <input type="number" step="0.01" value={w2} onChange={e => setW2(e.target.value)} className="neon-input" disabled={useRandom} />
            </div>
          </div>
          {!useRandom && (
            <button onClick={handleRandomize} className="mt-2 neon-btn neon-btn-ghost w-full py-2 text-xs flex items-center justify-center gap-1.5">
              <Shuffle size={13} /> Randomize Weights
            </button>
          )}
        </div>
      </div>

      {/* Train Button */}
      <button
        onClick={handleTrain}
        disabled={isTraining}
        className="neon-btn neon-btn-primary w-full py-4 text-[15px] font-bold"
      >
        <Play size={18} />
        {isTraining ? 'Training...' : 'Train Perceptron'}
      </button>
    </div>
  );
}
