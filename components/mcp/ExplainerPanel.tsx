'use client';
import { MessageCircle } from 'lucide-react';

interface ExplainerPanelProps {
  explanation: string;
}

export default function ExplainerPanel({ explanation }: ExplainerPanelProps) {
  if (!explanation) {
    return (
      <div className="glass-card p-5 text-center text-[var(--text-muted)] text-sm">
        <MessageCircle size={28} className="mx-auto mb-2 opacity-40" />
        <div>Select an input combination to see the explanation.</div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5" style={{ border: '1px solid rgba(108,99,255,0.25)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4FF)' }}>
          <MessageCircle size={14} className="text-white" />
        </div>
        <h3 className="font-bold text-sm gradient-text">Explain Like Teacher</h3>
      </div>
      <div className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(108,99,255,0.15)' }}>
        {explanation}
      </div>
    </div>
  );
}
