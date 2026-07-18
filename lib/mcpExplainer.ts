import { MCPInput, MCPResult, MCPConfig, calculateThreshold } from './mcpNeuron';
import { MCPGatePreset } from './mcpGates';

// ─── Explain Threshold Calculation ──────────────────────────

export function explainThresholdCalc(n: number, w: number, p: number): string {
  const theta = calculateThreshold(n, w, p);
  const excWord = n === 1 ? 'input' : 'inputs';
  const inhWord = p === 1 ? 'input' : 'inputs';

  let text = `We have ${n} excitatory ${excWord}, each with weight ${w}`;
  if (p > 0) {
    text += `, and ${p} inhibitory ${inhWord}`;
  } else {
    text += `, and no inhibitory inputs`;
  }
  text += `. Using the McCulloch-Pitts threshold formula:\n\n`;
  text += `θ ≥ nw − p = (${n} × ${w}) − ${p} = ${theta}\n\n`;
  text += `Therefore, the recommended threshold is θ = ${theta}.`;

  return text;
}

// ─── Explain Single Computation ──────────────────────────────

export function explainComputation(
  inputValues: number[],
  weights: number[],
  threshold: number,
  result: MCPResult
): string {
  const n = inputValues.length;
  const inputLabels = inputValues.map((v, i) => `x${i + 1} = ${v}`).join(', ');

  let text = `For the input combination (${inputValues.join(', ')}):\n\n`;

  // Step 1: Weighted sum
  const terms = inputValues.map((v, i) => `${v} × ${weights[i]}`);
  const termResults = inputValues.map((v, i) => v * weights[i]);
  text += `Step 1 — Weighted Sum:\n`;
  text += `Yᵢₙ = ${terms.join(' + ')} = ${termResults.join(' + ')} = ${result.weightedSum}\n\n`;

  // Step 2: Threshold
  text += `Step 2 — Threshold:\nθ = ${threshold}\n\n`;

  // Step 3: Comparison
  text += `Step 3 — Comparison:\n`;
  if (result.comparisonMet) {
    text += `${result.weightedSum} ≥ ${threshold} ✓ (threshold is met)\n\n`;
  } else {
    text += `${result.weightedSum} < ${threshold} ✗ (threshold is NOT met)\n\n`;
  }

  // Step 4: Output
  text += `Step 4 — Output:\n`;
  if (result.output === 1) {
    text += `Y = 1 — The neuron FIRES! The weighted sum meets or exceeds the threshold.`;
  } else {
    text += `Y = 0 — The neuron does NOT fire. The weighted sum is below the threshold.`;
  }

  return text;
}

// ─── Explain Gate Design ─────────────────────────────────────

export function explainGate(preset: MCPGatePreset): string {
  const { name, type, n, w, p, threshold, inputs } = preset;

  let text = `The ${name} is designed using a McCulloch-Pitts neuron.\n\n`;

  if (type === 'NOT') {
    text += `It uses a single inhibitory input with weight −1 and threshold θ = 0.\n\n`;
    text += `When the input is 0: Yᵢₙ = 0×(−1) = 0 ≥ 0, so output = 1.\n`;
    text += `When the input is 1: Yᵢₙ = 1×(−1) = −1 < 0, so output = 0.\n\n`;
    text += `This perfectly implements the NOT function — the output is the inverse of the input.`;
    return text;
  }

  const excitatoryCount = inputs.filter(i => i.type === 'excitatory').length;
  const inhibitoryCount = inputs.filter(i => i.type === 'inhibitory').length;

  if (excitatoryCount > 0) {
    text += `There are ${excitatoryCount} excitatory input${excitatoryCount > 1 ? 's' : ''}, each with weight ${Math.abs(inputs.find(i => i.type === 'excitatory')?.weight ?? w)}`;
  }
  if (inhibitoryCount > 0) {
    if (excitatoryCount > 0) text += ', and ';
    else text += 'There are ';
    text += `${inhibitoryCount} inhibitory input${inhibitoryCount > 1 ? 's' : ''}, each with weight ${inputs.find(i => i.type === 'inhibitory')?.weight ?? -1}`;
  }
  text += '.\n\n';

  if (type === 'AND' || type === 'OR') {
    text += `According to the McCulloch-Pitts threshold rule:\n`;
    text += `θ ≥ nw − p = (${n} × ${w}) − ${p} = ${n * w - p}\n\n`;
    if (type === 'AND') {
      text += `For AND, we set θ = ${threshold} so that ALL inputs must be active to reach the threshold.\n`;
    } else {
      text += `For OR, we set θ = ${threshold} so that ANY single active input is enough to reach the threshold.\n`;
    }
  } else {
    text += `The threshold is set to θ = ${threshold}.\n`;
  }

  text += `\nThis configuration correctly produces the ${name} truth table.`;
  return text;
}

// ─── Full Teacher Explanation for Current State ──────────────

export function teacherExplanation(
  gateName: string,
  inputValues: number[],
  weights: number[],
  threshold: number,
  result: MCPResult,
  n: number,
  w: number,
  p: number
): string {
  const excWord = n === 1 ? 'input' : 'inputs';
  const inhPart = p > 0 ? `, and ${p} inhibitory input${p > 1 ? 's' : ''}` : ', and no inhibitory inputs';

  let text = `There ${n === 1 ? 'is' : 'are'} ${n} excitatory ${excWord}, each with weight ${w}${inhPart}. `;
  text += `According to the McCulloch-Pitts threshold rule, θ ≥ nw − p = (${n} × ${w}) − ${p} = ${calculateThreshold(n, w, p)}. `;
  text += `The threshold is set to θ = ${threshold}. `;
  text += `For the input (${inputValues.join(', ')}), the weighted sum is Yᵢₙ = ${result.weightedSum}`;

  if (result.comparisonMet) {
    text += `, which meets the threshold (${result.weightedSum} ≥ ${threshold}), so the neuron fires and the output is 1.`;
  } else {
    text += `, which does not meet the threshold (${result.weightedSum} < ${threshold}), so the neuron does not fire and the output is 0.`;
  }

  return text;
}
