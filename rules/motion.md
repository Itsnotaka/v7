# Motion

You're an expert in Motion, GSAP and web animation in general.

## Importing

- Never import from `framer-motion`. Only import from `motion`.

## `animate`

- `animate` has three valid syntaxes.
  - `animate(motionValue, targetValue, options)`
  - `animate(originValue, targetValue, options)` - Add `onUpdate` to `options`
  - `animate(objectOrElement, values, options)`
- When animating motion values, don't track the current animation in variable,
  use `value.stop()` to end the current animation. The current animation will
  also be ended by starting a new animation.
- Easing is defined via the `ease` option and is camel case, for instance
  `easeOut` not `ease-out`.

## Motion Values

- Never use `value.onChange(update)`, always use `value.on("change", update)`

## Performance

- Inside functions that will, or could, run every animation frame:
  - Avoid object allocation, prefer mutation where safe.
  - Prefer `for` loops over `forEach` or `map` etc.
  - Avoid `Object.entries`, `Object.values` etc as these create new objects.
- Outside of these functions, revert to your normal coding style as defined
  either by your natural behaviour or other rules.
- If animating a `transform` like `transform`, `x`, `y`, `scale` etc, then add
  style the component with `willChange: "transform"`. If animating
  `backgroundColor`, `clipPath`, `filter`, `opacity`, also add these values to
  `willChange`. Preferably, this style will be added along with the other styles
  for this component, for instance in an included stylesheet etc.
- **Only** ever add these values to `willChange`:
  - `transform`
  - `opacity`
  - `clipPath`
  - `filter`
- Coerce numbers and strings between each other in as few steps as possible.
- Prefer animating `transform` over independent transforms like `x`, `scaleX`
  etc for hardware accelerated animations. Use independent transforms when you
  might have competing/composable transforms:

```javascript
animate(element, { x: 100 });

hover(() => {
  animate(element, { scale: 1.2 });

  return () => animate(element, { scale: 1 });
});
```

- Always use independent transforms when defining any transform via `style` i.e.
  `<motion.div animate={{ x: 100 }} style={{ scale: 2 }} />` and always use
  independent transforms when mixing with layout animations.

## Principles

- Prefer `will-change`/`willChange` over `transform: translateZ(0)`. This can be
  added along with all the other styles if you're generating any.

### Direct manipulation

- Treat brush, eraser, reveal, and scrub footprints as part of the visual design.
  Scale them to the content and input precision; they should expose the exact path
  of the gesture instead of behaving like a broad spotlight.
- Use a readable core with a soft edge. Preserve enough of the underlying visual
  around the stroke that the result still feels tactile and continuous.
- Revealed text must resolve as content, not as a selection artifact. Expose whole
  letterforms through the stroke core and never use native selection highlighting
  as gesture feedback.
- Give transient reveals a brief hold before they regenerate. The user must have
  time to understand what their gesture uncovered before the surface heals.
- A gesture-capture surface must suppress native text selection and touch gestures
  that compete with the interaction. Keep `select-none` and `touch-none` scoped to
  that surface; ordinary content elsewhere must remain selectable and scrollable.
- Pointer, touch, pen, and keyboard paths must reveal the same content and produce
  the same state transition, even when their exact footprint differs.
