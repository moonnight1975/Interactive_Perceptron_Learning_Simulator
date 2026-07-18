'use client';
import { useEffect, useRef } from 'react';
import { TruthTableRow } from '@/lib/mcpNeuron';

interface MCPTruthTableProps {
  rows: TruthTableRow[];
  highlightedRow: number;
  onRowClick: (index: number) => void;
  inputCount: number;
}

export default function MCPTruthTable({ rows, highlightedRow, onRowClick, inputCount }: MCPTruthTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && highlightedRow >= 0) {
      const row = containerRef.current.querySelector(`[data-row="${highlightedRow}"]`);
      row?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [highlightedRow]);

  if (rows.length === 0) {
    return <div className="text-center text-[var(--text-muted)] text-sm py-8">Configure a neuron to see the truth table.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm gradient-text">Auto-Generated Truth Table</h3>
        <span className="badge badge-primary">{rows.length} rows</span>
      </div>
      <div ref={containerRef} className="overflow-auto max-h-80 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <table className="training-table">
          <thead className="sticky top-0" style={{ background: 'rgba(5,5,16,0.95)', backdropFilter: 'blur(10px)' }}>
            <tr>
              {Array.from({ length: inputCount }, (_, i) => (
                <th key={i}>x<sub>{i+1}</sub></th>
              ))}
              <th>Y<sub>in</sub></th>
              <th>θ</th>
              <th>Compare</th>
              <th>Y</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                data-row={idx}
                onClick={() => onRowClick(idx)}
                className={`cursor-pointer transition-all ${idx === highlightedRow ? 'current-row' : 'hover:bg-[rgba(255,255,255,0.03)]'}`}
              >
                {row.inputValues.map((v, i) => (
                  <td key={i} style={{ color: v === 1 ? '#00D4FF' : 'var(--text-muted)' }}>{v}</td>
                ))}
                <td className="text-[#00D4FF] font-bold">{row.weightedSum}</td>
                <td className="text-[#FFB800]">{row.threshold}</td>
                <td style={{ color: row.comparisonMet ? '#00FF94' : '#FF4444', fontSize: 11 }}>{row.comparison}</td>
                <td style={{ color: row.output === 1 ? '#00FF94' : '#FF4444', fontWeight: 700, fontSize: 15 }}>{row.output}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-[var(--text-muted)] mt-2">Click any row to see step-by-step proof</div>
    </div>
  );
}
