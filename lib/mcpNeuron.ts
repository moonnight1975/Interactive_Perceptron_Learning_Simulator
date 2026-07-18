// McCulloch-Pitts Neuron Core Logic

export type InputType = 'excitatory' | 'inhibitory';

export interface MCPInput {
  value: number;     // 0 or 1
  weight: number;    // typically 1
  type: InputType;
  label: string;     // "x1", "x2", etc.
}

export interface MCPConfig {
  inputs: MCPInput[];
  threshold: number;
}

export interface MCPResult {
  inputs: MCPInput[];
  weightedSum: number;
  threshold: number;
  output: number;
  comparison: string;       // e.g., "2 ≥ 2" or "1 < 2"
  comparisonMet: boolean;
  sumTerms: string[];       // e.g., ["1×1", "0×1"]
  sumExpression: string;    // e.g., "1×1 + 0×1 = 1"
}

// ─── Threshold Calculator: θ ≥ nw − p ─────────────────────────

export function calculateThreshold(n: number, w: number, p: number): number {
  return n * w - p;
}

export function thresholdFormula(n: number, w: number, p: number): {
  expression: string;
  result: number;
  latex: string;
} {
  const result = calculateThreshold(n, w, p);
  return {
    expression: `θ ≥ (${n} × ${w}) − ${p} = ${result}`,
    result,
    latex: `\\theta \\geq (${n} \\times ${w}) - ${p} = ${result}`,
  };
}

// ─── Compute MCP Output for One Input Combination ────────────

export function computeMCP(inputs: MCPInput[], threshold: number): MCPResult {
  const sumTerms = inputs.map(inp => {
    const term = inp.value * inp.weight;
    return `${inp.value}×${inp.weight}`;
  });

  const weightedSum = inputs.reduce((sum, inp) => sum + inp.value * inp.weight, 0);

  const comparisonMet = weightedSum >= threshold;
  const output = comparisonMet ? 1 : 0;
  const comparison = `${weightedSum} ${comparisonMet ? '≥' : '<'} ${threshold}`;

  const termValues = inputs.map(inp => `${inp.value}×${inp.weight}`);
  const termResults = inputs.map(inp => inp.value * inp.weight);
  const sumExpression = `${termValues.join(' + ')} = ${termResults.join(' + ')} = ${weightedSum}`;

  return {
    inputs,
    weightedSum,
    threshold,
    output,
    comparison,
    comparisonMet,
    sumTerms,
    sumExpression,
  };
}

// ─── Generate All Input Combinations for n Inputs ────────────

export function generateInputCombinations(numInputs: number): number[][] {
  const total = Math.pow(2, numInputs);
  const combos: number[][] = [];
  for (let i = 0; i < total; i++) {
    const combo: number[] = [];
    for (let bit = numInputs - 1; bit >= 0; bit--) {
      combo.push((i >> bit) & 1);
    }
    combos.push(combo);
  }
  return combos;
}

// ─── Generate Full Truth Table ───────────────────────────────

export interface TruthTableRow extends MCPResult {
  rowIndex: number;
  inputValues: number[];
}

export function generateTruthTable(
  config: MCPConfig
): TruthTableRow[] {
  const { inputs, threshold } = config;
  const numInputs = inputs.length;
  const combos = generateInputCombinations(numInputs);

  return combos.map((combo, rowIndex) => {
    const currentInputs = inputs.map((inp, i) => ({
      ...inp,
      value: combo[i],
    }));
    const result = computeMCP(currentInputs, threshold);
    return {
      ...result,
      rowIndex,
      inputValues: combo,
    };
  });
}

// ─── Create Default MCP Config ───────────────────────────────

export function createDefaultConfig(numInputs: number): MCPConfig {
  const inputs: MCPInput[] = Array.from({ length: numInputs }, (_, i) => ({
    value: 0,
    weight: 1,
    type: 'excitatory' as InputType,
    label: `x${i + 1}`,
  }));
  const n = inputs.filter(i => i.type === 'excitatory').length;
  const w = 1;
  const p = inputs.filter(i => i.type === 'inhibitory').length;
  return {
    inputs,
    threshold: calculateThreshold(n, w, p),
  };
}
