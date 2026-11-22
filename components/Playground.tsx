"use client";

import { useEffect, useRef, useState } from "react";
import OsExperiments from "./OsExperiments";
import type { KeyboardEvent, PointerEvent } from "react";

type Point = { x: number; y: number };
const center = { x: 0, y: 0 };

function SpringBench() {
  const stage = useRef<HTMLDivElement>(null);
  const puck = useRef<HTMLButtonElement>(null);
  const position = useRef<Point>(center);
  const target = useRef<Point>(center);
  const velocity = useRef<Point>(center);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function paint(point: Point) {
    position.current = point;
    puck.current?.style.setProperty("transform", `translate3d(${point.x}px,${point.y}px,0)`);
  }

  function spring() {
    frame.current = 0;
    const dx = target.current.x - position.current.x;
    const dy = target.current.y - position.current.y;
    const vx = (velocity.current.x + dx * .15) * .74;
    const vy = (velocity.current.y + dy * .15) * .74;
    if (Math.abs(dx) + Math.abs(dy) + Math.abs(vx) + Math.abs(vy) < .25) {
      velocity.current = center;
      paint(target.current);
      return;
    }
    velocity.current = { x: vx, y: vy };
    paint({ x: position.current.x + vx, y: position.current.y + vy });
    frame.current = requestAnimationFrame(spring);
  }

  function moveTo(point: Point) {
    const bounds = stage.current?.getBoundingClientRect();
    if (!bounds) return;
    const xLimit = Math.max(0, bounds.width / 2 - 56);
    const yLimit = Math.max(0, bounds.height / 2 - 46);
    target.current = {
      x: Math.max(-xLimit, Math.min(xLimit, point.x)),
      y: Math.max(-yLimit, Math.min(yLimit, point.y)),
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      velocity.current = center;
      paint(target.current);
    } else if (!frame.current) {
      frame.current = requestAnimationFrame(spring);
    }
  }

  function start(event: PointerEvent<HTMLButtonElement>) {
    if (pointer.current || event.button !== 0) return;
    pointer.current = { id: event.pointerId, x: event.clientX - position.current.x, y: event.clientY - position.current.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    if (pointer.current?.id !== event.pointerId) return;
    moveTo({ x: event.clientX - pointer.current.x, y: event.clientY - pointer.current.y });
  }

  function release(event: PointerEvent<HTMLDivElement>) {
    if (pointer.current?.id !== event.pointerId) return;
    pointer.current = null;
    moveTo(center);
  }

  function keys(event: KeyboardEvent<HTMLButtonElement>) {
    const offsets: Record<string, Point> = { ArrowLeft: {x:-30,y:0}, ArrowRight: {x:30,y:0}, ArrowUp: {x:0,y:-30}, ArrowDown: {x:0,y:30} };
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    moveTo({ x: target.current.x + offset.x, y: target.current.y + offset.y });
  }

  return (
    <article className="experiment" data-reveal>
      <h3>Spring bench</h3>
      <p id="spring-instructions">Drag the puck and let go. Use arrow keys to move it, and Enter to reset.</p>
      <div className="spring-stage" ref={stage} onPointerMove={drag} onPointerUp={release}
        onPointerCancel={release} onLostPointerCapture={release}>
        <button ref={puck} className="spring-puck" type="button" aria-label="Spring puck" aria-describedby="spring-instructions"
          onPointerDown={start} onKeyDown={keys} onClick={event => { if (event.detail === 0) moveTo(center); }}>↔</button>
      </div>
    </article>
  );
}

function InterfaceBench() {
  const [label, setLabel] = useState("Hello world");
  const [style, setStyle] = useState("solid");
  const [pressed, setPressed] = useState(false);
  const text = label.trim() || "Hello world";

  return (
    <article className="experiment" data-reveal>
      <h3>Code becomes interface</h3>
      <p>Change the props to see the component render live.</p>
      <div className="code-controls">
        <label>label <input value={label} maxLength={28} onChange={event => setLabel(event.target.value)} /></label>
        <label>variant <select value={style} onChange={event => setStyle(event.target.value)}>
          <option value="solid">solid</option><option value="outline">outline</option>
        </select></label>
      </div>
      <pre className="component-code"><code>{`<Button label={${JSON.stringify(text)}}\n        variant="${style}" />`}</code></pre>
      <div className="component-output">
        <button type="button" className={`button ${style === "solid" ? "button-primary" : ""}`} aria-pressed={pressed} onClick={() => setPressed(!pressed)}>{text}</button>
        <span aria-live="polite">{pressed ? "Pressed" : "Ready"}</span>
      </div>
    </article>
  );
}

export default function Playground() {
  return (
    <section id="playground" className="frame section" aria-labelledby="playground-title">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">Interactive experiments</p>
        <h2 id="playground-title">The Playground<span>.</span></h2>
      </div>
      <div className="experiment-grid"><SpringBench /><InterfaceBench /></div>
      <details className="os-lab">
        <summary>Open the debugging lab</summary>
        <OsExperiments />
      </details>
    </section>
  );
}
