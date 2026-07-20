"use client";

import type { MotionValue } from "motion/react";

import { useEffect, useRef } from "react";

const HEAD = "/headshot/lando-head.jpg";
const HELMET = "/headshot/lando-helmet.jpg";
const HEAD_MOBILE = "/headshot/lando-head-mobile.jpg";
const HELMET_MOBILE = "/headshot/lando-helmet-mobile.jpg";

type Target = {
  fbo: WebGLFramebuffer;
  texture: WebGLTexture;
};

type Shader = {
  program: WebGLProgram;
  uniforms: Map<string, WebGLUniformLocation | null>;
};

type Targets = {
  div: Target;
  pressure0: Target;
  pressure1: Target;
  vel0: Target;
  vel1: Target;
};

type LiquidProps = {
  compact: boolean;
  locked: boolean;
  progress: MotionValue<number>;
  reduce: boolean;
};

export function Liquid({ compact, locked, progress, reduce }: LiquidProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const lock = useRef(locked);

  useEffect(() => {
    lock.current = locked;
  }, [locked]);

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;

    const gl = node.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      premultipliedAlpha: false,
      stencil: false,
    });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return;

    gl.getExtension("OES_texture_float_linear");

    const vertex = `#version 300 es
      precision highp float;
      out vec2 uv;

      void main() {
        vec2 point = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
        uv = point;
        gl_Position = vec4(point * 2.0 - 1.0, 0.0, 1.0);
      }
    `;

    const advection = `#version 300 es
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform float dissipation;
      uniform vec2 fboSize;
      in vec2 uv;
      out vec4 outputColor;

      void main() {
        vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
        vec2 spotNew = uv;
        vec2 velocityOld = texture(velocity, uv).xy;
        vec2 spotOld = spotNew - velocityOld * dt * ratio;
        vec2 velocityNew = texture(velocity, spotOld).xy;
        vec2 spotNewTwo = spotOld + velocityNew * dt * ratio;
        vec2 error = spotNewTwo - spotNew;
        vec2 spotNewThree = spotNew - error / 2.0;
        vec2 velocityTwo = texture(velocity, spotNewThree).xy;
        vec2 spotOldTwo = spotNewThree - velocityTwo * dt * ratio;
        vec2 result = texture(velocity, spotOldTwo).xy * dissipation;
        outputColor = vec4(result, 0.0, 0.0);
      }
    `;

    const force = `#version 300 es
      precision highp float;
      uniform vec2 forceValue;
      uniform vec2 center;
      uniform vec2 radius;
      in vec2 uv;
      out vec4 outputColor;

      void main() {
        vec2 point = uv * 2.0 - 1.0;
        vec2 circle = (point - center) / radius;
        float distanceValue = 1.0 - min(length(circle), 1.0);
        distanceValue *= distanceValue;
        outputColor = vec4(forceValue * distanceValue, 0.0, 1.0);
      }
    `;

    const divergence = `#version 300 es
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 px;
      in vec2 uv;
      out vec4 outputColor;

      void main() {
        float x0 = texture(velocity, uv - vec2(px.x, 0.0)).x;
        float x1 = texture(velocity, uv + vec2(px.x, 0.0)).x;
        float y0 = texture(velocity, uv - vec2(0.0, px.y)).y;
        float y1 = texture(velocity, uv + vec2(0.0, px.y)).y;
        float value = (x1 - x0 + y1 - y0) / 2.0;
        outputColor = vec4(vec3(value / dt), 1.0);
      }
    `;

    const poisson = `#version 300 es
      precision highp float;
      uniform sampler2D pressure;
      uniform sampler2D divergence;
      uniform float straightness;
      uniform vec2 px;
      in vec2 uv;
      out vec4 outputColor;

      void main() {
        float p0 = texture(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
        float p1 = texture(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
        float p2 = texture(pressure, uv + vec2(0.0, px.y * 2.0)).r;
        float p3 = texture(pressure, uv - vec2(0.0, px.y * 2.0)).r;
        float div = texture(divergence, uv).r;
        float result = (p0 + p1 + p2 + p3) / (4.0 + straightness) - div;
        outputColor = vec4(vec3(result), 1.0);
      }
    `;

    const pressure = `#version 300 es
      precision highp float;
      uniform sampler2D pressureTexture;
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 px;
      in vec2 uv;
      out vec4 outputColor;

      void main() {
        float p0 = texture(pressureTexture, uv + vec2(px.x, 0.0)).r;
        float p1 = texture(pressureTexture, uv - vec2(px.x, 0.0)).r;
        float p2 = texture(pressureTexture, uv + vec2(0.0, px.y)).r;
        float p3 = texture(pressureTexture, uv - vec2(0.0, px.y)).r;
        vec2 value = texture(velocity, uv).xy;
        vec2 gradient = vec2(p0 - p1, p2 - p3) * 0.5;
        outputColor = vec4(value - gradient * dt, 0.0, 1.0);
      }
    `;

    const composite = `#version 300 es
      precision highp float;
      uniform sampler2D head;
      uniform sampler2D helmet;
      uniform sampler2D velocity;
      uniform float intensity;
      in vec2 uv;
      out vec4 outputColor;

      void main() {
        vec2 cursorUv = vec2(0.025) + uv * 0.95;
        vec2 value = texture(velocity, cursorUv).xy;
        float lengthValue = length(value);
        float encodedRed = value.x * 0.5 + 0.5;
        float renderedRed = clamp(mix(1.0, encodedRed, lengthValue), 0.0, 1.0);
        float cursor = step(0.1, 1.0 - renderedRed) * intensity;
        vec4 base = texture(head, uv);
        vec4 reveal = texture(helmet, uv);
        outputColor = mix(base, reveal, cursor);
      }
    `;

    const compile = (kind: number, source: string) => {
      const shader = gl.createShader(kind);
      if (!shader) throw new Error("Unable to create the liquid shader.");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      throw new Error(gl.getShaderInfoLog(shader) ?? "Unable to compile the liquid shader.");
    };

    const create = (fragment: string): Shader => {
      const program = gl.createProgram();
      if (!program) throw new Error("Unable to create the liquid program.");
      const vertexShader = compile(gl.VERTEX_SHADER, vertex);
      const fragmentShader = compile(gl.FRAGMENT_SHADER, fragment);
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? "Unable to link the liquid program.");
      }
      return { program, uniforms: new Map() };
    };

    const shaders = {
      advection: create(advection),
      composite: create(composite),
      divergence: create(divergence),
      force: create(force),
      poisson: create(poisson),
      pressure: create(pressure),
    };

    const location = (shader: Shader, name: string) => {
      if (!shader.uniforms.has(name)) {
        shader.uniforms.set(name, gl.getUniformLocation(shader.program, name));
      }
      return shader.uniforms.get(name) ?? null;
    };

    const bind = (shader: Shader, name: string, unit: number, texture: WebGLTexture) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(location(shader, name), unit);
    };

    const target = (width: number, height: number): Target => {
      const texture = gl.createTexture();
      const fbo = gl.createFramebuffer();
      if (!texture || !fbo) throw new Error("Unable to create the liquid field.");
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error("The liquid field framebuffer is incomplete.");
      }
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { fbo, texture };
    };

    const dispose = (item: Target) => {
      gl.deleteFramebuffer(item.fbo);
      gl.deleteTexture(item.texture);
    };

    const state: {
      active: boolean;
      frame: number;
      height: number;
      intensity: number;
      step: number;
      targets: Targets | null;
      time: number;
      width: number;
    } = {
      active: true,
      frame: 0,
      height: 0,
      intensity: 1,
      step: 0,
      targets: null,
      time: 0,
      width: 0,
    };

    const pointer = {
      last: performance.now(),
      oldX: 0,
      oldY: 0,
      x: 0,
      y: 0,
    };

    const resize = () => {
      const width = Math.max(1, Math.round(window.innerWidth));
      const height = Math.max(1, Math.round(window.innerHeight));
      if (state.width === width && state.height === height) return;

      if (state.targets) Object.values(state.targets).forEach(dispose);
      const simWidth = Math.max(2, Math.round(width * 0.1));
      const simHeight = Math.max(2, Math.round(height * 0.1));
      state.width = width;
      state.height = height;
      node.width = width;
      node.height = height;
      state.targets = {
        div: target(simWidth, simHeight),
        pressure0: target(simWidth, simHeight),
        pressure1: target(simWidth, simHeight),
        vel0: target(simWidth, simHeight),
        vel1: target(simWidth, simHeight),
      };
    };

    const image = (url: string) =>
      new Promise<WebGLTexture>((resolve, reject) => {
        const source = new window.Image();
        source.decoding = "async";
        source.onload = () => {
          const texture = gl.createTexture();
          if (!texture) {
            reject(new Error("Unable to create an image texture."));
            return;
          }
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
          resolve(texture);
        };
        source.onerror = () => reject(new Error(`Unable to load ${url}.`));
        source.src = url;
      });

    const pass = (shader: Shader, output: Target | null, width: number, height: number) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, output?.fbo ?? null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(shader.program);
    };

    const move = (event: PointerEvent) => {
      if (progress.get() > 0.46) return;
      if (event.pointerType === "touch" && !lock.current) return;
      const rect = node.getBoundingClientRect();
      pointer.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      pointer.y = Math.max(-1, Math.min(1, 1 - ((event.clientY - rect.top) / rect.height) * 2));
      pointer.last = performance.now();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    node.addEventListener("pointermove", move, { passive: true });

    const headUrl = compact ? HEAD_MOBILE : HEAD;
    const helmetUrl = compact ? HELMET_MOBILE : HELMET;

    void Promise.all([image(headUrl), image(helmetUrl)]).then((textures) => {
      if (!state.active) {
        textures.forEach((texture) => gl.deleteTexture(texture));
        return;
      }

      const head = textures[0];
      const helmet = textures[1];

      const render = (time: number) => {
        if (!state.active || !state.targets) return;
        const elapsed = state.time === 0 ? 0 : Math.min(0.032, (time - state.time) / 1000);
        const targetIntensity = progress.get() > 1 / 2.25 ? 0 : 1;
        const blend = Math.min(1, elapsed * 7);
        state.time = time;
        state.intensity += (targetIntensity - state.intensity) * blend;

        if (time - state.step > 1000 / 60) {
          const idle = time - pointer.last > 2500 && progress.get() < 0.42 && !reduce;
          const cycle = Math.max(0, ((time - pointer.last - 2500) / 1000) % 9.5);
          const linear =
            cycle < 2.5 ? cycle / 2.5 : cycle < 4 ? 1 : cycle < 6.5 ? 1 - (cycle - 4) / 2.5 : 0;
          const ease = linear < 0.5 ? 2 * linear * linear : 1 - Math.pow(-2 * linear + 2, 2) / 2;
          const x = idle ? -Math.cos(ease * Math.PI * 4) * 0.75 : pointer.x;
          const y = idle ? Math.cos(linear * Math.PI) * 0.5 : pointer.y;
          const dx = x - pointer.oldX;
          const dy = y - pointer.oldY;
          const simWidth = Math.max(2, Math.round(state.width * 0.1));
          const simHeight = Math.max(2, Math.round(state.height * 0.1));
          const px = 1 / 110;
          const py = simWidth / (110 * simHeight);
          const radiusX = 18 * px;
          const radiusY = 18 * py;
          const centerX = Math.min(Math.max(x, -1 + radiusX + px * 2), 1 - radiusX - px * 2);
          const centerY = Math.min(Math.max(y, -1 + radiusY + py * 2), 1 - radiusY - py * 2);

          pointer.oldX = x;
          pointer.oldY = y;
          state.step = time - ((time - state.step) % (1000 / 60));

          gl.disable(gl.BLEND);
          pass(shaders.advection, state.targets.vel1, simWidth, simHeight);
          bind(shaders.advection, "velocity", 0, state.targets.vel0.texture);
          gl.uniform1f(location(shaders.advection, "dt"), 0.014);
          gl.uniform1f(location(shaders.advection, "dissipation"), 0.96);
          gl.uniform2f(location(shaders.advection, "fboSize"), simWidth, simHeight);
          gl.drawArrays(gl.TRIANGLES, 0, 3);

          gl.enable(gl.BLEND);
          gl.blendFunc(gl.ONE, gl.ONE);
          pass(shaders.force, state.targets.vel1, simWidth, simHeight);
          gl.uniform2f(location(shaders.force, "forceValue"), (dx / 2) * 50, (dy / 2) * 50);
          gl.uniform2f(location(shaders.force, "center"), centerX, centerY);
          gl.uniform2f(location(shaders.force, "radius"), radiusX, radiusY);
          gl.drawArrays(gl.TRIANGLES, 0, 3);

          gl.disable(gl.BLEND);
          pass(shaders.divergence, state.targets.div, simWidth, simHeight);
          bind(shaders.divergence, "velocity", 0, state.targets.vel1.texture);
          gl.uniform1f(location(shaders.divergence, "dt"), 0.014);
          gl.uniform2f(location(shaders.divergence, "px"), px, py);
          gl.drawArrays(gl.TRIANGLES, 0, 3);

          [0, 1, 2, 3].forEach((index) => {
            const source = index % 2 === 0 ? state.targets?.pressure0 : state.targets?.pressure1;
            const output = index % 2 === 0 ? state.targets?.pressure1 : state.targets?.pressure0;
            if (!source || !output || !state.targets) return;
            pass(shaders.poisson, output, simWidth, simHeight);
            bind(shaders.poisson, "pressure", 0, source.texture);
            bind(shaders.poisson, "divergence", 1, state.targets.div.texture);
            gl.uniform1f(location(shaders.poisson, "straightness"), 1);
            gl.uniform2f(location(shaders.poisson, "px"), px, py);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
          });

          pass(shaders.pressure, state.targets.vel0, simWidth, simHeight);
          bind(shaders.pressure, "pressureTexture", 0, state.targets.pressure0.texture);
          bind(shaders.pressure, "velocity", 1, state.targets.vel1.texture);
          gl.uniform1f(location(shaders.pressure, "dt"), 0.014);
          gl.uniform2f(location(shaders.pressure, "px"), px, py);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }

        gl.disable(gl.BLEND);
        pass(shaders.composite, null, node.width, node.height);
        bind(shaders.composite, "head", 0, head);
        bind(shaders.composite, "helmet", 1, helmet);
        bind(shaders.composite, "velocity", 2, state.targets.vel0.texture);
        gl.uniform1f(location(shaders.composite, "intensity"), state.intensity);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        state.frame = window.requestAnimationFrame(render);
      };

      state.frame = window.requestAnimationFrame(render);
    });

    return () => {
      state.active = false;
      window.cancelAnimationFrame(state.frame);
      window.removeEventListener("resize", resize);
      node.removeEventListener("pointermove", move);
      if (state.targets) Object.values(state.targets).forEach(dispose);
      Object.values(shaders).forEach((shader) => gl.deleteProgram(shader.program));
    };
  }, [compact, progress, reduce]);

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label="Move over Lando's portrait to reveal his helmet through the liquid field"
      className="absolute inset-0 z-10 h-full w-full"
      style={{ touchAction: locked ? "none" : "pan-y" }}
    />
  );
}
