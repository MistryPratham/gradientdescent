import type { DescentStep, SimulationStatus } from "@/types/gradient-descent";

interface Props {
  steps: DescentStep[];
  currentStepData: DescentStep;
  status: SimulationStatus;
}

const STATUS_LABELS: Record<SimulationStatus, string> = {
  idle: "Ready",
  running: "In Progress",
  paused: "Paused",
  converged: "Converged",
  diverged: "Diverged",
};

const STATUS_COLORS: Record<SimulationStatus, string> = {
  idle: "text-muted-foreground",
  running: "text-primary",
  paused: "text-chart-4",
  converged: "text-chart-3",
  diverged: "text-destructive",
};

interface MetricRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function MetricRow({ label, value, highlight }: MetricRowProps) {
  return (
    <div className="space-y-0.5">
      <p className="metric-label">{label}</p>
      <p
        className={`font-mono text-2xl font-bold tracking-tight leading-none ${
          highlight ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function MetricsPanel({ steps, currentStepData, status }: Props) {
  const recentSteps = steps.slice(Math.max(0, steps.length - 20)).reverse();

  return (
    <div className="p-4 space-y-5 animate-slide-down">
      {/* Header */}
      <div className="pt-1">
        <p className="metric-label tracking-widest uppercase">
          Live Simulation Metrics
        </p>
      </div>

      {/* Primary metrics */}
      <div className="space-y-4">
        <MetricRow
          label="Iteration Count"
          value={String(currentStepData?.iteration ?? 0)}
          highlight
        />
        <MetricRow
          label="Current position x"
          value={(currentStepData?.x ?? 0).toFixed(4)}
        />
        <MetricRow
          label="Loss value f(x)"
          value={(currentStepData?.loss ?? 0).toFixed(4)}
        />
        <MetricRow
          label="Gradient Magnitude"
          value={Math.abs(currentStepData?.gradient ?? 0).toFixed(4)}
        />

        {/* Convergence status */}
        <div className="space-y-0.5">
          <p className="metric-label">Convergence Status</p>
          <p
            data-ocid="convergence.status"
            className={`font-mono text-xl font-bold tracking-tight leading-none ${STATUS_COLORS[status]}`}
          >
            {STATUS_LABELS[status]}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="metric-label tracking-widest uppercase mb-3">
          Parameter History
        </p>
        <div
          data-ocid="history.list"
          className="space-y-0.5 max-h-64 overflow-y-auto scrollbar-thin"
        >
          {recentSteps.length === 0 ? (
            <p className="font-mono text-xs text-muted-foreground">
              No steps yet
            </p>
          ) : (
            recentSteps.map((s, i) => (
              <div
                key={`hist-${s.iteration}`}
                data-ocid={`history.item.${i + 1}`}
                className={`flex justify-between items-center px-2 py-1 rounded text-[11px] font-mono ${
                  i === 0
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                } transition-colors duration-100`}
              >
                <span>Iteration {String(s.iteration).padStart(3, " ")}</span>
                <span>{s.x.toFixed(4)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mini loss indicator */}
      {steps.length > 1 && (
        <div className="border-t border-border pt-4">
          <p className="metric-label tracking-widest uppercase mb-2">
            Loss Trajectory
          </p>
          <div className="flex items-end gap-px h-12">
            {steps.slice(-30).map((s, i) => {
              const window = steps.slice(-30);
              const maxLoss = Math.max(...window.map((x) => x.loss), 0.01);
              const barH = Math.max(2, (s.loss / maxLoss) * 44);
              return (
                <div
                  key={`bar-${s.iteration}`}
                  className="flex-1 rounded-t-sm transition-all duration-150"
                  style={{
                    height: `${barH}px`,
                    background:
                      i === steps.slice(-30).length - 1
                        ? "oklch(0.68 0.25 310)"
                        : "oklch(0.65 0.22 200 / 0.5)",
                  }}
                  title={`iter ${s.iteration}: ${s.loss.toFixed(4)}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
