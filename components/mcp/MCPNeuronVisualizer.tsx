'use client';
import { MCPInput, MCPResult } from '@/lib/mcpNeuron';

interface MCPNeuronVisualizerProps {
  inputs: MCPInput[];
  threshold: number;
  currentResult: MCPResult | null;
  highlightedRow: number;
}

function inputColor(inp: MCPInput, active: boolean): string {
  if (!active) return 'rgba(255,255,255,0.2)';
  return inp.type === 'excitatory' ? '#00FF94' : '#FF4444';
}

function connectionColor(inp: MCPInput): string {
  return inp.type === 'excitatory'
    ? `rgba(0, 255, 148, ${Math.min(0.9, Math.abs(inp.weight) * 0.5 + 0.2)})`
    : `rgba(255, 68, 68, ${Math.min(0.9, Math.abs(inp.weight) * 0.5 + 0.2)})`;
}

export default function MCPNeuronVisualizer({ inputs, threshold, currentResult, highlightedRow }: MCPNeuronVisualizerProps) {
  const n = inputs.length;
  const totalHeight = Math.max(200, n * 70 + 60);
  const svgWidth = 500;
  const svgHeight = totalHeight;

  const sumX = 260;
  const sumY = svgHeight / 2;
  const outX = 430;
  const outY = sumY;

  const inputSpacing = Math.min(70, (svgHeight - 80) / (n - 1 || 1));
  const startY = sumY - ((n - 1) * inputSpacing) / 2;

  const netValue = currentResult?.weightedSum ?? 0;
  const outputValue = currentResult?.output ?? 0;
  const isActive = currentResult?.comparisonMet ?? false;
  const outputColor = currentResult ? (isActive ? '#00FF94' : '#FF4444') : '#6C63FF';

  return (
    <div className="w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ maxWidth: 500, filter: 'drop-shadow(0 0 20px rgba(108,99,255,0.1))' }}>
        <defs>
          <marker id="mcp-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.3)" />
          </marker>
        </defs>

        {/* Input nodes and connections */}
        {inputs.map((inp, i) => {
          const y = startY + i * inputSpacing;
          const active = currentResult ? currentResult.inputs[i].value === 1 : false;
          const nodeColor = inputColor(inp, active);
          const connColor = connectionColor(inp);
          const isExcitatory = inp.type === 'excitatory';

          return (
            <g key={i}>
              {/* Connection line */}
              <line x1="95" y1={y} x2="228" y2={sumY}
                stroke={connColor}
                strokeWidth={Math.min(4, Math.abs(inp.weight) * 2 + 1)}
                strokeOpacity={active ? 1 : 0.3}
                style={{ transition: 'all 0.4s ease', filter: active ? `drop-shadow(0 0 6px ${connColor})` : 'none' }}
              />
              {/* Weight label */}
              <text x={160} y={y + (sumY - y) * 0.45 - 6}
                fill={isExcitatory ? '#00FF94' : '#FF4444'}
                fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600"
              >
                w={inp.weight}
              </text>

              {/* Input node */}
              <circle cx="70" cy={y} r="24"
                fill={`${nodeColor}15`}
                stroke={nodeColor}
                strokeWidth="2"
                style={{ transition: 'all 0.4s ease', filter: active ? `drop-shadow(0 0 10px ${nodeColor})` : 'none' }}
              />
              <text x="70" y={y - 5} fill="#E8E8F0" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">
                {inp.label}
              </text>
              <text x="70" y={y + 11} fill={nodeColor} fontSize="14" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">
                {currentResult ? currentResult.inputs[i].value : '−'}
              </text>
              {/* Type badge */}
              <text x="70" y={y + 24 + 12} fill={isExcitatory ? 'rgba(0,255,148,0.5)' : 'rgba(255,68,68,0.5)'} fontSize="8" textAnchor="middle">
                {isExcitatory ? 'EXC' : 'INH'}
              </text>
            </g>
          );
        })}

        {/* Summation node */}
        <circle cx={sumX} cy={sumY} r="36" fill="rgba(0,0,0,0.5)" stroke="rgba(0,212,255,0.5)" strokeWidth="2"
          style={{ transition: 'all 0.3s ease', filter: currentResult ? 'drop-shadow(0 0 15px rgba(0,212,255,0.3))' : 'none' }}
        />
        <text x={sumX} y={sumY - 8} fill="#00D4FF" fontSize="22" textAnchor="middle" fontWeight="700">Σ</text>
        <text x={sumX} y={sumY + 10} fill="rgba(0,212,255,0.8)" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">
          {currentResult ? netValue.toFixed(1) : '−'}
        </text>

        {/* Sum → Threshold comparison arrow */}
        <line x1={sumX + 38} y1={sumY} x2={outX - 60} y2={outY}
          stroke="rgba(255,255,255,0.25)" strokeWidth="2" markerEnd="url(#mcp-arrow)"
        />

        {/* Threshold node */}
        <rect x={outX - 58} y={outY - 28} width="50" height="56" rx="10"
          fill="rgba(0,0,0,0.5)" stroke="rgba(255,184,0,0.5)" strokeWidth="2"
          style={{ transition: 'all 0.3s ease' }}
        />
        <text x={outX - 33} y={outY - 8} fill="#FFB800" fontSize="9" textAnchor="middle" fontWeight="600">θ</text>
        <text x={outX - 33} y={outY + 6} fill="#FFB800" fontSize="13" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">{threshold}</text>
        <text x={outX - 33} y={outY + 20} fill="rgba(255,184,0,0.5)" fontSize="7" textAnchor="middle">THRESH</text>

        {/* Threshold → Output arrow */}
        <line x1={outX - 6} y1={outY} x2={outX + 10} y2={outY}
          stroke={outputColor} strokeWidth="2.5" markerEnd="url(#mcp-arrow)"
          style={{ transition: 'stroke 0.4s ease', filter: currentResult ? `drop-shadow(0 0 6px ${outputColor})` : 'none' }}
        />

        {/* Output node */}
        <circle cx={outX + 36} cy={outY} r="28" fill="rgba(0,0,0,0.5)" stroke={outputColor} strokeWidth="2.5"
          style={{ transition: 'all 0.4s ease', filter: currentResult ? `drop-shadow(0 0 18px ${outputColor}80)` : 'none' }}
        />
        <text x={outX + 36} y={outY - 5} fill={outputColor} fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">OUT</text>
        <text x={outX + 36} y={outY + 12} fill={outputColor} fontSize="18" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">
          {currentResult ? outputValue : '−'}
        </text>

        {/* Labels */}
        <text x="70" y={svgHeight - 8} fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">INPUTS</text>
        <text x={sumX} y={svgHeight - 8} fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">SUM</text>
        <text x={outX - 33} y={svgHeight - 8} fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">THRESHOLD</text>
        <text x={outX + 36} y={svgHeight - 8} fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">OUTPUT</text>
      </svg>

      {/* Result badges */}
      {currentResult && (
        <div className="flex gap-3 flex-wrap justify-center mt-3">
          <span className={`badge ${currentResult.comparisonMet ? 'badge-success' : 'badge-danger'}`}>
            {currentResult.comparison}
          </span>
          <span className={`badge ${currentResult.output === 1 ? 'badge-success' : 'badge-danger'}`}>
            Y = {currentResult.output}
          </span>
        </div>
      )}
    </div>
  );
}
