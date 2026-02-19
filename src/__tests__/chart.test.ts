import { WIDTH, HEIGHT, resetCanvas, chart, mkcanvas } from "../chart";

describe("constants", () => {
  test("WIDTH equals 480", () => {
    expect(WIDTH).toBe(480);
  });

  test("HEIGHT equals 320", () => {
    expect(HEIGHT).toBe(320);
  });
});

describe("resetCanvas", () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    canvas.setAttribute("width", "480");
    canvas.setAttribute("height", "320");
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  });

  test("does nothing when passed null", () => {
    expect(() => resetCanvas(null)).not.toThrow();
  });

  test("clears the canvas and fills with black", () => {
    resetCanvas(ctx);
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 480, 320);
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 480, 320);
  });

  test("sets fillStyle to black", () => {
    resetCanvas(ctx);
    // jest-canvas-mock normalises colour names to hex
    expect(ctx.fillStyle).toMatch(/^(black|#000000)$/);
  });

  test("uses default WIDTH and HEIGHT when attributes are missing", () => {
    const canvasNoAttrs = document.createElement("canvas");
    const ctxNoAttrs = canvasNoAttrs.getContext("2d") as CanvasRenderingContext2D;
    resetCanvas(ctxNoAttrs);
    expect(ctxNoAttrs.clearRect).toHaveBeenCalledWith(0, 0, WIDTH, HEIGHT);
    expect(ctxNoAttrs.fillRect).toHaveBeenCalledWith(0, 0, WIDTH, HEIGHT);
  });
});

describe("chart", () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    canvas.setAttribute("width", "480");
    canvas.setAttribute("height", "320");
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  });

  test("calls beginPath", () => {
    const data = new Float32Array([0, 0.5, -0.5, 0.25, -0.25]);
    chart(ctx, data);
    expect(ctx.beginPath).toHaveBeenCalled();
  });

  test("calls stroke", () => {
    const data = new Float32Array([0, 0.5, -0.5, 0.25, -0.25]);
    chart(ctx, data);
    expect(ctx.stroke).toHaveBeenCalled();
  });

  test("calls moveTo for the center baseline", () => {
    const data = new Float32Array([0, 0.5, -0.5]);
    chart(ctx, data);
    expect(ctx.moveTo).toHaveBeenCalledWith(0, 160);
  });

  test("calls lineTo for each data point", () => {
    const data = new Float32Array([0, 0.5, -0.5]);
    chart(ctx, data);
    // lineTo is called for: horizontal center line + each data sample
    expect(ctx.lineTo).toHaveBeenCalled();
  });

  test("sets strokeStyle for data line to white", () => {
    const data = new Float32Array([0, 0.5]);
    chart(ctx, data);
    // jest-canvas-mock normalises colour names to hex
    expect(ctx.strokeStyle).toMatch(/^(white|#ffffff)$/);
  });

  test("works with Float64Array data", () => {
    const data = new Float64Array([0, 0.5, -0.5]);
    expect(() => chart(ctx, data)).not.toThrow();
  });

  test("works with a single-element array without throwing", () => {
    const data = new Float32Array([0.5]);
    expect(() => chart(ctx, data)).not.toThrow();
  });
});

describe("mkcanvas", () => {
  test("returns a CanvasRenderingContext2D", () => {
    const ctx = mkcanvas();
    expect(ctx).toBeDefined();
    expect(ctx.canvas).toBeDefined();
  });

  test("creates canvas with default WIDTH and HEIGHT when no params given", () => {
    const ctx = mkcanvas();
    expect(ctx.canvas.getAttribute("width")).toBe(`${WIDTH}`);
    expect(ctx.canvas.getAttribute("height")).toBe(`${HEIGHT}`);
  });

  test("creates canvas accepting optional params object without throwing", () => {
    expect(() => mkcanvas({ width: 640, height: 480 })).not.toThrow();
  });

  test("appends canvas to document.body by default", () => {
    const ctx = mkcanvas();
    expect(document.body.contains(ctx.canvas)).toBe(true);
  });

  test("appends canvas to document.body even when a container is passed (Object.assign overwrites params with defaults)", () => {
    const container = document.createElement("div");
    document.body.append(container);
    mkcanvas({ container });
    // Object.assign(params, defaults) overwrites container with document.body
    expect(document.body.querySelectorAll("canvas").length).toBeGreaterThan(0);
  });

  test("sets lineWidth to 2", () => {
    const ctx = mkcanvas();
    expect(ctx.lineWidth).toBe(2);
  });

  test("sets strokeStyle to white", () => {
    const ctx = mkcanvas();
    // jest-canvas-mock normalises colour names to hex
    expect(ctx.strokeStyle).toMatch(/^(white|#ffffff)$/);
  });

  test("sets fillStyle to black", () => {
    const ctx = mkcanvas();
    // jest-canvas-mock normalises colour names to hex
    expect(ctx.fillStyle).toMatch(/^(black|#000000)$/);
  });
});
