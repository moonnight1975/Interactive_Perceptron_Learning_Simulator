'use client';
import { useState, useCallback, useMemo } from 'react';
import Navbar from '@/components/ui/Navbar';
import ThresholdDesigner from '@/components/mcp/ThresholdDesigner';
import MCPNeuronVisualizer from '@/components/mcp/MCPNeuronVisualizer';
import MCPTruthTable from '@/components/mcp/MCPTruthTable';
import MCPMathProof from '@/components/mcp/MCPMathProof';
import MCPFormulaPanel from '@/components/mcp/MCPFormulaPanel';
import GateBuilder from '@/components/mcp/GateBuilder';
import ExplainerPanel from '@/components/mcp/ExplainerPanel';
import ComparisonPanel from '@/components/mcp/ComparisonPanel';
import { MCPInput, MCPConfig, computeMCP, generateTruthTable, TruthTableRow } from '@/lib/mcpNeuron';
import { MCPGateType, MCP_GATE_PRESETS, getGateConfig } from '@/lib/mcpGates';
import { teacherExplanation, explainGate } from '@/lib/mcpExplainer';
import { Brain, Network, Table, Calculator, BookOpen, Settings, MessageCircle, ArrowLeftRight } from 'lucide-react';
import Link from 'next/link';

type RightTab = 'neuron' | 'truth-table' | 'math' | 'formulas' | 'compare';

export default function MCPPage() {
  const [gate, setGate] = useState<MCPGateType>('AND');
  const [config, setConfig] = useState<MCPConfig>(getGateConfig('AND'));
  const [highlightedRow, setHighlightedRow] = useState<number>(3); // default (1,1) for AND
  const [rightTab, setRightTab] = useState<RightTab>('neuron');
  const [showExplainer, setShowExplainer] = useState(false);

  const preset = MCP_GATE_PRESETS[gate];

  // Generate truth table from current config
  const truthTable = useMemo(() => generateTruthTable(config), [config]);

  // Current result for highlighted row
  const currentResult = useMemo(() => {
    if (highlightedRow < 0 || highlightedRow >= truthTable.length) return null;
    return truthTable[highlightedRow];
  }, [truthTable, highlightedRow]);

  // Handle gate change
  const handleGateChange = useCallback((g: MCPGateType) => {
    setGate(g);
    if (g !== 'CUSTOM') {
      const newConfig = getGateConfig(g);
      setConfig(newConfig);
      // Highlight last row to show gate's key behavior
      const table = generateTruthTable(newConfig);
      setHighlightedRow(table.length - 1);
    }
    setShowExplainer(false);
  }, []);

  // Handle threshold calculated from designer
  const handleThresholdCalculated = useCallback((theta: number, n: number, w: number, p: number) => {
    setConfig(prev => ({ ...prev, threshold: theta }));
  }, []);

  // Handle gate builder changes
  const handleGateBuilderChange = useCallback((inputs: MCPInput[], threshold: number) => {
    setConfig({ inputs, threshold });
    setGate('CUSTOM');
    setHighlightedRow(0);
  }, []);

  // Handle row click
  const handleRowClick = useCallback((index: number) => {
    setHighlightedRow(index);
  }, []);

  // Teacher explanation text
  const explanationText = useMemo(() => {
    if (!currentResult) return '';
    const excInputs = config.inputs.filter(i => i.type === 'excitatory');
    const n = excInputs.length;
    const w = excInputs[0]?.weight ?? 1;
    const p = config.inputs.filter(i => i.type === 'inhibitory').length;
    return teacherExplanation(
      preset.name,
      currentResult.inputValues,
      config.inputs.map(i => i.weight),
      config.threshold,
      currentResult,
      n, Math.abs(w), p
    );
  }, [currentResult, config, preset]);

  const RIGHT_TABS = [
    { id: 'neuron' as const, label: 'Neuron', icon: Network },
    { id: 'truth-table' as const, label: 'Truth Table', icon: Table },
    { id: 'math' as const, label: 'Proof', icon: Calculator },
    { id: 'formulas' as const, label: 'Formulas', icon: BookOpen },
    { id: 'compare' as const, label: 'Compare', icon: ArrowLeftRight },
  ];

  return (
    <div className="min-h-screen pt-16">
      <Navbar />

      {/* Header */}
      <div className="px-6 pt-6 pb-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFB800, #FF6B9D)' }}>
            <Brain size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-black gradient-text-accent">McCulloch-Pitts Neuron Lab</h1>
        </div>
        <p className="text-[var(--text-muted)] text-xs ml-11">
          Design and analyze MCP neurons with automatic threshold calculation using θ ≥ nw − p.
          <Link href="/mcp/library" className="ml-2 text-[#6C63FF] hover:underline">Gate Library →</Link>
          <Link href="/mcp/quiz" className="ml-2 text-[#FF6B9D] hover:underline">Quiz →</Link>
        </p>
      </div>

      {/* Main Layout */}
      <div className="px-6 pb-8 max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">
        {/* ── Left Panel ──────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Gate Selector */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-[#6C63FF]" />
              <h3 className="font-bold text-sm gradient-text">Logic Gate</h3>
            </div>
            <div>
              <div className="section-label">Select Gate</div>
              <select
                value={gate}
                onChange={e => handleGateChange(e.target.value as MCPGateType)}
                className="neon-select"
              >
                {(Object.keys(MCP_GATE_PRESETS) as MCPGateType[]).map(g => (
                  <option key={g} value={g}>{MCP_GATE_PRESETS[g].name}</option>
                ))}
              </select>
              <p className="text-xs text-[var(--text-muted)] mt-1.5">{preset.description}</p>
            </div>

            {/* Formula Steps */}
            {gate !== 'CUSTOM' && (
              <div className="formula-box">
                <div className="section-label mb-2">Threshold Derivation</div>
                <div className="space-y-1 text-xs font-mono">
                  {preset.formulaSteps.map((step, i) => (
                    <div key={i} style={{ color: i === preset.formulaSteps.length - 1 ? '#FFB800' : 'var(--text-muted)' }}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Threshold Designer */}
          <ThresholdDesigner
            onThresholdCalculated={handleThresholdCalculated}
            initialN={preset.n}
            initialW={preset.w}
            initialP={preset.p}
          />

          {/* Gate Builder */}
          <GateBuilder
            onConfigChange={handleGateBuilderChange}
            initialInputs={config.inputs}
            initialThreshold={config.threshold}
          />

          {/* Explain Button */}
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="neon-btn neon-btn-secondary w-full py-3 text-sm"
          >
            <MessageCircle size={16} />
            {showExplainer ? 'Hide Explanation' : '🎓 Explain Like Teacher'}
          </button>
        </div>

        {/* ── Right Panel ─────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="stat-card">
              <div className="stat-value gradient-text">{config.inputs.length}</div>
              <div className="stat-label">Inputs</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-[#FFB800]">{config.threshold}</div>
              <div className="stat-label">Threshold</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-[#00D4FF]">{currentResult?.weightedSum ?? '−'}</div>
              <div className="stat-label">Y<sub>in</sub></div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: currentResult?.output === 1 ? '#00FF94' : '#FF4444' }}>
                {currentResult?.output ?? '−'}
              </div>
              <div className="stat-label">Output</div>
            </div>
          </div>

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
          {rightTab === 'neuron' && (
            <div className="glass-card p-5">
              <MCPNeuronVisualizer
                inputs={config.inputs}
                threshold={config.threshold}
                currentResult={currentResult}
                highlightedRow={highlightedRow}
              />
            </div>
          )}

          {rightTab === 'truth-table' && (
            <div className="glass-card p-4">
              <MCPTruthTable
                rows={truthTable}
                highlightedRow={highlightedRow}
                onRowClick={handleRowClick}
                inputCount={config.inputs.length}
              />
            </div>
          )}

          {rightTab === 'math' && (
            <MCPMathProof
              result={currentResult}
              threshold={config.threshold}
            />
          )}

          {rightTab === 'formulas' && (
            <MCPFormulaPanel />
          )}

          {rightTab === 'compare' && (
            <ComparisonPanel />
          )}

          {/* Show neuron + truth table together on neuron tab */}
          {rightTab === 'neuron' && (
            <div className="glass-card p-4">
              <MCPTruthTable
                rows={truthTable}
                highlightedRow={highlightedRow}
                onRowClick={handleRowClick}
                inputCount={config.inputs.length}
              />
            </div>
          )}

          {/* Explainer panel (visible when toggled) */}
          {showExplainer && <ExplainerPanel explanation={explanationText} />}

          {/* Always show math proof below neuron tab when a row is selected */}
          {rightTab === 'neuron' && currentResult && (
            <MCPMathProof result={currentResult} threshold={config.threshold} />
          )}
        </div>
      </div>
    </div>
  );
}
