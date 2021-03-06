import { mkdiv } from "../node_modules/mkdiv/mkdiv.js";
export const WIDTH = 480; // / 2,
export const HEIGHT = 320;
function get_w_h(canvasCtx: CanvasRenderingContext2D) {
  return [
    canvasCtx.canvas.getAttribute("width")
      ? parseInt(canvasCtx.canvas.getAttribute("width")!)
      : WIDTH,
    canvasCtx.canvas.getAttribute("height")
      ? parseInt(canvasCtx.canvas.getAttribute("height")!)
      : HEIGHT,
  ];
}
export function resetCanvas(c: CanvasRenderingContext2D | null) {
  if (!c) return;
  const canvasCtx = c as CanvasRenderingContext2D;
  const [_width, _height] = get_w_h(canvasCtx);
  canvasCtx.clearRect(0, 0, _width, _height);
  canvasCtx.fillStyle = "black";
  canvasCtx.fillRect(0, 0, _width, _height);
}
export function chart(
  canvasCtx: CanvasRenderingContext2D,
  dataArray: Float32Array | Float64Array
) {
  resetCanvas(canvasCtx);
  const [_width, _height] = get_w_h(canvasCtx);

  let max = 0,
    min = 0,
    x = 0;
  let iWIDTH = _width / dataArray.length; //strokeText(`r m s : ${sum / bufferLength}`, 10, 20, 100)
  for (let i = 1; i < dataArray.length; i++) {
    max = dataArray[i] > max ? dataArray[i] : max;
    min = -1 * max; /// dataArray[i] < min ? dataArray[i] : min;
  }
  canvasCtx.beginPath();
  canvasCtx.lineWidth = 1;

  canvasCtx.strokeStyle = "rbga(0xff,0xff,0x00,.5)";
  canvasCtx.moveTo(0, _height / 2);

  canvasCtx.lineTo(_width, _height / 2);
  canvasCtx.stroke();
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "white";
  canvasCtx.moveTo(0, _height / 2);

  for (let i = 1; i < dataArray.length; i++) {
    x += iWIDTH;
    canvasCtx.lineTo(x, (_height / 2) * dataArray[i] + _height / 2);
  }
  canvasCtx.stroke();
  canvasCtx.restore();
  canvasCtx.font = "1em Arial";
}
export interface CanvasParams {
  container?: HTMLElement;
  width?: number;
  height?: number;
  title?: string;
}
export function mkcanvas(params: CanvasParams = {}) {
  const { width, height, container, title } = Object.assign(params, {
    container: document.body,
    title: "",
    width: WIDTH,
    height: HEIGHT,
  });
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.setAttribute("width", `${width}`);
  canvas.setAttribute("height", `${height}`);

  const canvasCtx = canvas.getContext("2d")!;
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "white";
  canvasCtx.fillStyle = "black";
  canvasCtx.font = "2em";

  const wrap = mkdiv("div", {}, [title ? mkdiv("h5", {}, title) : "", canvas]);

  container.append(wrap);
  canvas.ondblclick = () => resetCanvas(canvasCtx);
  return canvasCtx;
}
export async function renderFrames(
  canvsCtx: CanvasRenderingContext2D,
  arr: Float32Array | Float64Array,
  fps = 60,
  samplesPerFrame = 1024
) {
  let nextframe,
    offset = 0;
  while (arr.length > offset) {
    if (!nextframe || performance.now() > nextframe) {
      chart(canvsCtx, arr.slice(offset, offset + samplesPerFrame));
      nextframe = 1 / fps + performance.now();
      offset += samplesPerFrame / 4;
    }
    await new Promise((r) => requestAnimationFrame(r));
  }
  function onclick({ x, y, target }: MouseEvent) {
    offset +=
      (x < (target as HTMLElement).clientWidth / 2 ? -1 : 1) * samplesPerFrame;
    chart(canvsCtx, arr.slice(offset, offset + samplesPerFrame));
    const existingSlider = canvsCtx.canvas?.parentElement?.querySelector(
      "input[type='range']"
    );
    const slider =
      existingSlider ||
      mkdiv("input", {
        type: "range",
        min: 0,
        max: 100,
        value: 100,
        step: 0,
        oninput: (e: InputEvent) => {
          const { max, value } = e.target as HTMLInputElement;
          offset = (arr.length * parseInt(value)) / parseInt(max);
          chart(canvsCtx, arr.slice(offset, offset + samplesPerFrame));
        },
      });
    canvsCtx.canvas.parentElement!.appendChild(slider);
  }

  canvsCtx.canvas.addEventListener("click", onclick);
  canvsCtx.canvas.addEventListener("dblclick", function (e) {
    e.x;
    offset += (e.x < canvsCtx.canvas.width / 2 ? -1 : 1) * samplesPerFrame;

    chart(canvsCtx, arr.slice(offset, offset + samplesPerFrame));
  });
}
