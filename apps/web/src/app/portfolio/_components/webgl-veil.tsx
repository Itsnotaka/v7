"use client";

import { useEffect, useRef } from "react";

import type { PortfolioId } from "../portfolio-content";

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_tone;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

vec3 palette(float t, float tone) {
  if (tone < 1.5) {
    vec3 a = vec3(0.08, 0.07, 0.06);
    vec3 b = vec3(0.95, 0.67, 0.16);
    return mix(a, b, smoothstep(0.05, 0.95, t));
  }

  if (tone < 2.5) {
    vec3 a = vec3(0.98, 0.94, 0.89);
    vec3 b = vec3(0.76, 0.46, 0.25);
    return mix(a, b, smoothstep(0.08, 0.92, t));
  }

  if (tone < 3.5) {
    vec3 a = vec3(0.05, 0.08, 0.15);
    vec3 b = vec3(0.23, 0.95, 0.92);
    vec3 c = vec3(0.95, 0.24, 0.77);
    return mix(mix(a, b, t), c, smoothstep(0.55, 1.0, t));
  }

  if (tone < 4.5) {
    vec3 a = vec3(0.98, 0.92, 0.84);
    vec3 b = vec3(0.76, 0.12, 0.19);
    return mix(a, b, smoothstep(0.15, 0.95, t));
  }

  vec3 a = vec3(0.05, 0.11, 0.17);
  vec3 b = vec3(0.99, 0.67, 0.20);
  vec3 c = vec3(0.28, 0.83, 0.97);
  return mix(mix(a, b, t), c, smoothstep(0.68, 1.0, t));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_res) / min(u_res.x, u_res.y);
  vec2 pointer = (u_pointer - 0.5) * 2.0;
  float t = u_time * 0.19;

  vec2 p = uv;
  p += pointer * 0.32;
  p = rot(pointer.x * 0.35) * p;

  float field = 0.0;
  vec2 q = p;

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    q = rot(0.8 + fi * 0.42) * q * 1.23 + vec2(0.28, -0.16) * t;
    field += sin(q.x * 2.4 + t * (1.2 + fi * 0.1)) * 0.24;
    field += cos(q.y * 2.9 - t * (1.5 - fi * 0.08)) * 0.2;
    field += noise(q * 1.8 + fi * 2.1) * 0.36;
  }

  float vignette = smoothstep(1.4, 0.1, length(uv + pointer * 0.12));
  float grain = noise(uv * 120.0 + vec2(t * 15.0, -t * 11.0)) * 0.05;
  float mask = clamp(0.5 + field * 0.24 + grain, 0.0, 1.0);
  vec3 color = palette(mask, u_tone);
  color += vignette * 0.08;

  gl_FragColor = vec4(color, 0.72);
}
`;

function tone(id: PortfolioId): number {
  if (id === "1") {
    return 1;
  }

  if (id === "2") {
    return 2;
  }

  if (id === "3") {
    return 3;
  }

  if (id === "4") {
    return 4;
  }

  return 5;
}

function shader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const out = gl.createShader(type);

  if (!out) {
    return null;
  }

  gl.shaderSource(out, src);
  gl.compileShader(out);

  if (gl.getShaderParameter(out, gl.COMPILE_STATUS)) {
    return out;
  }

  gl.deleteShader(out);
  return null;
}

function program(
  gl: WebGLRenderingContext,
  vert: WebGLShader,
  frag: WebGLShader,
): WebGLProgram | null {
  const out = gl.createProgram();

  if (!out) {
    return null;
  }

  gl.attachShader(out, vert);
  gl.attachShader(out, frag);
  gl.linkProgram(out);

  if (gl.getProgramParameter(out, gl.LINK_STATUS)) {
    return out;
  }

  gl.deleteProgram(out);
  return null;
}

type Props = {
  id: PortfolioId;
};

export function WebglVeil(props: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;

    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      return;
    }

    const vert = shader(gl, gl.VERTEX_SHADER, VERT);

    if (!vert) {
      return;
    }

    const frag = shader(gl, gl.FRAGMENT_SHADER, FRAG);

    if (!frag) {
      gl.deleteShader(vert);
      return;
    }

    const prog = program(gl, vert, frag);

    if (!prog) {
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      return;
    }

    const buf = gl.createBuffer();

    if (!buf) {
      gl.deleteProgram(prog);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    gl.useProgram(prog);
    const locPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

    const locRes = gl.getUniformLocation(prog, "u_res");
    const locTime = gl.getUniformLocation(prog, "u_time");
    const locPointer = gl.getUniformLocation(prog, "u_pointer");
    const locTone = gl.getUniformLocation(prog, "u_tone");

    if (!locRes || !locTime || !locPointer || !locTone) {
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      return;
    }

    const state = {
      raf: 0,
      x: 0.5,
      y: 0.5,
    };

    const ratio = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));

      if (canvas.width === w && canvas.height === h) {
        return;
      }

      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const paint = (time: number) => {
      ratio();
      gl.uniform2f(locRes, canvas.width, canvas.height);
      gl.uniform1f(locTime, time * 0.001);
      gl.uniform2f(locPointer, state.x, state.y);
      gl.uniform1f(locTone, tone(props.id));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const loop = (time: number) => {
      paint(time);
      state.raf = requestAnimationFrame(loop);
    };

    const move = (event: PointerEvent) => {
      state.x = event.clientX / Math.max(window.innerWidth, 1);
      state.y = 1 - event.clientY / Math.max(window.innerHeight, 1);
    };

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", ratio);

    if (media.matches) {
      paint(0);
    }

    if (!media.matches) {
      state.raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", ratio);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [props.id]);

  return <canvas ref={ref} aria-hidden className="portfolio-webgl" />;
}
