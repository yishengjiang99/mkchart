# mk-60fps

A lightweight TypeScript library for rendering audio waveforms and data visualizations on an HTML5 Canvas at up to 60 FPS.

## Features

- Render waveform charts from `Float32Array` or `Float64Array` data
- Smooth 60 FPS animated playback via `requestAnimationFrame`
- Interactive controls: click to seek, double-click to reset, range slider for scrubbing
- Configurable canvas size and container element
- Zero heavy dependencies — just a thin DOM helper ([mkdiv](https://www.npmjs.com/package/mkdiv))

## Installation

```bash
npm install mk-60fps
```

## Quick Start

```typescript
import { mkcanvas, chart } from "mk-60fps";

// Create a canvas and render a single frame
const ctx = mkcanvas();
chart(ctx, new Float32Array([0, 0.5, 1, 0.5, 0, -0.5, -1, -0.5]));
```

## API

### `mkcanvas(params?): CanvasRenderingContext2D`

Creates an HTML5 `<canvas>` element, appends it to the DOM, and returns its 2D rendering context.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `params.container` | `HTMLElement` | `document.body` | Parent element the canvas is appended to |
| `params.width` | `number` | `480` | Canvas width in pixels |
| `params.height` | `number` | `320` | Canvas height in pixels |
| `params.title` | `string` | `""` | Optional title rendered above the canvas |

Double-clicking the canvas resets it (clears to a black background).

---

### `chart(ctx, dataArray)`

Renders a single waveform frame onto the canvas.

| Parameter | Type | Description |
|-----------|------|-------------|
| `ctx` | `CanvasRenderingContext2D` | The rendering context returned by `mkcanvas()` |
| `dataArray` | `Float32Array \| Float64Array` | The data samples to visualize |

The waveform is drawn as a white stroke centered vertically on a black background.

---

### `resetCanvas(ctx)`

Clears the canvas and fills it with a solid black background.

| Parameter | Type | Description |
|-----------|------|-------------|
| `ctx` | `CanvasRenderingContext2D \| null` | The rendering context to reset |

---

### `renderFrames(ctx, arr, fps?, samplesPerFrame?): Promise<void>`

Animates through a large data array, rendering successive windows of samples at the target frame rate.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ctx` | `CanvasRenderingContext2D` | — | The rendering context returned by `mkcanvas()` |
| `arr` | `Float32Array \| Float64Array` | — | Full data array to animate through |
| `fps` | `number` | `60` | Target frame rate |
| `samplesPerFrame` | `number` | `1024` | Number of samples displayed per frame |

**Interactive controls added after playback completes:**

- **Click left half** of the canvas — seek backward one frame
- **Click right half** of the canvas — seek forward one frame
- **Range slider** — scrub to any position in the data (added automatically on first click)

---

### `CanvasParams` interface

```typescript
interface CanvasParams {
  container?: HTMLElement;
  width?: number;
  height?: number;
  title?: string;
}
```

### Constants

```typescript
export const WIDTH = 480;   // Default canvas width
export const HEIGHT = 320;  // Default canvas height
```

## Examples

### Render a single frame

```typescript
import { mkcanvas, chart } from "mk-60fps";

const ctx = mkcanvas({ width: 800, height: 400, title: "Waveform" });
const samples = Float32Array.from({ length: 256 }, () => Math.random() * 2 - 1);
chart(ctx, samples);
```

### Animate through a large buffer

```typescript
import { mkcanvas, renderFrames } from "mk-60fps";

const ctx = mkcanvas({ title: "Audio Playback" });
const buffer = new Float32Array(44100); // 1 second at 44.1 kHz
// ... fill buffer with audio data ...
await renderFrames(ctx, buffer, 60, 1024);
```

### Append canvas to a custom container

```typescript
import { mkcanvas, chart } from "mk-60fps";

const container = document.getElementById("my-container")!;
const ctx = mkcanvas({ container, width: 640, height: 360 });
chart(ctx, new Float32Array([1, 2, 3, 4]));
```

## Building from source

```bash
git clone https://github.com/yishengjiang99/mkchart.git
cd mkchart
npm install
npm run build   # compiles TypeScript and bundles with Rollup
npm test        # runs the Jest test suite
```

## License

ISC © Yisheng Jiang

