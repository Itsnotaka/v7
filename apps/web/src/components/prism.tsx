"use client";

import type * as React from "react";

import { useEffect, useRef, useState } from "react";

import { cn } from "~/utils/cn";

type Source = {
  fragment: string;
  vertex: string;
};

type PrismProps = Omit<React.ComponentProps<"div">, "children"> & {
  mode?: "mist" | "sunlight";
};

export function Prism({ className, mode = "mist", ...props }: PrismProps) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [source, setSource] = useState<Source>();

  useEffect(() => {
    const state = { active: true };
    const load = (path: string) => fetch(path).then((response) => response.text());

    void Promise.all([load("/shaders/prism.vert"), load("/shaders/prism.frag")])
      .then(([vertex, fragment]) => {
        if (state.active) setSource({ fragment, vertex });
      })
      .catch((error: unknown) => console.error(error));

    return () => {
      state.active = false;
    };
  }, []);

  useEffect(() => {
    const shell = root.current;
    const node = canvas.current;
    if (!shell || !node || !source) return;

    const gl = node.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const compile = (type: number, code: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    };

    const vertex = compile(gl.VERTEX_SHADER, source.vertex);
    const fragment = compile(gl.FRAGMENT_SHADER, source.fragment);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const pointer = gl.getUniformLocation(program, "u_pointer");
    const time = gl.getUniformLocation(program, "u_time");
    const presence = gl.getUniformLocation(program, "u_presence");
    const drawing = gl.getUniformLocation(program, "u_drawing");
    const sunlight = gl.getUniformLocation(program, "u_sunlight");
    gl.uniform1f(sunlight, mode === "sunlight" ? 1 : 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = {
      drawing: false,
      frame: 0,
      height: 1,
      presence: 0,
      ratio: 1,
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
      state.ratio = ratio;
      state.width = width;
      state.height = height;
      state.x = width * 0.78;
      state.y = height * 0.5;
      state.targetX = state.x;
      state.targetY = state.y;
      node.width = width;
      node.height = height;
      gl.viewport(0, 0, width, height);
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
    };

    const down = (event: PointerEvent) => {
      if (mode === "sunlight") {
        move(event);
        return;
      }
      if (event.pointerType !== "touch") event.preventDefault();
      shell.focus({ preventScroll: true });
      shell.setPointerCapture(event.pointerId);
      state.drawing = true;
      move(event);
    };

    const up = () => {
      state.drawing = false;
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
    };

    const release = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      state.drawing = false;
    };

    const blur = () => {
      state.drawing = false;
      state.targetPresence = 0;
    };

    const render = (now: number) => {
      state.x += (state.targetX - state.x) * 0.16;
      state.y += (state.targetY - state.y) * 0.16;
      state.presence += (state.targetPresence - state.presence) * 0.055;
      const elapsed = reduce.matches ? 3 : (now - state.start) / 1000;
      gl.uniform2f(resolution, state.width, state.height);
      gl.uniform2f(pointer, state.x, state.y);
      gl.uniform1f(time, elapsed);
      gl.uniform1f(presence, state.presence);
      gl.uniform1f(drawing, state.drawing ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      state.frame = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(shell);
    resize();
    shell.addEventListener("pointerdown", down);
    shell.addEventListener("pointerenter", enter);
    shell.addEventListener("pointerleave", leave);
    shell.addEventListener("keydown", press);
    shell.addEventListener("keyup", release);
    shell.addEventListener("blur", blur);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    state.frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(state.frame);
      observer.disconnect();
      shell.removeEventListener("pointerdown", down);
      shell.removeEventListener("pointerenter", enter);
      shell.removeEventListener("pointerleave", leave);
      shell.removeEventListener("keydown", press);
      shell.removeEventListener("keyup", release);
      shell.removeEventListener("blur", blur);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [mode, source]);

  return (
    <div
      {...props}
      ref={root}
      role={props.role ?? (mode === "sunlight" ? "img" : "button")}
      tabIndex={props.tabIndex ?? (mode === "sunlight" ? undefined : 0)}
      aria-label={
        props["aria-label"] ??
        (mode === "sunlight"
          ? "Interactive sunlight. Move the pointer to bend the light."
          : "Interactive refracted light.")
      }
      className={cn(
        "relative isolate w-full touch-none overflow-hidden bg-[#d1cfcb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" />
      {mode === "mist" ? (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#e6e2da]/55 via-[#e6e2da]/18 via-40% to-transparent to-60%" />
      ) : null}
    </div>
  );
}
