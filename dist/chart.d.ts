export declare const WIDTH = 480;
export declare const HEIGHT = 320;
export declare function resetCanvas(c: CanvasRenderingContext2D | null): void;
export declare function chart(canvasCtx: CanvasRenderingContext2D, dataArray: Float32Array | Float64Array): void;
export interface CanvasParams {
    container?: HTMLElement;
    width?: number;
    height?: number;
    title?: string;
}
export declare function mkcanvas(params?: CanvasParams): CanvasRenderingContext2D;
export declare function renderFrames(canvsCtx: CanvasRenderingContext2D, arr: Float32Array | Float64Array, fps?: number, samplesPerFrame?: number): Promise<void>;
