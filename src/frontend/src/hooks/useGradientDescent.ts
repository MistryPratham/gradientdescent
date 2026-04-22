import { checkStatus, computeNextX, gradient, lossFunction } from "@/lib/math";
import type {
  GradientDescentState,
  SimulationConfig,
} from "@/types/gradient-descent";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_CONFIG: SimulationConfig = {
  learningRate: 0.1,
  startX: 4.0,
  optimizer: "sgd",
  momentum: 0.9,
  maxIterations: 200,
  convergenceThreshold: 1e-6,
  animationSpeed: 300,
};

function buildInitialState(config: SimulationConfig): GradientDescentState {
  const x0 = config.startX;
  return {
    config,
    steps: [
      { iteration: 0, x: x0, loss: lossFunction(x0), gradient: gradient(x0) },
    ],
    currentStep: 0,
    status: "idle",
    velocity: 0,
    variance: 0,
    adamT: 0,
  };
}

export function useGradientDescent() {
  const [state, setState] = useState<GradientDescentState>(() =>
    buildInitialState(DEFAULT_CONFIG),
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /** Compute and append one more step, returns whether simulation should continue */
  const advanceStep = useCallback(
    (prev: GradientDescentState): GradientDescentState => {
      if (prev.status === "converged" || prev.status === "diverged")
        return prev;

      const lastStep = prev.steps[prev.steps.length - 1];
      const { x, iteration } = lastStep;
      const grad = gradient(x);

      const optimizerState = {
        velocity: prev.velocity,
        variance: prev.variance,
        adamT: prev.adamT,
      };

      const { nextX, nextState } = computeNextX(
        x,
        grad,
        prev.config,
        optimizerState,
        prev.config.optimizer,
      );

      const nextGrad = gradient(nextX);
      const newStep = {
        iteration: iteration + 1,
        x: nextX,
        loss: lossFunction(nextX),
        gradient: nextGrad,
      };

      const terminalStatus = checkStatus(
        nextX,
        nextGrad,
        iteration + 1,
        prev.config,
      );
      const newSteps = [...prev.steps, newStep];

      return {
        ...prev,
        steps: newSteps,
        currentStep: newSteps.length - 1,
        status: terminalStatus === "running" ? "running" : terminalStatus,
        velocity: nextState.velocity,
        variance: nextState.variance,
        adamT: nextState.adamT,
      };
    },
    [],
  );

  const play = useCallback(() => {
    setState((prev) => {
      if (prev.status === "converged" || prev.status === "diverged")
        return prev;
      return { ...prev, status: "running" };
    });
  }, []);

  const pause = useCallback(() => {
    stopInterval();
    setState((prev) => {
      if (prev.status !== "running") return prev;
      return { ...prev, status: "paused" };
    });
  }, [stopInterval]);

  const step = useCallback(() => {
    stopInterval();
    setState((prev) => {
      const next = advanceStep(prev);
      return {
        ...next,
        status: next.status === "running" ? "paused" : next.status,
      };
    });
  }, [advanceStep, stopInterval]);

  const reset = useCallback(() => {
    stopInterval();
    setState((prev) => buildInitialState(prev.config));
  }, [stopInterval]);

  const updateConfig = useCallback(
    <K extends keyof SimulationConfig>(key: K, value: SimulationConfig[K]) => {
      setState((prev) => {
        const newConfig = { ...prev.config, [key]: value };
        const newState = buildInitialState(newConfig);
        // Preserve running if it was running
        return { ...newState, status: "idle" };
      });
      stopInterval();
    },
    [stopInterval],
  );

  // Animation loop
  useEffect(() => {
    if (state.status === "running") {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const next = advanceStep(prev);
          if (next.status === "converged" || next.status === "diverged") {
            stopInterval();
          }
          return next;
        });
      }, state.config.animationSpeed);
    } else {
      stopInterval();
    }
    return stopInterval;
  }, [state.status, state.config.animationSpeed, advanceStep, stopInterval]);

  const currentStepData =
    state.steps[state.currentStep] ?? state.steps[state.steps.length - 1];

  return {
    state,
    currentStepData,
    play,
    pause,
    step,
    reset,
    updateConfig,
    isPlaying: state.status === "running",
    isTerminated: state.status === "converged" || state.status === "diverged",
  };
}
