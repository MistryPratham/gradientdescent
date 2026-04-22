import type {
  DescentStep,
  OptimizerType,
  SimulationConfig,
} from "@/types/gradient-descent";

/** Loss function: f(x) = x² */
export function lossFunction(x: number): number {
  return x * x;
}

/** Gradient of loss: f'(x) = 2x */
export function gradient(x: number): number {
  return 2 * x;
}

/** Compute the parabola curve points for SVG rendering */
export function buildCurvePoints(
  xMin: number,
  xMax: number,
  steps = 200,
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin);
    points.push({ x, y: lossFunction(x) });
  }
  return points;
}

export interface StepOptimizerState {
  velocity: number;
  variance: number;
  adamT: number;
}

/** Compute next x position based on optimizer */
export function computeNextX(
  x: number,
  grad: number,
  config: SimulationConfig,
  state: StepOptimizerState,
  optimizer: OptimizerType,
): { nextX: number; nextState: StepOptimizerState } {
  const { learningRate, momentum } = config;
  const beta1 = 0.9;
  const beta2 = 0.999;
  const eps = 1e-8;

  switch (optimizer) {
    case "sgd":
      return {
        nextX: x - learningRate * grad,
        nextState: { ...state },
      };

    case "momentum": {
      const v = momentum * state.velocity + (1 - momentum) * grad;
      return {
        nextX: x - learningRate * v,
        nextState: { ...state, velocity: v },
      };
    }

    case "rmsprop": {
      const vr = 0.9 * state.variance + 0.1 * grad * grad;
      return {
        nextX: x - (learningRate / (Math.sqrt(vr) + eps)) * grad,
        nextState: { ...state, variance: vr },
      };
    }

    case "adam": {
      const t = state.adamT + 1;
      const m1 = beta1 * state.velocity + (1 - beta1) * grad;
      const m2 = beta2 * state.variance + (1 - beta2) * grad * grad;
      const mHat = m1 / (1 - beta1 ** t);
      const vHat = m2 / (1 - beta2 ** t);
      return {
        nextX: x - (learningRate / (Math.sqrt(vHat) + eps)) * mHat,
        nextState: { velocity: m1, variance: m2, adamT: t },
      };
    }

    default:
      return { nextX: x - learningRate * grad, nextState: { ...state } };
  }
}

/** Check if simulation has converged or diverged */
export function checkStatus(
  x: number,
  grad: number,
  iteration: number,
  config: SimulationConfig,
): "running" | "converged" | "diverged" {
  if (!Number.isFinite(x) || Math.abs(x) > 1e6) return "diverged";
  if (Math.abs(grad) < config.convergenceThreshold) return "converged";
  if (iteration >= config.maxIterations) return "converged";
  return "running";
}

// Re-export types for consumers that import from math
export type { DescentStep, SimulationConfig };
