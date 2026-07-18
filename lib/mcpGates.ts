import { MCPConfig, MCPInput, InputType, calculateThreshold } from './mcpNeuron';

export type MCPGateType = 'AND' | 'OR' | 'NAND' | 'NOR' | 'NOT' | 'CUSTOM';

export interface MCPGatePreset {
  name: string;
  type: MCPGateType;
  description: string;
  inputs: MCPInput[];
  threshold: number;
  n: number; // excitatory count
  w: number; // weight per excitatory
  p: number; // inhibitory count
  formulaSteps: string[];
}

export const MCP_GATE_PRESETS: Record<MCPGateType, MCPGatePreset> = {
  AND: {
    name: 'AND Gate',
    type: 'AND',
    description: 'Output is 1 only when ALL inputs are 1. Requires all excitatory inputs to fire.',
    inputs: [
      { value: 0, weight: 1, type: 'excitatory', label: 'x₁' },
      { value: 0, weight: 1, type: 'excitatory', label: 'x₂' },
    ],
    threshold: 2,
    n: 2, w: 1, p: 0,
    formulaSteps: [
      'θ ≥ nw − p',
      'θ ≥ (2 × 1) − 0',
      'θ ≥ 2',
      'θ = 2',
    ],
  },
  OR: {
    name: 'OR Gate',
    type: 'OR',
    description: 'Output is 1 when ANY input is 1. Only one excitatory input needs to fire.',
    inputs: [
      { value: 0, weight: 1, type: 'excitatory', label: 'x₁' },
      { value: 0, weight: 1, type: 'excitatory', label: 'x₂' },
    ],
    threshold: 1,
    n: 2, w: 1, p: 0,
    formulaSteps: [
      'θ ≥ nw − p',
      'θ ≥ (2 × 1) − 0',
      'θ ≥ 2',
      'But for OR we need θ = 1 (fire if at least 1 input is active)',
      'θ = 1',
    ],
  },
  NAND: {
    name: 'NAND Gate',
    type: 'NAND',
    description: 'Output is 0 only when ALL inputs are 1 (NOT AND). Uses inhibitory connections.',
    inputs: [
      { value: 0, weight: -1, type: 'inhibitory', label: 'x₁' },
      { value: 0, weight: -1, type: 'inhibitory', label: 'x₂' },
    ],
    threshold: -1,
    n: 0, w: 1, p: 2,
    formulaSteps: [
      'NAND = NOT(AND)',
      'Using inhibitory inputs with weight −1',
      'θ = −1',
      'Yin = x₁(−1) + x₂(−1)',
      'Only (1,1) gives Yin = −2 < −1, so output = 0',
    ],
  },
  NOR: {
    name: 'NOR Gate',
    type: 'NOR',
    description: 'Output is 1 only when ALL inputs are 0 (NOT OR). Uses inhibitory connections.',
    inputs: [
      { value: 0, weight: -1, type: 'inhibitory', label: 'x₁' },
      { value: 0, weight: -1, type: 'inhibitory', label: 'x₂' },
    ],
    threshold: 0,
    n: 0, w: 1, p: 2,
    formulaSteps: [
      'NOR = NOT(OR)',
      'Using inhibitory inputs with weight −1',
      'θ = 0',
      'Yin = x₁(−1) + x₂(−1)',
      'Only (0,0) gives Yin = 0 ≥ 0, so output = 1',
    ],
  },
  NOT: {
    name: 'NOT Gate',
    type: 'NOT',
    description: 'Single input inverter. Output = NOT(input). Uses inhibitory connection.',
    inputs: [
      { value: 0, weight: -1, type: 'inhibitory', label: 'x₁' },
    ],
    threshold: 0,
    n: 0, w: 1, p: 1,
    formulaSteps: [
      'NOT uses a single inhibitory input',
      'w = −1, θ = 0',
      'If x=0: Yin = 0 ≥ 0 → Y = 1',
      'If x=1: Yin = −1 < 0 → Y = 0',
    ],
  },
  CUSTOM: {
    name: 'Custom Neuron',
    type: 'CUSTOM',
    description: 'Design your own McCulloch-Pitts neuron with custom weights and threshold.',
    inputs: [
      { value: 0, weight: 1, type: 'excitatory', label: 'x₁' },
      { value: 0, weight: 1, type: 'excitatory', label: 'x₂' },
    ],
    threshold: 2,
    n: 2, w: 1, p: 0,
    formulaSteps: ['Custom configuration'],
  },
};

export function getGateConfig(gate: MCPGateType): MCPConfig {
  const preset = MCP_GATE_PRESETS[gate];
  return {
    inputs: preset.inputs.map(inp => ({ ...inp })),
    threshold: preset.threshold,
  };
}
