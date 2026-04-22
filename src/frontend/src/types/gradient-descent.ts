export interface DescentStep {
  iteration: number;
  x: number;
  loss: number;
  gradient: number;
}

export type OptimizerType = "sgd" | "momentum" | "rmsprop" | "adam";

export type SimulationStatus =
  | "idle"
  | "running"
  | "paused"
  | "converged"
  | "diverged";

export interface SimulationConfig {
  learningRate: number;
  startX: number;
  optimizer: OptimizerType;
  momentum: number;
  maxIterations: number;
  convergenceThreshold: number;
  animationSpeed: number;
}

export interface GradientDescentState {
  config: SimulationConfig;
  steps: DescentStep[];
  currentStep: number;
  status: SimulationStatus;
  // Optimizer internal states
  velocity: number; // momentum / adam m1
  variance: number; // rmsprop / adam m2
  adamT: number; // adam time step
}
