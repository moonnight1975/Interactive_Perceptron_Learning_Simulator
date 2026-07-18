import { DataPoint } from './perceptron';

export type GateType = 'AND' | 'OR' | 'NAND' | 'NOR' | 'XOR' | 'CUSTOM';

export interface GateConfig {
  name: string;
  type: GateType;
  dataset: DataPoint[];
  linearlySepaerable: boolean;
  description: string;
}

export const LOGIC_GATES: Record<GateType, GateConfig> = {
  AND: {
    name: 'AND Gate',
    type: 'AND',
    linearlySepaerable: true,
    description: 'Output is 1 only when ALL inputs are 1',
    dataset: [
      { inputs: [0, 0], target: 0 },
      { inputs: [0, 1], target: 0 },
      { inputs: [1, 0], target: 0 },
      { inputs: [1, 1], target: 1 },
    ],
  },
  OR: {
    name: 'OR Gate',
    type: 'OR',
    linearlySepaerable: true,
    description: 'Output is 1 when ANY input is 1',
    dataset: [
      { inputs: [0, 0], target: 0 },
      { inputs: [0, 1], target: 1 },
      { inputs: [1, 0], target: 1 },
      { inputs: [1, 1], target: 1 },
    ],
  },
  NAND: {
    name: 'NAND Gate',
    type: 'NAND',
    linearlySepaerable: true,
    description: 'Output is 0 only when ALL inputs are 1 (NOT AND)',
    dataset: [
      { inputs: [0, 0], target: 1 },
      { inputs: [0, 1], target: 1 },
      { inputs: [1, 0], target: 1 },
      { inputs: [1, 1], target: 0 },
    ],
  },
  NOR: {
    name: 'NOR Gate',
    type: 'NOR',
    linearlySepaerable: true,
    description: 'Output is 1 only when ALL inputs are 0 (NOT OR)',
    dataset: [
      { inputs: [0, 0], target: 1 },
      { inputs: [0, 1], target: 0 },
      { inputs: [1, 0], target: 0 },
      { inputs: [1, 1], target: 0 },
    ],
  },
  XOR: {
    name: 'XOR Gate',
    type: 'XOR',
    linearlySepaerable: false,
    description: 'Output is 1 when inputs DIFFER (not linearly separable)',
    dataset: [
      { inputs: [0, 0], target: 0 },
      { inputs: [0, 1], target: 1 },
      { inputs: [1, 0], target: 1 },
      { inputs: [1, 1], target: 0 },
    ],
  },
  CUSTOM: {
    name: 'Custom Dataset',
    type: 'CUSTOM',
    linearlySepaerable: true,
    description: 'Define your own training data',
    dataset: [
      { inputs: [0, 0], target: 0 },
      { inputs: [0, 1], target: 0 },
      { inputs: [1, 0], target: 0 },
      { inputs: [1, 1], target: 1 },
    ],
  },
};
