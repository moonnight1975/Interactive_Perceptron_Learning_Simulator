// Core Perceptron Training Logic

export interface DataPoint {
  inputs: number[];
  target: number;
}

export interface TrainingStep {
  epoch: number;
  sampleIndex: number;
  inputs: number[];
  weights: number[];
  bias: number;
  weightedSum: number;
  activationOutput: number;
  target: number;
  error: number;
  updatedWeights: number[];
  updatedBias: number;
  isCorrect: boolean;
}

export interface TrainingResult {
  steps: TrainingStep[];
  converged: boolean;
  finalWeights: number[];
  finalBias: number;
  finalEpoch: number;
  accuracy: number;
}

function stepActivation(net: number, threshold: number): number {
  return net >= threshold ? 1 : 0;
}

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

export function trainPerceptron(
  dataset: DataPoint[],
  initialWeights: number[],
  initialBias: number,
  learningRate: number,
  threshold: number,
  maxEpochs: number
): TrainingResult {
  const steps: TrainingStep[] = [];
  let weights = [...initialWeights];
  let bias = initialBias;
  let converged = false;
  let epoch = 0;

  for (epoch = 1; epoch <= maxEpochs; epoch++) {
    let epochErrors = 0;

    for (let i = 0; i < dataset.length; i++) {
      const { inputs, target } = dataset[i];

      // Weighted sum
      const weightedSum = round6(
        inputs.reduce((sum, x, j) => sum + x * weights[j], 0) + bias
      );

      // Activation
      const activationOutput = stepActivation(weightedSum, threshold);

      // Error
      const error = target - activationOutput;

      // Updated weights
      const updatedWeights = weights.map((w, j) =>
        round6(w + learningRate * error * inputs[j])
      );
      const updatedBias = round6(bias + learningRate * error);

      const step: TrainingStep = {
        epoch,
        sampleIndex: i,
        inputs: [...inputs],
        weights: [...weights],
        bias,
        weightedSum,
        activationOutput,
        target,
        error,
        updatedWeights: [...updatedWeights],
        updatedBias,
        isCorrect: error === 0,
      };

      steps.push(step);

      // Apply updates
      weights = updatedWeights;
      bias = updatedBias;

      if (error !== 0) epochErrors++;
    }

    if (epochErrors === 0) {
      converged = true;
      break;
    }
  }

  // Calculate accuracy on final weights
  let correct = 0;
  for (const { inputs, target } of dataset) {
    const net = inputs.reduce((sum, x, j) => sum + x * weights[j], 0) + bias;
    const out = stepActivation(net, threshold);
    if (out === target) correct++;
  }
  const accuracy = (correct / dataset.length) * 100;

  return {
    steps,
    converged,
    finalWeights: weights,
    finalBias: bias,
    finalEpoch: epoch > maxEpochs ? maxEpochs : epoch,
    accuracy,
  };
}

export function randomWeights(n: number): number[] {
  return Array.from({ length: n }, () => round6(Math.random() * 2 - 1));
}
