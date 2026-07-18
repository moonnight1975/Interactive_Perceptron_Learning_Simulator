import Navbar from '@/components/ui/Navbar';
import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const GATES = [
  {
    name: 'AND Gate',
    color: '#6C63FF',
    weights: 'w1 = 1, w2 = 1',
    threshold: 'theta = 2',
    formula: 'theta >= (2x1)-0 = 2',
    truth: [[0,0,0],[0,1,0],[1,0,0],[1,1,1]],
    desc: 'Output is 1 only when ALL inputs are 1. Both excitatory inputs must fire to meet the threshold.',
    inputType: 'Both excitatory',
  },
  {
    name: 'OR Gate',
    color: '#00D4FF',
    weights: 'w1 = 1, w2 = 1',
    threshold: 'theta = 1',
    formula: 'theta = 1 (any single input enough)',
    truth: [[0,0,0],[0,1,1],[1,0,1],[1,1,1]],
    desc: 'Output is 1 when ANY input is 1. Only one excitatory input needs to fire.',
    inputType: 'Both excitatory',
  },
  {
    name: 'NAND Gate',
    color: '#FF6B9D',
    weights: 'w1 = -1, w2 = -1',
    threshold: 'theta = -1',
    formula: 'Using inhibitory inputs',
    truth: [[0,0,1],[0,1,1],[1,0,1],[1,1,0]],
    desc: 'NOT AND. Output is 0 only when ALL inputs are 1. Uses inhibitory connections.',
    inputType: 'Both inhibitory',
  },
  {
    name: 'NOR Gate',
    color: '#FFB800',
    weights: 'w1 = -1, w2 = -1',
    threshold: 'theta = 0',
    formula: 'Using inhibitory inputs',
    truth: [[0,0,1],[0,1,0],[1,0,0],[1,1,0]],
    desc: 'NOT OR. Output is 1 only when ALL inputs are 0. Uses inhibitory connections.',
    inputType: 'Both inhibitory',
  },
  {
    name: 'NOT Gate',
    color: '#00FF94',
    weights: 'w1 = -1',
    threshold: 'theta = 0',
    formula: 'Single inhibitory input',
    truth: [[0,1],[1,0]],
    desc: 'Inverter. Single inhibitory input. Output is the opposite of the input.',
    inputType: 'Single inhibitory',
  },
];

export default function MCPLibraryPage() {
  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 badge badge-primary mb-4">
            <BookOpen size={14} /> Logic Gate Library
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            MCP <span className="gradient-text">Logic Gate</span> Library
          </h1>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
            Pre-built McCulloch-Pitts neuron configurations for all fundamental logic gates.
            Each shows weights, threshold derivation, and complete truth table.
          </p>
        </div>

        <div className="space-y-6">
          {GATES.map((gate) => (
            <div key={gate.name} className="glass-card glass-card-hover p-6" style={{ border: `1px solid ${gate.color}25` }}>
              <div className="grid md:grid-cols-[1fr_auto] gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${gate.color}20`, border: `1px solid ${gate.color}40` }}>
                      <span className="font-mono font-black text-sm" style={{ color: gate.color }}>{gate.name.split(' ')[0]}</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: gate.color }}>{gate.name}</h2>
                      <p className="text-xs text-[var(--text-muted)]">{gate.desc}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="stat-card">
                      <div className="stat-value text-sm" style={{ color: gate.color }}>{gate.weights}</div>
                      <div className="stat-label">Weights</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value text-sm text-[#FFB800]">{gate.threshold}</div>
                      <div className="stat-label">Threshold</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value text-xs text-[#00D4FF]">{gate.formula}</div>
                      <div className="stat-label">Formula</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value text-xs" style={{ color: gate.color }}>{gate.inputType}</div>
                      <div className="stat-label">Type</div>
                    </div>
                  </div>
                </div>

                <div className="min-w-[160px]">
                  <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${gate.color}22` }}>
                    <table className="w-full text-xs font-mono text-center">
                      <thead>
                        <tr style={{ background: `${gate.color}10`, borderBottom: `1px solid ${gate.color}20` }}>
                          {gate.name === 'NOT Gate' ? (
                            <><th className="py-2 px-3 text-[var(--text-muted)]">x</th><th className="py-2 px-3 text-[var(--text-muted)]">Y</th></>
                          ) : (
                            <><th className="py-2 px-3 text-[var(--text-muted)]">A</th><th className="py-2 px-3 text-[var(--text-muted)]">B</th><th className="py-2 px-3 text-[var(--text-muted)]">Y</th></>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {gate.truth.map((row, i) => (
                          <tr key={i} style={{ borderBottom: i < gate.truth.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                            {row.map((v, j) => (
                              <td key={j} className="py-1.5 px-3" style={{
                                color: j === row.length - 1 ? (v === 1 ? '#00FF94' : '#FF6B9D') : 'var(--text)',
                                fontWeight: j === row.length - 1 ? 700 : 400
                              }}>{v}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/mcp" className="neon-btn neon-btn-primary text-base px-8 py-4 inline-flex">
            Open Simulator <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
