import { buildCurvePoints } from "@/lib/math";
import type { DescentStep, SimulationConfig } from "@/types/gradient-descent";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useMemo } from "react";

const PLOT = {
  width: 680,
  height: 420,
  marginLeft: 60,
  marginRight: 24,
  marginTop: 28,
  marginBottom: 52,
  xMin: -4.5,
  xMax: 4.5,
  yMin: -0.3,
  yMax: 6.5,
};

function toSvgX(x: number): number {
  const plotW = PLOT.width - PLOT.marginLeft - PLOT.marginRight;
  return PLOT.marginLeft + ((x - PLOT.xMin) / (PLOT.xMax - PLOT.xMin)) * plotW;
}

function toSvgY(y: number): number {
  const plotH = PLOT.height - PLOT.marginTop - PLOT.marginBottom;
  return PLOT.marginTop + ((PLOT.yMax - y) / (PLOT.yMax - PLOT.yMin)) * plotH;
}

interface Props {
  steps: DescentStep[];
  currentStepIndex: number;
  config: SimulationConfig;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  isPlaying: boolean;
  onSpeedChange: (ms: number) => void;
}

export function PlotCanvas({
  steps,
  currentStepIndex,
  config,
  onPlay,
  onPause,
  onStep,
  onReset,
  isPlaying,
  onSpeedChange,
}: Props) {
  const curvePoints = useMemo(
    () => buildCurvePoints(PLOT.xMin, PLOT.xMax, 300),
    [],
  );
  const curvePath = curvePoints
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${toSvgX(p.x).toFixed(2)} ${toSvgY(p.y).toFixed(2)}`,
    )
    .join(" ");

  // Only render steps up to currentStepIndex
  const visibleSteps = steps.slice(0, currentStepIndex + 1);
  const descentPath = visibleSteps
    .map(
      (s, i) =>
        `${i === 0 ? "M" : "L"} ${toSvgX(s.x).toFixed(2)} ${toSvgY(s.loss).toFixed(2)}`,
    )
    .join(" ");

  const currentStep = steps[currentStepIndex];
  const markerX = currentStep ? toSvgX(currentStep.x) : null;
  const markerY = currentStep ? toSvgY(currentStep.loss) : null;

  // Axis ticks
  const xTicks = [-4, -2, 0, 2, 4];
  const yTicks = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="flex flex-col h-full">
      {/* Plot area */}
      <div className="flex-1 flex items-center justify-center p-4 plot-grid">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <h2 className="text-center font-display text-sm font-semibold text-foreground mb-2 tracking-wide">
            Visualizing Gradient Descent:&nbsp;
            <span className="font-mono text-primary italic">f(x) = x²</span>
          </h2>

          <svg
            data-ocid="plot.canvas_target"
            viewBox={`0 0 ${PLOT.width} ${PLOT.height}`}
            className="w-full h-auto"
            style={{ maxHeight: "calc(100vh - 220px)" }}
            role="img"
            aria-label="Gradient descent plot showing loss function f(x) = x squared"
          >
            <title>Gradient descent plot: f(x) = x squared</title>
            <defs>
              {/* Cyan glow for curve */}
              <filter
                id="glow-cyan"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Magenta glow for path */}
              <filter
                id="glow-magenta"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="markerGrad" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  stopColor="oklch(0.68 0.25 310)"
                  stopOpacity="0.9"
                />
                <stop
                  offset="100%"
                  stopColor="oklch(0.68 0.25 310)"
                  stopOpacity="0"
                />
              </radialGradient>
            </defs>

            {/* Grid lines */}
            {xTicks.map((tick) => (
              <line
                key={`xg-${tick}`}
                x1={toSvgX(tick)}
                y1={PLOT.marginTop}
                x2={toSvgX(tick)}
                y2={PLOT.height - PLOT.marginBottom}
                stroke="oklch(0.96 0 0 / 0.06)"
                strokeWidth="1"
              />
            ))}
            {yTicks.map((tick) => (
              <line
                key={`yg-${tick}`}
                x1={PLOT.marginLeft}
                y1={toSvgY(tick)}
                x2={PLOT.width - PLOT.marginRight}
                y2={toSvgY(tick)}
                stroke="oklch(0.96 0 0 / 0.06)"
                strokeWidth="1"
              />
            ))}

            {/* Axes */}
            <line
              x1={PLOT.marginLeft}
              y1={toSvgY(0)}
              x2={PLOT.width - PLOT.marginRight}
              y2={toSvgY(0)}
              stroke="oklch(0.96 0 0 / 0.2)"
              strokeWidth="1"
            />
            <line
              x1={toSvgX(0)}
              y1={PLOT.marginTop}
              x2={toSvgX(0)}
              y2={PLOT.height - PLOT.marginBottom}
              stroke="oklch(0.96 0 0 / 0.2)"
              strokeWidth="1"
            />

            {/* Axis labels */}
            {xTicks.map((tick) => (
              <text
                key={`xl-${tick}`}
                x={toSvgX(tick)}
                y={PLOT.height - PLOT.marginBottom + 18}
                textAnchor="middle"
                fill="oklch(0.58 0 0)"
                fontSize="11"
                fontFamily="var(--font-mono)"
              >
                {tick}
              </text>
            ))}
            {yTicks.map((tick) => (
              <text
                key={`yl-${tick}`}
                x={PLOT.marginLeft - 10}
                y={toSvgY(tick) + 4}
                textAnchor="end"
                fill="oklch(0.58 0 0)"
                fontSize="11"
                fontFamily="var(--font-mono)"
              >
                {tick}
              </text>
            ))}

            {/* Axis titles */}
            <text
              x={(PLOT.marginLeft + PLOT.width - PLOT.marginRight) / 2}
              y={PLOT.height - 6}
              textAnchor="middle"
              fill="oklch(0.75 0 0)"
              fontSize="12"
              fontFamily="var(--font-body)"
            >
              Parameter x
            </text>
            <text
              transform="rotate(-90)"
              x={-((PLOT.marginTop + PLOT.height - PLOT.marginBottom) / 2)}
              y={16}
              textAnchor="middle"
              fill="oklch(0.75 0 0)"
              fontSize="12"
              fontFamily="var(--font-body)"
            >
              Loss f(x)
            </text>

            {/* Parabola curve — cyan glow */}
            <path
              d={curvePath}
              fill="none"
              stroke="oklch(0.65 0.22 200 / 0.35)"
              strokeWidth="6"
              filter="url(#glow-cyan)"
              strokeLinecap="round"
            />
            <path
              d={curvePath}
              fill="none"
              stroke="oklch(0.65 0.22 200)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Descent path — magenta */}
            {visibleSteps.length > 1 && (
              <>
                <path
                  d={descentPath}
                  fill="none"
                  stroke="oklch(0.68 0.25 310 / 0.4)"
                  strokeWidth="4"
                  filter="url(#glow-magenta)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={descentPath}
                  fill="none"
                  stroke="oklch(0.68 0.25 310)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* Step dots — keyed by iteration to avoid index-as-key */}
            {visibleSteps.slice(0, -1).map((s) => (
              <circle
                key={`dot-${s.iteration}`}
                cx={toSvgX(s.x)}
                cy={toSvgY(s.loss)}
                r="3"
                fill="oklch(0.68 0.25 310)"
                opacity="0.7"
              />
            ))}

            {/* Current position marker */}
            {markerX !== null && markerY !== null && (
              <>
                {/* Glow halo */}
                <circle
                  cx={markerX}
                  cy={markerY}
                  r="12"
                  fill="url(#markerGrad)"
                />
                <circle
                  cx={markerX}
                  cy={markerY}
                  r="5.5"
                  fill="oklch(0.68 0.25 310)"
                  className="animate-descent-pulse"
                />
                <circle
                  cx={markerX}
                  cy={markerY}
                  r="2.5"
                  fill="oklch(0.96 0 0)"
                />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Controls bar */}
      <div className="shrink-0 border-t border-border bg-card px-5 py-3 flex items-center gap-4">
        {/* Transport controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            data-ocid="transport.play_button"
            onClick={isPlaying ? onPause : onPlay}
            className="control-button p-2 rounded"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            type="button"
            data-ocid="transport.step_button"
            onClick={onStep}
            className="control-button p-2 rounded"
            title="Step"
          >
            <SkipForward size={14} />
          </button>
          <button
            type="button"
            data-ocid="transport.reset_button"
            onClick={onReset}
            className="control-button p-2 rounded"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Speed slider */}
        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <label
            htmlFor="speed-slider"
            className="metric-label whitespace-nowrap"
          >
            Animated Step Speed
          </label>
          <input
            id="speed-slider"
            data-ocid="speed.slider"
            type="range"
            min={50}
            max={1000}
            step={50}
            value={config.animationSpeed}
            onChange={(e) => onSpeedChange(Number.parseInt(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, oklch(0.65 0.22 200) 0%, oklch(0.65 0.22 200) ${
                ((config.animationSpeed - 50) / (1000 - 50)) * 100
              }%, oklch(0.22 0 0) ${
                ((config.animationSpeed - 50) / (1000 - 50)) * 100
              }%, oklch(0.22 0 0) 100%)`,
            }}
          />
        </div>

        {/* Transport labels */}
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            data-ocid="bottom.play_pause_button"
            onClick={isPlaying ? onPause : onPlay}
            className="control-button px-4 py-1.5 text-xs"
          >
            {isPlaying ? "Pause" : "Play/Pause"}
          </button>
          <button
            type="button"
            data-ocid="bottom.step_button"
            onClick={onStep}
            className="control-button px-4 py-1.5 text-xs"
          >
            Step
          </button>
          <button
            type="button"
            data-ocid="bottom.reset_button"
            onClick={onReset}
            className="control-button px-4 py-1.5 text-xs"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
