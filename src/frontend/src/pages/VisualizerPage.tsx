import { MetricsPanel } from "@/components/MetricsPanel";
import { PlotCanvas } from "@/components/PlotCanvas";
import { SidebarControls } from "@/components/SidebarControls";
import { useGradientDescent } from "@/hooks/useGradientDescent";

export function VisualizerPage() {
  const gd = useGradientDescent();

  const statusClass =
    gd.state.status === "running"
      ? "border-primary/50 text-primary bg-primary/10"
      : gd.state.status === "converged"
        ? "border-chart-3/50 text-chart-3 bg-chart-3/10"
        : gd.state.status === "diverged"
          ? "border-destructive/50 text-destructive bg-destructive/10"
          : "border-border text-muted-foreground bg-muted/30";

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 bg-card border-b border-border shrink-0">
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-sm font-bold tracking-widest text-foreground uppercase">
            <span className="text-primary">Gradient</span>
            <span className="text-foreground">Flow</span>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
            Descent Visualizer
          </span>
        </div>
        <span
          data-ocid="status.badge"
          className={`font-mono text-xs px-2 py-0.5 rounded-sm border ${statusClass}`}
        >
          {gd.state.status.toUpperCase()}
        </span>
      </header>

      {/* Three-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — controls */}
        <aside
          data-ocid="sidebar.panel"
          className="w-72 shrink-0 bg-card border-r border-border overflow-y-auto scrollbar-thin"
        >
          <SidebarControls
            config={gd.state.config}
            onConfigChange={gd.updateConfig}
            onPlay={gd.play}
            onPause={gd.pause}
            onStep={gd.step}
            onReset={gd.reset}
            isPlaying={gd.isPlaying}
            isTerminated={gd.isTerminated}
            status={gd.state.status}
          />
        </aside>

        {/* Center — SVG plot */}
        <main
          data-ocid="plot.section"
          className="flex-1 flex flex-col bg-background overflow-hidden"
        >
          <PlotCanvas
            steps={gd.state.steps}
            currentStepIndex={gd.state.currentStep}
            config={gd.state.config}
            onPlay={gd.play}
            onPause={gd.pause}
            onStep={gd.step}
            onReset={gd.reset}
            isPlaying={gd.isPlaying}
            onSpeedChange={(v) => gd.updateConfig("animationSpeed", v)}
          />
        </main>

        {/* Right sidebar — metrics */}
        <aside
          data-ocid="metrics.panel"
          className="w-64 shrink-0 bg-card border-l border-border overflow-y-auto scrollbar-thin"
        >
          <MetricsPanel
            steps={gd.state.steps}
            currentStepData={gd.currentStepData}
            status={gd.state.status}
          />
        </aside>
      </div>
    </div>
  );
}
