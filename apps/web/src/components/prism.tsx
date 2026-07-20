"use client";

import type * as React from "react";

import { useEffect, useRef, useState } from "react";

import { cn } from "~/utils/cn";

type Source = {
  base: string;
  mist: string;
  vertex: string;
};

type Uniforms = {
  drawing: WebGLUniformLocation | null;
  mask: WebGLUniformLocation | null;
  mono: WebGLUniformLocation | null;
  night: WebGLUniformLocation | null;
  offset: WebGLUniformLocation | null;
  pointer: WebGLUniformLocation | null;
  presence: WebGLUniformLocation | null;
  resolution: WebGLUniformLocation | null;
  scene: WebGLUniformLocation | null;
  sunlight: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
};

type Layer = {
  buffer: WebGLBuffer;
  fragment: WebGLShader;
  gl: WebGLRenderingContext;
  mask: WebGLTexture;
  node: HTMLCanvasElement;
  program: WebGLProgram;
  uniforms: Uniforms;
  vertex: WebGLShader;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;

  const stage = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
  console.error(gl.getShaderInfoLog(shader) || `WebGL ${stage} shader compilation failed.`);
  gl.deleteShader(shader);
  return null;
}

function lose(gl: WebGLRenderingContext) {
  gl.getExtension("WEBGL_lose_context")?.loseContext();
}

function createLayer(
  node: HTMLCanvasElement,
  vertexSource: string,
  fragmentSource: string,
  alpha: boolean,
) {
  const gl = node.getContext("webgl", {
    alpha,
    antialias: false,
    powerPreference: "high-performance",
    premultipliedAlpha: false,
  });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const shader = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !shader) {
    if (vertex) gl.deleteShader(vertex);
    if (shader) gl.deleteShader(shader);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertex);
    gl.deleteShader(shader);
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, shader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program) || "WebGL program linking failed.");
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(shader);
    return null;
  }

  const buffer = gl.createBuffer();
  if (!buffer) {
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(shader);
    return null;
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const mask = gl.createTexture();
  if (!mask) {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(shader);
    return null;
  }

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, mask);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 255]),
  );

  return {
    buffer,
    fragment: shader,
    gl,
    mask,
    node,
    program,
    uniforms: {
      drawing: gl.getUniformLocation(program, "u_drawing"),
      mask: gl.getUniformLocation(program, "u_mask"),
      mono: gl.getUniformLocation(program, "u_mono"),
      night: gl.getUniformLocation(program, "u_night"),
      offset: gl.getUniformLocation(program, "u_offset"),
      pointer: gl.getUniformLocation(program, "u_pointer"),
      presence: gl.getUniformLocation(program, "u_presence"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      scene: gl.getUniformLocation(program, "u_scene"),
      sunlight: gl.getUniformLocation(program, "u_sunlight"),
      time: gl.getUniformLocation(program, "u_time"),
    },
    vertex,
  } satisfies Layer;
}

function destroyLayer(layer: Layer) {
  layer.gl.deleteBuffer(layer.buffer);
  layer.gl.deleteTexture(layer.mask);
  layer.gl.deleteProgram(layer.program);
  layer.gl.deleteShader(layer.vertex);
  layer.gl.deleteShader(layer.fragment);
  // React replays effects in development while retaining the DOM. Release
  // WebGL only after the canvas has actually left the document.
  if (!layer.node.isConnected) lose(layer.gl);
}

type Scene =
  | "aurora"
  | "cathedral"
  | "city"
  | "dusk"
  | "embers"
  | "ferris"
  | "fireflies"
  | "fireworks"
  | "glowworms"
  | "harbor"
  | "lantern"
  | "lighthouse"
  | "meteor"
  | "moon"
  | "neon"
  | "prism"
  | "sodium"
  | "storm"
  | "tide"
  | "train"
  | "tv"
  | "volcano"
  | "wisps";

type PrismProps = React.ComponentProps<"div"> & {
  /** Extend the shader below its layout bounds and fade it into the page. */
  bleed?: boolean;
  /** Enable press or drag mist clearing. */
  clearable?: boolean;
  mode?: "mist" | "sunlight" | "night";
  mono?: boolean;
  /** Reveal child content through a broad mask that softly regenerates. */
  reveal?: boolean;
  scene?: Scene;
};

const scenes = {
  prism: 0,
  city: 1,
  moon: 2,
  dusk: 3,
  sodium: 4,
  neon: 5,
  storm: 6,
  aurora: 7,
  fireflies: 8,
  lighthouse: 9,
  embers: 10,
  tide: 11,
  lantern: 12,
  meteor: 13,
  cathedral: 14,
  fireworks: 15,
  train: 16,
  wisps: 17,
  glowworms: 18,
  harbor: 19,
  volcano: 20,
  ferris: 21,
  tv: 22,
} satisfies Record<Scene, number>;

const BLEED_REM = 8;
const BRUSH_MIN = 6;
const BRUSH_SCALE = 0.045;
const DRAG_MIN = 8;
const HEAL_DELAY_MS = 240;
const PRESS_ALPHA = 0.28;
const REGEN_MS = 1600;

type Frame = {
  drawing: boolean;
  height: number;
  offset: number;
  presence: number;
  width: number;
  x: number;
  y: number;
};

type Settings = {
  mode: "mist" | "sunlight" | "night";
  mono: boolean;
  scene: Scene;
};

function createReveal() {
  const node = document.createElement("canvas");
  const paint = node.getContext("2d");
  if (!paint) return null;

  const state = { idle: HEAL_DELAY_MS, x: -1, y: -1 };

  const reset = () => {
    state.x = -1;
    state.y = -1;
  };

  const resize = (width: number, height: number) => {
    const nextWidth = Math.max(96, Math.min(320, Math.round(width / 4)));
    const nextHeight = Math.max(
      64,
      Math.round((nextWidth * Math.max(height, 1)) / Math.max(width, 1)),
    );

    if (node.width === nextWidth && node.height === nextHeight) return;

    node.width = nextWidth;
    node.height = nextHeight;
    paint.fillStyle = "#000";
    paint.fillRect(0, 0, node.width, node.height);
    state.idle = HEAL_DELAY_MS;
    reset();
  };

  const wipe = (x: number, y: number, alpha = 1) => {
    const radius = Math.max(BRUSH_MIN, Math.min(node.width, node.height) * BRUSH_SCALE);
    const startX = state.x < 0 ? x : state.x;
    const startY = state.y < 0 ? y : state.y;
    const distance = Math.hypot(x - startX, y - startY);
    const count = Math.max(1, Math.ceil(distance / Math.max(radius * 0.24, 1)));

    paint.globalAlpha = alpha;
    for (const step of Array.from({ length: count + 1 }, (_, index) => index)) {
      const progress = step / count;
      const pointX = startX + (x - startX) * progress;
      const pointY = startY + (y - startY) * progress;
      const gradient = paint.createRadialGradient(pointX, pointY, 0, pointX, pointY, radius);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.28, "rgba(255, 255, 255, 0.95)");
      gradient.addColorStop(0.65, "rgba(255, 255, 255, 0.46)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      paint.fillStyle = gradient;
      paint.fillRect(pointX - radius, pointY - radius, radius * 2, radius * 2);
    }
    paint.globalAlpha = 1;

    state.idle = 0;
    state.x = x;
    state.y = y;
  };

  const heal = (delta: number) => {
    state.idle += delta;
    if (state.idle < HEAL_DELAY_MS) return;

    const fade = 1 - Math.exp(-delta / REGEN_MS);
    paint.fillStyle = `rgba(0, 0, 0, ${fade})`;
    paint.fillRect(0, 0, node.width, node.height);
  };

  return { heal, node, reset, resize, wipe };
}

function draw(
  layer: Layer,
  mask: HTMLCanvasElement | null,
  frame: Frame,
  settings: Settings,
  elapsed: number,
) {
  const gl = layer.gl;
  gl.useProgram(layer.program);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, layer.mask);

  if (mask) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
  }

  gl.uniform1i(layer.uniforms.mask, 0);
  gl.uniform1f(layer.uniforms.sunlight, settings.mode === "sunlight" ? 1 : 0);
  gl.uniform1f(layer.uniforms.night, settings.mode === "night" ? 1 : 0);
  gl.uniform1f(layer.uniforms.scene, scenes[settings.scene]);
  gl.uniform1f(layer.uniforms.offset, frame.offset);
  gl.uniform2f(layer.uniforms.resolution, frame.width, frame.height);
  gl.uniform2f(layer.uniforms.pointer, frame.x, frame.y);
  gl.uniform1f(layer.uniforms.time, elapsed);
  gl.uniform1f(layer.uniforms.presence, frame.presence);
  gl.uniform1f(layer.uniforms.drawing, frame.drawing ? 1 : 0);
  gl.uniform1f(layer.uniforms.mono, settings.mono ? 1 : 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export function Prism({
  bleed = false,
  children,
  className,
  clearable = true,
  mode = "mist",
  mono = false,
  reveal = false,
  scene = "prism",
  ...props
}: PrismProps) {
  const clearing = clearable && mode !== "sunlight";
  const revealing = clearing && reveal;
  const layered = mode === "mist";
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const veil = useRef<HTMLCanvasElement>(null);
  const [source, setSource] = useState<Source>();
  const [visible, setVisible] = useState(false);
  const settings = useRef<Settings>({ mode, mono, scene });

  useEffect(() => {
    settings.current = { mode, mono, scene };
  }, [mode, mono, scene]);

  useEffect(() => {
    const shell = root.current;
    if (!shell) return;

    // Browsers cap live WebGL contexts, so layers only exist while visible.
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) setVisible(entry.isIntersecting);
    });
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const state = { active: true };
    const load = (path: string) => fetch(path).then((response) => response.text());

    void Promise.all([
      load("/shaders/prism.vert"),
      load("/shaders/prism.frag"),
      load("/shaders/mist.frag"),
    ])
      .then(([vertex, base, mist]) => {
        if (state.active) setSource({ base, mist, vertex });
      })
      .catch((error: unknown) => console.error(error));

    return () => {
      state.active = false;
    };
  }, []);

  useEffect(() => {
    const shell = root.current;
    const node = canvas.current;
    if (!shell || !node || !source || !visible) return;

    const base = createLayer(node, source.vertex, source.base, revealing);
    if (!base) return;

    // Light-mode studies share the same separate veil, so scene changes never
    // distort or replace the base condensation layer.
    const mist = veil.current ? createLayer(veil.current, source.vertex, source.mist, true) : null;
    const layers = mist ? [base, mist] : [base];
    const reveal = revealing ? createReveal() : null;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = {
      drawing: false,
      frame: 0,
      height: 1,
      last: performance.now(),
      offset: 0,
      origin: { x: 0, y: 0 },
      presence: 0,
      pressed: false,
      ratio: 1,
      stamp: false,
      start: performance.now(),
      targetPresence: 0,
      targetX: 1,
      targetY: 1,
      width: 1,
      x: 1,
      y: 1,
    };

    const resize = () => {
      const box = shell.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(box.width * ratio));
      const height = Math.max(1, Math.round(box.height * ratio));
      const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      const offset = bleed ? Math.round(BLEED_REM * rem * ratio) : 0;
      state.ratio = ratio;
      state.width = width;
      state.height = height;
      state.offset = offset;
      state.x = width * 0.78;
      state.y = height * 0.5;
      state.targetX = state.x;
      state.targetY = state.y;
      reveal?.resize(box.width, box.height);

      // The backing canvases include the bleed, while shader coordinates keep
      // the original hero height so the visible composition does not shift.
      for (const layer of layers) {
        layer.node.width = width;
        layer.node.height = height + offset;
        layer.gl.viewport(0, 0, width, height + offset);
      }
    };

    const move = (event: PointerEvent) => {
      const box = shell.getBoundingClientRect();
      state.targetX = (event.clientX - box.left) * state.ratio;
      state.targetY = (box.bottom - event.clientY) * state.ratio;
      const inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
      state.targetPresence = inside ? 1 : 0;

      if (!state.pressed || !reveal) return;

      const x = ((event.clientX - box.left) / Math.max(box.width, 1)) * reveal.node.width;
      const y = ((event.clientY - box.top) / Math.max(box.height, 1)) * reveal.node.height;

      if (state.stamp) {
        state.stamp = false;
        reveal.wipe(x, y, PRESS_ALPHA);
        return;
      }

      const distance = Math.hypot(event.clientX - state.origin.x, event.clientY - state.origin.y);
      if (!state.drawing && distance < DRAG_MIN) return;

      state.drawing = true;
      reveal.wipe(x, y);
    };

    const down = (event: PointerEvent) => {
      event.preventDefault();
      shell.focus({ preventScroll: true });
      shell.setPointerCapture(event.pointerId);
      state.drawing = !reveal;
      state.origin.x = event.clientX;
      state.origin.y = event.clientY;
      state.pressed = true;
      state.stamp = Boolean(reveal);
      reveal?.reset();
      move(event);
    };

    const up = () => {
      state.drawing = false;
      state.pressed = false;
      state.stamp = false;
      reveal?.reset();
    };

    const enter = () => {
      state.targetPresence = 1;
    };

    const leave = () => {
      state.targetPresence = 0;
    };

    const press = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      state.targetX = state.width * 0.56;
      state.targetY = state.height * 0.62;
      state.targetPresence = 1;
      state.drawing = true;
      reveal?.reset();
      if (reveal) reveal.wipe(reveal.node.width * 0.56, reveal.node.height * 0.38);
    };

    const release = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      state.drawing = false;
      state.pressed = false;
      reveal?.reset();
    };

    const blur = () => {
      state.drawing = false;
      state.pressed = false;
      state.stamp = false;
      reveal?.reset();
      state.targetPresence = 0;
    };

    const render = (now: number) => {
      const delta = Math.max(0, Math.min(now - state.last, 64));
      state.last = now;
      state.x += (state.targetX - state.x) * 0.16;
      state.y += (state.targetY - state.y) * 0.16;
      state.presence += (state.targetPresence - state.presence) * 0.055;
      const elapsed = reduce.matches ? 3 : (now - state.start) / 1000;

      reveal?.heal(delta);

      for (const layer of layers) {
        draw(layer, reveal?.node ?? null, state, settings.current, elapsed);
      }

      state.frame = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(shell);
    resize();
    shell.addEventListener("pointerenter", enter);
    shell.addEventListener("pointerleave", leave);
    window.addEventListener("pointermove", move, { passive: true });
    if (clearing) {
      shell.addEventListener("pointerdown", down);
      shell.addEventListener("keydown", press);
      shell.addEventListener("keyup", release);
      shell.addEventListener("blur", blur);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    }
    state.frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(state.frame);
      observer.disconnect();
      shell.removeEventListener("pointerenter", enter);
      shell.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointermove", move);
      if (clearing) {
        shell.removeEventListener("pointerdown", down);
        shell.removeEventListener("keydown", press);
        shell.removeEventListener("keyup", release);
        shell.removeEventListener("blur", blur);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
      }
      for (const layer of layers) destroyLayer(layer);
    };
  }, [bleed, clearing, layered, revealing, source, visible]);

  return (
    <div
      {...props}
      ref={root}
      role={props.role ?? (clearing ? "button" : "img")}
      tabIndex={props.tabIndex ?? (clearing ? 0 : undefined)}
      aria-label={
        props["aria-label"] ??
        (clearing
          ? "Interactive refracted light. Press or drag to clear the mist."
          : mode === "sunlight"
            ? "Interactive sunlight. Move the pointer to bend the light."
            : "Refracted light moving through mist.")
      }
      className={cn(
        "relative isolate w-full",
        clearing
          ? "touch-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          : null,
        bleed ? "overflow-visible" : "overflow-hidden",
        mode === "night"
          ? "bg-[#1c1c1e] bg-[radial-gradient(circle,#3a3a3c_1px,transparent_1px),radial-gradient(circle,#3a3a3c_1px,transparent_1px)] bg-size-[22px_22px] bg-position-[0_0,11px_11px]"
          : "bg-[#d1cfcb]",
        className,
      )}
    >
      {children}
      {visible ? (
        <canvas
          key={`${layered ? "layered" : "single"}-${bleed ? "bleed" : "clipped"}-${revealing ? "reveal" : clearing ? "clearable" : "ambient"}`}
          ref={canvas}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 w-full",
            bleed
              ? "h-[calc(100%+8rem)] [mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%_-_8rem),transparent_100%)]"
              : "h-full",
          )}
        />
      ) : null}
      {visible && layered ? (
        <canvas
          key={`veil-${bleed ? "bleed" : "clipped"}-${clearing ? "clearable" : "ambient"}`}
          ref={veil}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 w-full blur-[1.2px]",
            bleed
              ? "h-[calc(100%+8rem)] [mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%_-_8rem),transparent_100%)]"
              : "h-full",
          )}
        />
      ) : null}
      {mode === "night" ? (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#12141a]/42 via-[#12141a]/14 via-40% to-transparent to-60%" />
      ) : null}
    </div>
  );
}
