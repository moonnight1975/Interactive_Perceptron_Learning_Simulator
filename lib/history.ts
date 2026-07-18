import { TrainingResult } from './perceptron';
import { GateType } from './logicGates';

export interface SimulationRecord {
  id: string;
  timestamp: number;
  gate: GateType;
  gateName: string;
  learningRate: number;
  threshold: number;
  maxEpochs: number;
  initialWeights: number[];
  initialBias: number;
  converged: boolean;
  finalEpoch: number;
  finalWeights: number[];
  finalBias: number;
  accuracy: number;
  totalSteps: number;
}

const HISTORY_KEY = 'perceptron_history';
const MAX_HISTORY = 10;

export function saveSimulation(
  gate: GateType,
  gateName: string,
  learningRate: number,
  threshold: number,
  maxEpochs: number,
  initialWeights: number[],
  initialBias: number,
  result: TrainingResult
): SimulationRecord {
  const record: SimulationRecord = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    gate,
    gateName,
    learningRate,
    threshold,
    maxEpochs,
    initialWeights,
    initialBias,
    converged: result.converged,
    finalEpoch: result.finalEpoch,
    finalWeights: result.finalWeights,
    finalBias: result.finalBias,
    accuracy: result.accuracy,
    totalSteps: result.steps.length,
  };

  const history = getHistory();
  history.unshift(record);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return record;
}

export function getHistory(): SimulationRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function deleteRecord(id: string): void {
  const history = getHistory().filter(r => r.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
