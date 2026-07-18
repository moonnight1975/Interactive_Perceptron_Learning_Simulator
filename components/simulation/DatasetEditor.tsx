'use client';
import { useState } from 'react';
import { DataPoint } from '@/lib/perceptron';
import { Plus, Trash2 } from 'lucide-react';

interface DatasetEditorProps {
  dataset: DataPoint[];
  onChange: (dataset: DataPoint[]) => void;
}

export default function DatasetEditor({ dataset, onChange }: DatasetEditorProps) {
  const handleChange = (index: number, field: 'input0' | 'input1' | 'target', value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const updated = dataset.map((row, i) => {
      if (i !== index) return row;
      if (field === 'input0') return { ...row, inputs: [num, row.inputs[1]] };
      if (field === 'input1') return { ...row, inputs: [row.inputs[0], num] };
      return { ...row, target: num };
    });
    onChange(updated);
  };

  const addRow = () => {
    onChange([...dataset, { inputs: [0, 0], target: 0 }]);
  };

  const removeRow = (index: number) => {
    if (dataset.length <= 1) return;
    onChange(dataset.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="section-label mb-2">Dataset Editor</div>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' }}>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <th className="py-2 px-3 text-[var(--text-muted)] font-medium text-left">#</th>
              <th className="py-2 px-3 text-[var(--text-muted)] font-medium">Input A</th>
              <th className="py-2 px-3 text-[var(--text-muted)] font-medium">Input B</th>
              <th className="py-2 px-3 text-[var(--text-muted)] font-medium">Target</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {dataset.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td className="py-1.5 px-3 text-[var(--text-muted)]">{i + 1}</td>
                {(['input0', 'input1', 'target'] as const).map((field, fi) => (
                  <td key={field} className="py-1 px-2">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="1"
                      value={field === 'input0' ? row.inputs[0] : field === 'input1' ? row.inputs[1] : row.target}
                      onChange={e => handleChange(i, field, e.target.value)}
                      className="w-16 text-center rounded-md text-xs py-1 px-2 font-mono"
                      style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', color: 'var(--text)', outline: 'none' }}
                    />
                  </td>
                ))}
                <td className="py-1 px-2">
                  <button
                    onClick={() => removeRow(i)}
                    disabled={dataset.length <= 1}
                    className="text-[var(--text-muted)] hover:text-[#FF4444] transition-colors disabled:opacity-30"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-2">
          <button
            onClick={addRow}
            className="w-full py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition-all"
            style={{ border: '1px dashed rgba(108,99,255,0.3)', color: 'rgba(108,99,255,0.7)' }}
          >
            <Plus size={13} /> Add Row
          </button>
        </div>
      </div>
    </div>
  );
}
