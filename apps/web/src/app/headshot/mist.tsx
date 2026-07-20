"use client";

import type { MotionValue } from "motion/react";

import { useEffect, useRef } from "react";

const HEAD = "/headshot/lando-head.jpg";
const HEAD_MOBILE = "/headshot/lando-head-mobile.jpg";

type Target = {
  fbo: WebGLFramebuffer;
  texture: WebGLTexture;
};

type Shader = {
  program: WebGLProgram;
  uniforms: Map<string, WebGLUniformLocation | null>;
};

type Photo = {
  height: number;
  texture: WebGLTexture;
  width: number;
};

type Props = {
  compact: boolean;
  locked: boolean;
  progress: MotionValue<number>;
  reduce: boolean;
};

export function Mist({ compact, locked, progress, reduce }: Props) {
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

    const brush = `#version 300 es
      precision highp float;
      uniform sampler2D field;
      uniform vec2 start;
      uniform vec2 end;
      uniform vec2 ratio;
      uniform float radius;
      uniform float paint;
      uniform float recovery;
      in vec2 uv;
      out vec4 outputColor;

      void main() {
        vec2 point = (uv - start) * ratio;
        vec2 line = (end - start) * ratio;
        float along = clamp(dot(point, line) / max(dot(line, line), 0.000001), 0.0, 1.0);
        float distanceValue = length(point - line * along);
        float stroke = (1.0 - smoothstep(radius * 0.58, radius, distanceValue)) * paint;
        float previous = texture(field, uv).r;
        float value = max(max(0.0, previous - recovery), stroke);
        outputColor = vec4(value, value, value, 1.0);
      }
    `;

    const composite = `#version 300 es
      precision highp float;
      uniform sampler2D scene;
      uniform sampler2D field;
      uniform vec2 resolution;
      uniform vec2 sourceSize;
      uniform vec2 pointer;
      uniform vec2 beamDirection;
      uniform float time;
      uniform float disclose;
      uniform float presence;
      in vec2 uv;
      out vec4 outputColor;

      float hash(vec2 point) {
        point = fract(point * vec2(123.34, 456.21));
        point += dot(point, point + 45.32);
        return fract(point.x * point.y);
      }

      float noise(vec2 point) {
        vec2 cell = floor(point);
        vec2 local = fract(point);
        vec2 curve = local * local * (3.0 - 2.0 * local);
        return mix(
          mix(hash(cell), hash(cell + vec2(1.0, 0.0)), curve.x),
          mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), curve.x),
          curve.y
        );
      }

      float fbm(vec2 point) {
        float value = 0.0;
        float weight = 0.5;
        for (int index = 0; index < 4; index++) {
          value += noise(point) * weight;
          point = point * 2.03 + 0.17;
          weight *= 0.5;
        }
        return value;
      }

      vec2 coverScale() {
        float targetAspect = resolution.x / resolution.y;
        float sourceAspect = sourceSize.x / sourceSize.y;
        if (targetAspect > sourceAspect) return vec2(1.0, sourceAspect / targetAspect);
        return vec2(targetAspect / sourceAspect, 1.0);
      }

      vec2 coverUv(vec2 point) {
        return (point - 0.5) * coverScale() + 0.5;
      }

      vec3 spectrum(float hue) {
        vec3 color = clamp(abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return color * color * (3.0 - 2.0 * color);
      }

      vec3 ray(vec2 point, vec2 apex, vec2 direction, float hue, float reach, float split) {
        vec2 delta = point - apex;
        float along = dot(delta, direction);
        float across = direction.x * delta.y - direction.y * delta.x;
        float forward = smoothstep(-0.025, 0.075, along);
        float aspect = resolution.x / resolution.y;
        float width = (0.018 + max(along, 0.0) * 0.17) * min(1.0, aspect);
        float band = exp(-pow(across / width, 2.0));
        float end = 1.0 - smoothstep(reach - 0.34, reach, along);
        float glow = exp(-max(along, 0.0) * 0.68);
        vec3 neutral = vec3(0.94, 0.91, 0.84);
        vec3 color = mix(neutral, spectrum(hue - across / width * split), 0.68);
        return color * band * forward * end * (0.26 + glow * 0.74);
      }

      vec3 prismLight(vec2 point) {
        float aspect = resolution.x / resolution.y;
        vec2 position = vec2(point.x * aspect, point.y);
        vec2 apex = vec2(0.975 * aspect, 0.52 + sin(time * 0.16) * 0.012);
        vec2 cursor = vec2(pointer.x * aspect, pointer.y);
        vec2 swipe = normalize(vec2(beamDirection.x * aspect, beamDirection.y) + vec2(0.0001));
        float proximity = smoothstep(0.72, 0.08, length(cursor - apex));
        float influence = presence * mix(0.35, 1.0, proximity);
        vec2 upper = normalize(vec2(0.39 * aspect, 1.08) - apex + swipe * influence * 0.22);
        vec2 lower = normalize(vec2(0.55 * aspect, -0.10) - apex + swipe * influence * 0.18);
        float split = 0.075 + presence * 0.075;
        vec3 light = ray(position, apex, upper, 0.58, 1.78, split);
        light += ray(position, apex, lower, 0.045, 1.78, split);
        float focus = exp(-dot(position - apex, position - apex) * 20.0);
        light += vec3(1.0, 0.93, 0.78) * focus * 0.28;
        float strength = mix(0.68, 1.0, smoothstep(0.55, 1.05, aspect));
        return clamp(light * strength, 0.0, 1.0);
      }

      void main() {
        vec2 px = 1.0 / resolution;
        float aspect = resolution.x / resolution.y;
        vec2 crop = coverScale();
        vec2 sceneUv = coverUv(uv);
        float center = texture(field, uv).r;
        float left = texture(field, uv - vec2(px.x * 2.0, 0.0)).r;
        float right = texture(field, uv + vec2(px.x * 2.0, 0.0)).r;
        float lower = texture(field, uv - vec2(0.0, px.y * 2.0)).r;
        float upper = texture(field, uv + vec2(0.0, px.y * 2.0)).r;
        vec2 gradient = vec2(right - left, upper - lower);
        float edge = smoothstep(0.065, 0.24, length(gradient));
        vec2 normal = gradient / max(length(gradient), 0.0001);
        vec2 scale = vec2(1.0 / aspect, 1.0);
        vec2 bend = normal * scale * crop * edge * 0.012;

        float cloud = fbm(uv * vec2(1.35 * aspect, 1.35) + vec2(time * 0.011, -time * 0.008));
        float wisp = fbm(uv * vec2(3.1 * aspect, 3.1) + vec2(-time * 0.008, time * 0.013));
        vec2 drift = vec2(
          noise(uv * 3.6 + vec2(time * 0.018, 4.2)) - 0.5,
          noise(uv * 3.1 + vec2(8.1, -time * 0.014)) - 0.5
        );

        vec2 blur = px * crop * (7.0 + cloud * 8.0);
        vec3 soft = texture(scene, sceneUv + drift * px * crop * 7.0).rgb * 0.28;
        soft += texture(scene, sceneUv + vec2(blur.x, 0.0)).rgb * 0.18;
        soft += texture(scene, sceneUv - vec2(blur.x, 0.0)).rgb * 0.18;
        soft += texture(scene, sceneUv + vec2(0.0, blur.y)).rgb * 0.18;
        soft += texture(scene, sceneUv - vec2(0.0, blur.y)).rgb * 0.18;

        float cooling = clamp(uv.x * 0.58 + (cloud - 0.5) * 0.34, 0.0, 1.0);
        vec3 fog = mix(vec3(0.88, 0.875, 0.855), vec3(0.60, 0.65, 0.69), cooling);
        float density = clamp(0.61 + cloud * 0.24 + wisp * 0.11, 0.62, 0.92);
        vec3 veiled = mix(soft, fog, density);

        vec3 light = prismLight(uv);
        float energy = max(light.r, max(light.g, light.b));
        vec2 shimmer = vec2(
          sin(uv.y * 17.0 + time * 0.7),
          cos(uv.x * 13.0 - time * 0.54)
        ) * scale * crop * energy * 0.0028;
        vec3 refracted;
        refracted.r = texture(scene, sceneUv + bend * 1.28 + shimmer * 1.25).r;
        refracted.g = texture(scene, sceneUv + bend * 0.88 + shimmer * 0.86).g;
        refracted.b = texture(scene, sceneUv + bend * 0.52 + shimmer * 0.54).b;

        float clear = max(center, disclose);
        float grain = hash(gl_FragCoord.xy + fract(time) * 97.0) - 0.5;
        veiled += grain * 0.018;
        vec3 color = mix(veiled, refracted, smoothstep(0.04, 0.88, clear));
        float rim = edge * (1.0 - disclose) * (0.38 + wisp * 0.42);
        color += mix(vec3(0.94, 0.91, 0.82), vec3(0.70, 0.84, 1.0), cooling) * rim * 0.14;
        color += light * mix(0.48, 0.20, clear) * (1.0 - disclose * 0.58);
        outputColor = vec4(clamp(color, 0.0, 1.0), 1.0);
      }
    `;

    const compile = (kind: number, source: string) => {
      const shader = gl.createShader(kind);
      if (!shader) throw new Error("Unable to create the mist shader.");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      throw new Error(gl.getShaderInfoLog(shader) ?? "Unable to compile the mist shader.");
    };

    const create = (fragment: string): Shader => {
      const program = gl.createProgram();
      if (!program) throw new Error("Unable to create the mist program.");
      const vertexShader = compile(gl.VERTEX_SHADER, vertex);
      const fragmentShader = compile(gl.FRAGMENT_SHADER, fragment);
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? "Unable to link the mist program.");
      }
      return { program, uniforms: new Map() };
    };

    const shaders = {
      brush: create(brush),
      composite: create(composite),
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
      if (!texture || !fbo) throw new Error("Unable to create the mist field.");
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, width, height, 0, gl.RED, gl.HALF_FLOAT, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error("The mist field framebuffer is incomplete.");
      }
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { fbo, texture };
    };

    const image = (url: string) =>
      new Promise<Photo>((resolve, reject) => {
        const source = new window.Image();
        source.decoding = "async";
        source.onload = () => {
          const texture = gl.createTexture();
          if (!texture) {
            reject(new Error("Unable to create the portrait texture."));
            return;
          }
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
          resolve({ height: source.naturalHeight, texture, width: source.naturalWidth });
        };
        source.onerror = () => reject(new Error(`Unable to load ${url}.`));
        source.src = url;
      });

    const state: {
      active: boolean;
      field0: Target | null;
      field1: Target | null;
      flip: boolean;
      frame: number;
      height: number;
      scene: WebGLTexture | null;
      start: number;
      time: number;
      width: number;
    } = {
      active: true,
      field0: null,
      field1: null,
      flip: false,
      frame: 0,
      height: 0,
      scene: null,
      start: performance.now(),
      time: 0,
      width: 0,
    };

    const pointer = {
      dx: -1,
      dy: 0,
      last: 0,
      moved: false,
      oldX: 0.5,
      oldY: 0.5,
      pending: false,
      x: 0.5,
      y: 0.5,
    };

    const dispose = (item: Target | null) => {
      if (!item) return;
      gl.deleteFramebuffer(item.fbo);
      gl.deleteTexture(item.texture);
    };

    const resize = () => {
      const width = Math.max(1, Math.round(window.innerWidth));
      const height = Math.max(1, Math.round(window.innerHeight));
      if (state.width === width && state.height === height) return;

      dispose(state.field0);
      dispose(state.field1);
      state.width = width;
      state.height = height;
      node.width = width;
      node.height = height;
      state.field0 = target(
        Math.max(2, Math.round(width * 0.4)),
        Math.max(2, Math.round(height * 0.4)),
      );
      state.field1 = target(
        Math.max(2, Math.round(width * 0.4)),
        Math.max(2, Math.round(height * 0.4)),
      );
      state.flip = false;
    };

    const move = (event: PointerEvent) => {
      if (progress.get() > 0.48) return;
      if (event.pointerType === "touch" && !lock.current) return;
      const rect = node.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height));
      if (!pointer.moved) {
        pointer.oldX = x;
        pointer.oldY = y;
      }
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      if (pointer.moved && Math.hypot(dx, dy) > 0.001) {
        pointer.dx = dx;
        pointer.dy = dy;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.last = performance.now();
      pointer.moved = true;
      pointer.pending = true;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    node.addEventListener("pointermove", move, { passive: true });

    void image(compact ? HEAD_MOBILE : HEAD).then((photo) => {
      if (!state.active) {
        gl.deleteTexture(photo.texture);
        return;
      }
      state.scene = photo.texture;

      const render = (now: number) => {
        if (!state.active || !state.field0 || !state.field1) return;
        const elapsed = state.time === 0 ? 0 : Math.min(0.05, (now - state.time) / 1000);
        const rect = node.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));
        const source = state.flip ? state.field1 : state.field0;
        const output = state.flip ? state.field0 : state.field1;
        const paint = pointer.pending ? 1 : 0;
        const presence = pointer.moved ? Math.max(0, 1 - (now - pointer.last) / 1600) : 0;
        state.time = now;

        gl.disable(gl.BLEND);
        gl.bindFramebuffer(gl.FRAMEBUFFER, output.fbo);
        gl.viewport(
          0,
          0,
          Math.max(2, Math.round(state.width * 0.4)),
          Math.max(2, Math.round(state.height * 0.4)),
        );
        gl.useProgram(shaders.brush.program);
        bind(shaders.brush, "field", 0, source.texture);
        gl.uniform2f(location(shaders.brush, "start"), pointer.oldX, pointer.oldY);
        gl.uniform2f(location(shaders.brush, "end"), pointer.x, pointer.y);
        gl.uniform2f(location(shaders.brush, "ratio"), width / height, 1);
        gl.uniform1f(location(shaders.brush, "radius"), compact ? 0.105 : 0.088);
        gl.uniform1f(location(shaders.brush, "paint"), paint);
        gl.uniform1f(location(shaders.brush, "recovery"), elapsed * 0.16);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        pointer.oldX = pointer.x;
        pointer.oldY = pointer.y;
        pointer.pending = false;
        state.flip = !state.flip;

        const phase = Math.max(0, Math.min(1, (progress.get() - 0.3) / 0.28));
        const disclose = phase * phase * (3 - 2 * phase);
        if (node.width !== width) node.width = width;
        if (node.height !== height) node.height = height;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, node.width, node.height);
        gl.useProgram(shaders.composite.program);
        bind(shaders.composite, "scene", 0, photo.texture);
        bind(shaders.composite, "field", 1, output.texture);
        gl.uniform2f(location(shaders.composite, "resolution"), width, height);
        gl.uniform2f(location(shaders.composite, "sourceSize"), photo.width, photo.height);
        gl.uniform2f(location(shaders.composite, "pointer"), pointer.x, pointer.y);
        gl.uniform2f(location(shaders.composite, "beamDirection"), pointer.dx, pointer.dy);
        gl.uniform1f(location(shaders.composite, "time"), reduce ? 3 : (now - state.start) / 1000);
        gl.uniform1f(location(shaders.composite, "disclose"), disclose);
        gl.uniform1f(location(shaders.composite, "presence"), presence);
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
      dispose(state.field0);
      dispose(state.field1);
      if (state.scene) gl.deleteTexture(state.scene);
      Object.values(shaders).forEach((shader) => gl.deleteProgram(shader.program));
    };
  }, [compact, progress, reduce]);

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label="Swipe over Lando's portrait to clear the mist and bend the light"
      className="absolute inset-0 z-10 h-full w-full"
      style={{ touchAction: locked ? "none" : "pan-y" }}
    />
  );
}
