'use client';
import { useState, useEffect } from 'react';
import { getHistory, clearHistory, deleteRecord, SimulationRecord } from '@/lib/history';
import { Clock, Trash2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface HistoryPanelProps {
  onLoad?: (record: SimulationRecord) => void;
  refreshTrigger?: number;
}

export default function HistoryPanel({ onLoad, refreshTrigger }: HistoryPanelProps) {
  const [history, setHistory] = useState<SimulationRecord[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, [refreshTrigger]);

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setHistory(getHistory());
  };

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <div className="glass-card p-5 text-center text-[var(--text-muted)] text-sm">
        <Clock size={24} className="mx-auto mb-2 opacity-40" />
        <div>No simulation history yet.</div>
        <div className="text-xs mt-1">Run a training session to save it here.</div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-[#6C63FF]" />
          <h3 className="font-bold text-sm gradient-text">Simulation History</h3>
        </div>
        <button
          onClick={handleClear}
          className="neon-btn neon-btn-ghost px-2 py-1 text-xs flex items-center gap-1"
        >
          <Trash2 size={12} /> Clear All
        </button>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {history.map(record => (
          <div
            key={record.id}
            className="rounded-xl p-3 flex items-center gap-3 transition-all"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: `1px solid ${record.converged ? 'rgba(0,255,148,0.15)' : 'rgba(255,68,68,0.15)'}`,
            }}
          >
            <div className="flex-shrink-0">
              {record.converged
                ? <CheckCircle size={18} className="text-[#00FF94]" />
                : <XCircle size={18} className="text-[#FF4444]" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs">{record.gateName}</span>
                <span className={`badge ${record.converged ? 'badge-success' : 'badge-danger'} text-[10px] px-1.5 py-0`}>
                  {record.converged ? 'Converged' : 'Failed'}
                </span>
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                Ep: {record.finalEpoch} · Acc: {record.accuracy.toFixed(0)}% · lr={record.learningRate} · θ={record.threshold}
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">
                {new Date(record.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <div className="flex gap-1.5">
              {onLoad && (
                <button
                  onClick={() => onLoad(record)}
                  className="text-[var(--text-muted)] hover:text-[#6C63FF] transition-colors"
                  title="Load configuration"
                >
                  <RefreshCw size={13} />
                </button>
              )}
              <button
                onClick={() => handleDelete(record.id)}
                className="text-[var(--text-muted)] hover:text-[#FF4444] transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
