import { TrainingStep, TrainingResult, DataPoint } from './perceptron';

// ─── CSV Export ─────────────────────────────────────────────────────────────

export function exportCSV(steps: TrainingStep[], gateName: string): void {
  const headers = [
    'Epoch', 'Sample', 'Input A', 'Input B', 'W1', 'W2', 'Bias',
    'Weighted Sum', 'Activation', 'Target', 'Error', 'New W1', 'New W2', 'New Bias', 'Correct'
  ];

  const rows = steps.map(s => [
    s.epoch,
    s.sampleIndex + 1,
    s.inputs[0],
    s.inputs[1],
    s.weights[0],
    s.weights[1],
    s.bias,
    s.weightedSum,
    s.activationOutput,
    s.target,
    s.error,
    s.updatedWeights[0],
    s.updatedWeights[1],
    s.updatedBias,
    s.isCorrect ? 'Yes' : 'No',
  ]);

  const csvContent = [headers, ...rows]
    .map(r => r.join(','))
    .join('\n');

  downloadFile(
    csvContent,
    `perceptron-${gateName.toLowerCase()}-training.csv`,
    'text/csv'
  );
}

// ─── JSON Export ─────────────────────────────────────────────────────────────

export function exportJSON(result: TrainingResult, gateName: string, dataset: DataPoint[]): void {
  const data = {
    gate: gateName,
    dataset,
    result: {
      converged: result.converged,
      finalWeights: result.finalWeights,
      finalBias: result.finalBias,
      finalEpoch: result.finalEpoch,
      accuracy: result.accuracy,
    },
    steps: result.steps,
  };
  downloadFile(
    JSON.stringify(data, null, 2),
    `perceptron-${gateName.toLowerCase()}-result.json`,
    'application/json'
  );
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
