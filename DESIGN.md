# Design Brief

## Direction
Utilitarian Interactive Optimizer — a focused learning tool where gradient descent unfolds through real-time visualization and live control.

## Tone
Clean technical minimalism with precision-focused dark mode; the interface dissolves to let the visualization dominate.

## Differentiation
Learning rate slider is the primary control mechanic—always visible, prominently sized, with live metrics updating in sync with interaction.

## Color Palette

| Token      | OKLCH        | Role                           |
| ---------- | ------------ | ------------------------------ |
| background | 0.12 0 0     | Deep neutral foundation        |
| foreground | 0.96 0 0     | Near-white text on dark        |
| card       | 0.16 0 0     | Plot container, lifted surface |
| primary    | 0.65 0.22 200| Cyan accent for controls       |
| accent     | 0.68 0.25 310| Magenta for descent path       |
| muted      | 0.22 0 0     | Subdued zones and borders      |

## Typography

- Display: Space Grotesk — modern geometric sans for headers and labels
- Mono: Geist Mono — technical precision for live metric values
- Scale: h1 `text-xl`, labels `text-xs`, metrics `text-sm font-mono`

## Elevation & Depth
Single-level card elevation (plot area raised on `bg-card`); no layered shadows—minimal borders replace visual depth.

## Structural Zones

| Zone       | Background     | Border            | Notes                               |
| ---------- | -------------- | ----------------- | ----------------------------------- |
| Controls   | bg-background  | border-border     | Sidebar with learning rate slider   |
| Plot Area  | bg-card        | border-border     | 2D loss function grid background    |
| Metrics    | bg-background  | —                 | Right panel, monospace font, live   |

## Spacing & Rhythm
Compact spacing (12–16px gaps); 8px micro-spacing within controls. Learning rate slider dominates left sidebar; plot fills center; metrics right-aligned.

## Component Patterns

- Buttons: minimal 4px radius, border-based, hover darkens muted background
- Slider: track 4px tall, thumb cyan primary with focus ring
- Metrics: monospace, right-aligned, stacked vertically with 8px line-height

## Motion

- Entrance: slide-down 0.3s for control panels on load
- Descent Animation: animated path trail with descent-pulse for current position marker
- Hover: background transitions on buttons, slider thumb responds to input without delay

## Constraints

- No decorative gradients or blur effects—technical clarity only
- Grid background subtle (3% opacity lines) to avoid distraction
- Monospace numerics for all measurements; sans-serif for labels and instructions

## Signature Detail
Cyan + magenta dual accent system—loss curve in cyan, descent trail in magenta—creates instant visual separation between function and optimization path.
