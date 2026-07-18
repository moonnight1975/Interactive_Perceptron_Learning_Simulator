'use client';
import { useState, useEffect } from 'react';
import { MCPInput, InputType, calculateThreshold } from '@/lib/mcpNeuron';
import { Wrench, Plus, Minus } from 'lucide-react';

interface GateBuilderProps {
  onConfigChange: (inputs: MCPInput[], threshold: number) => void;
  initialInputs?: MCPInput[];
  initialThreshold?: number;
}

export default function GateBuilder({ onConfigChange, initialInputs, initialThreshold }: GateBuilderProps) {
  const [inputCount, setInputCount] = useState(initialInputs?.length ?? 2);
  const [inputs, setInputs] = useState<MCPInput[]>(
    initialInputs ?? [
      { value: 0, weight: 1, type: 'excitatory', label: 'x₁' },
      { value: 0, weight: 1, type: 'excitatory', label: 'x₂' },
    ]
  );
  const [manualThreshold, setManualThreshold] = useState<number>(initialThreshold ?? 2);
  const [useAutoThreshold, setUseAutoThreshold] = useState(true);

  useEffect(() => {
    if (initialInputs) {
      setInputs(initialInputs.map(i => ({ ...i })));
      setInputCount(initialInputs.length);
    }
    if (initialThreshold !== undefined) {
      setManualThreshold(initialThreshold);
    }
  }, [initialInputs, initialThreshold]);

  const updateInputCount = (newCount: number) => {
    if (newCount < 1 || newCount > 5) return;
    setInputCount(newCount);
    const newInputs: MCPInput[] = Array.from({ length: newCount }, (_, i) => {
      if (i < inputs.length) return { ...inputs[i], label: `x${String.fromCharCode(8321 + i)}` };
      return { value: 0, weight: 1, type: 'excitatory' as InputType, label: `x${String.fromCharCode(8321 + i)}` };
    });
    setInputs(newInputs);
    applyChanges(newInputs, manualThreshold, useAutoThreshold);
  };

  const updateInput = (index: number, field: 'weight' | 'type', value: number | InputType) => {
    const updated = inputs.map((inp, i) => {
      if (i !== index) return inp;
      if (field === 'weight') return { ...inp, weight: value as number };
      return { ...inp, type: value as InputType, weight: value === 'inhibitory' ? -1 : 1 };
    });
    setInputs(updated);
    applyChanges(updated, manualThreshold, useAutoThreshold);
  };

  const applyChanges = (currentInputs: MCPInput[], threshold: number, autoThresh: boolean) => {
    let finalThreshold = threshold;
    if (autoThresh) {
      const n = currentInputs.filter(i => i.type === 'excitatory').length;
      const w = currentInputs.find(i => i.type === 'excitatory')?.weight ?? 1;
      const p = currentInputs.filter(i => i.type === 'inhibitory').length;
      finalThreshold = calculateThreshold(n, Math.abs(w), p);
      setManualThreshold(finalThreshold);
    }
    onConfigChange(currentInputs, finalThreshold);
  };

  const handleThresholdChange = (val: number) => {
    setManualThreshold(val);
    onConfigChange(inputs, val);
  };

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Wrench size={16} className="text-[#FF6B9D]" />
        <h3 className="font-bold text-sm" style={{ color: '#FF6B9D' }}>Gate Builder</h3>
      </div>

      {/* Input count */}
      <div>
        <div className="section-label">Number of Inputs</div>
        <div className="flex items-center gap-3">
          <button onClick={() => updateInputCount(inputCount - 1)} disabled={inputCount <= 1} className="neon-btn neon-btn-ghost px-2 py-1"><Minus size={14} /></button>
          <span className="text-lg font-mono font-bold text-[#FF6B9D]">{inputCount}</span>
          <button onClick={() => updateInputCount(inputCount + 1)} disabled={inputCount >= 5} className="neon-btn neon-btn-ghost px-2 py-1"><Plus size={14} /></button>
        </div>
      </div>

      {/* Per-input config */}
      <div className="space-y-2">
        <div className="section-label">Input Configuration</div>
        {inputs.map((inp, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg p-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' }}>
            <span className="text-xs font-mono font-bold w-8" style={{ color: inp.type === 'excitatory' ? '#00FF94' : '#FF4444' }}>{inp.label}</span>
            <select
              value={inp.type}
              onChange={e => updateInput(i, 'type', e.target.value as InputType)}
              className="neon-select text-xs py-1.5 flex-1"
            >
              <option value="excitatory">Excitatory</option>
              <option value="inhibitory">Inhibitory</option>
            </select>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[var(--text-muted)]">w=</span>
              <input
                type="number"
                step="0.5"
                value={inp.weight}
                onChange={e => updateInput(i, 'weight', Number(e.target.value))}
                className="neon-input w-16 text-center text-xs py-1.5"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Threshold */}
      <div>
        <div className="flex items-center justify-between">
          <div className="section-label">Threshold (θ)</div>
          <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] cursor-pointer">
            <input type="checkbox" checked={useAutoThreshold} onChange={e => { setUseAutoThreshold(e.target.checked); applyChanges(inputs, manualThreshold, e.target.checked); }} />
            Auto (θ ≥ nw−p)
          </label>
        </div>
        <input
          type="number"
          step="0.5"
          value={manualThreshold}
          onChange={e => handleThresholdChange(Number(e.target.value))}
          className="neon-input"
          disabled={useAutoThreshold}
        />
      </div>
    </div>
  );
}
