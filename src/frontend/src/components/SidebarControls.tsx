import type { OptimizerType, SimulationConfig } from "@/types/gradient-descent";
import type { SimulationStatus } from "@/types/gradient-descent";
import { ChevronRight, Pause, Play, RotateCcw } from "lucide-react";

interface Props {
  config: SimulationConfig;
  onConfigChange: <K extends keyof SimulationConfig>(
    key: K,
    value: SimulationConfig[K],
  ) => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  isPlaying: boolean;
  isTerminated: boolean;
  status: SimulationStatus;
}

const OPTIMIZER_OPTIONS: { value: OptimizerType; label: string }[] = [
  { value: "sgd", label: "SGD" },
  { value: "momentum", label: "SGD + Momentum" },
  { value: "rmsprop", label: "RMSProp" },
  { value: "adam", label: "Adam" },
];

export function SidebarControls({
  config,
  onConfigChange,
  onPlay,
  onPause,
  onStep,
  onReset,
  isPlaying,
  isTerminated,
}: Props) {
  const canPlay = !isTerminated;

  return (
    <div className="p-4 space-y-5 animate-slide-down">
      {/* Section header */}
      <div className="pt-1">
        <p className="metric-label tracking-widest uppercase">Configuration</p>
      </div>

      {/* Learning Rate */}
      <div className="space-y-2" data-ocid="lr.section">
        <div className="flex justify-between items-center">
          <label htmlFor="lr-slider" className="metric-label">
            Learning Rate (α)
          </label>
          <span className="font-mono text-[11px] text-primary">
            {config.learningRate.toFixed(3)}
          </span>
        </div>
        <input
          id="lr-slider"
          data-ocid="lr.slider"
          type="range"
          min={0.001}
          max={0.5}
          step={0.001}
          value={config.learningRate}
          onChange={(e) =>
            onConfigChange("learningRate", Number.parseFloat(e.target.value))
          }
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-runnable-track]:rounded-full"
          style={{
            background: `linear-gradient(to right, oklch(0.65 0.22 200) 0%, oklch(0.65 0.22 200) ${
              ((config.learningRate - 0.001) / (0.5 - 0.001)) * 100
            }%, oklch(0.22 0 0) ${
              ((config.learningRate - 0.001) / (0.5 - 0.001)) * 100
            }%, oklch(0.22 0 0) 100%)`,
          }}
        />
        <div className="flex justify-between">
          <span className="font-mono text-[9px] text-muted-foreground">
            0.001
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">
            0.5
          </span>
        </div>

        {/* LR display + start x */}
        <div className="flex gap-2 pt-1">
          <div className="flex-1">
            <label htmlFor="lr-input" className="metric-label block mb-1">
              α value
            </label>
            <input
              id="lr-input"
              data-ocid="lr.input"
              type="number"
              min={0.001}
              max={0.5}
              step={0.001}
              value={config.learningRate}
              onChange={(e) => {
                const v = Math.max(
                  0.001,
                  Math.min(0.5, Number.parseFloat(e.target.value) || 0.001),
                );
                onConfigChange("learningRate", v);
              }}
              className="w-full bg-background border border-border rounded px-2 py-1.5 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="start-x-input" className="metric-label block mb-1">
              Start x₀
            </label>
            <input
              id="start-x-input"
              data-ocid="start_x.input"
              type="number"
              min={-10}
              max={10}
              step={0.5}
              value={config.startX}
              onChange={(e) =>
                onConfigChange("startX", Number.parseFloat(e.target.value) || 0)
              }
              className="w-full bg-background border border-border rounded px-2 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2" data-ocid="controls.section">
        <button
          type="button"
          data-ocid="run.primary_button"
          onClick={isPlaying ? onPause : onPlay}
          disabled={!canPlay}
          className="control-button control-button-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-40"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? "Pause Simulation" : "Run Simulation"}
        </button>

        <button
          type="button"
          data-ocid="step.button"
          onClick={onStep}
          disabled={isTerminated}
          className="control-button w-full flex items-center justify-center gap-2 py-2 text-xs text-foreground disabled:opacity-40"
        >
          <ChevronRight size={13} />
          Take Single Step
        </button>

        <button
          type="button"
          data-ocid="reset.button"
          onClick={onReset}
          className="control-button w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw size={13} />
          Reset Optimizer
        </button>
      </div>

      <div className="border-t border-border pt-4 space-y-4">
        {/* Optimizer select */}
        <div>
          <label
            htmlFor="optimizer-select"
            className="metric-label block mb-1.5"
          >
            Optimizer Select
          </label>
          <select
            id="optimizer-select"
            data-ocid="optimizer.select"
            value={config.optimizer}
            onChange={(e) =>
              onConfigChange("optimizer", e.target.value as OptimizerType)
            }
            className="w-full bg-background border border-border rounded px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
          >
            {OPTIMIZER_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-background"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Momentum (only relevant for momentum/adam) */}
        {(config.optimizer === "momentum" || config.optimizer === "adam") && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="momentum-slider" className="metric-label">
                Momentum (β)
              </label>
              <span className="font-mono text-[11px] text-muted-foreground">
                {config.momentum.toFixed(2)}
              </span>
            </div>
            <input
              id="momentum-slider"
              data-ocid="momentum.slider"
              type="range"
              min={0.1}
              max={0.99}
              step={0.01}
              value={config.momentum}
              onChange={(e) =>
                onConfigChange("momentum", Number.parseFloat(e.target.value))
              }
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, oklch(0.68 0.25 310) 0%, oklch(0.68 0.25 310) ${
                  ((config.momentum - 0.1) / (0.99 - 0.1)) * 100
                }%, oklch(0.22 0 0) ${
                  ((config.momentum - 0.1) / (0.99 - 0.1)) * 100
                }%, oklch(0.22 0 0) 100%)`,
              }}
            />
          </div>
        )}

        {/* Max iterations */}
        <div>
          <label htmlFor="max-iter-input" className="metric-label block mb-1.5">
            Max Iterations
          </label>
          <input
            id="max-iter-input"
            data-ocid="max_iter.input"
            type="number"
            min={10}
            max={1000}
            step={10}
            value={config.maxIterations}
            onChange={(e) =>
              onConfigChange(
                "maxIterations",
                Number.parseInt(e.target.value) || 200,
              )
            }
            className="w-full bg-background border border-border rounded px-2 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}
