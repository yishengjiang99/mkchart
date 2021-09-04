declare interface MkcanvasOptions {
  container?: HTMLElement;
  width?: number;
  height?: number;
  title?: number;
}
declare function mkcanvas(options?: MkcanvasOptions): CanvasRenderingContext2D;
declare function resetCanvas(ctx: CanvasRenderingContext2D): void;
declare function chart(
  ctx: CanvasRenderingContext2D,
  data: Float32Array | Float64Array
): void;
declare function renderFrames(
  ctx: CanvasRenderingContext2D,
  data: Float32Array | Float64Array,
  fps?: 60,
  samplesPerFrame?: number
): void;
export { mkcanvas, resetCanvas, chart, renderFrames };
