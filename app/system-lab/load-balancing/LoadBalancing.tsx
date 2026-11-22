"use client";

import { useEffect, useReducer, useState } from "react";
import { CHALLENGES, ROUTING, TARGET_TICKS, advanceChallenge, defaultConfig, initialSimulation, makeServer, step } from "@/lib/system-lab/load-balancing";
import type { Challenge, Config, Metrics, Routing, Server, Simulation } from "@/lib/system-lab/load-balancing";
import Architecture from "./Architecture";
import MetricsPanel, { MetricsSummary } from "./MetricsPanel";
import { markProgress } from "../Progress";

type Node = "client" | "balancer" | number;
type State = { config: Config; simulation: Simulation; history: Metrics[]; challenge: Challenge | ""; streak: number; note: string };
type Action =
  | { type: "tick" }
  | { type: "config"; config: Config }
  | { type: "challenge"; challenge: State["challenge"] }
  | { type: "reset"; config?: Config };

function start(config = defaultConfig()): State {
  return { config, simulation: initialSimulation(), history: [], challenge: "", streak: 0, note: "" };
}

function reducer(state: State, action: Action): State {
  if (action.type === "reset") return start(action.config);
  if (action.type === "config") return { ...state, config: action.config };
  if (action.type === "challenge") return { ...state, challenge: action.challenge, streak: 0, note: "" };

  const simulation = step(state.simulation, state.config);
  const metrics = simulation.metrics;
  const unchanged = { ...state, simulation, history: [...state.history.slice(-29), metrics] };
  if (!state.challenge) return unchanged;
  return { ...unchanged, ...advanceChallenge(state.challenge, state.streak, metrics) };
}

function NumberField({ label, value, min, max, increment, onChange }: {
  label: string; value: number; min: number; max: number; increment: number; onChange: (value: number) => void;
}) {
  return <label className="lab-range"><span>{label}<output>{value.toLocaleString("en-US")}</output></span>
    <input type="range" aria-label={label} min={min} max={max} step={increment} value={value} onChange={event => onChange(Number(event.target.value))} />
  </label>;
}

export default function LoadBalancing() {
  const [state, dispatch] = useReducer(reducer, undefined, () => start());
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState<Node>("balancer");
  const { config, simulation, history, challenge, streak, note } = state;
  const metrics = simulation.metrics;
  const selectedServer = config.servers.find(server => server.id === selected);
  const serverMetrics = metrics?.servers.find(server => server.id === selected);

  useEffect(() => { markProgress("launched"); }, []);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (challenge && streak === TARGET_TICKS) markProgress(challenge);
  }, [challenge, streak]);

  function configure(values: Partial<Config>) {
    dispatch({ type: "config", config: { ...config, ...values } });
  }

  function changeServer(values: Partial<Server>) {
    configure({ servers: config.servers.map(server => server.id === selected ? { ...server, ...values } : server) });
  }

  function resizeFleet(count: number) {
    const servers = Array.from({ length: count }, (_, index) => config.servers[index] ?? makeServer(index + 1));
    if (typeof selected === "number" && selected > count) setSelected("balancer");
    configure({ servers });
  }

  function reset(overloaded = false) {
    setRunning(false);
    setSelected("balancer");
    dispatch({ type: "reset", config: overloaded ? { ...defaultConfig(), incoming: 15000, servers: [makeServer(1), makeServer(2)] } : undefined });
  }

  return (
    <>
      <section className="lab-workspace" aria-labelledby="workspace-title">
        <header className="lab-toolbar">
          <div><h2 id="workspace-title">Simulation workspace</h2><p>{running ? "Running" : "Paused"} · Tick {simulation.tick}</p></div>
          <div className="lab-actions">
            <button className="button button-primary" type="button" onClick={() => setRunning(!running)}>{running ? "Pause" : "Run simulation"}</button>
            <button className="os-control" type="button" onClick={() => dispatch({ type: "tick" })} disabled={running}>Step 1 second</button>
            <button className="os-control" type="button" onClick={() => reset()}>Reset experiment</button>
          </div>
        </header>
        <MetricsSummary metrics={metrics} />
        <div className="lab-workbench">
          <div className="lab-diagram">
            <h3>Architecture</h3>
            <p>Select a node to inspect it. Packet motion samples admitted traffic.</p>
            <Architecture config={config} metrics={metrics} selected={selected} onSelect={setSelected} running={running} />
          </div>
          <div className="lab-controls">
            <h3>Traffic controls</h3>
            <NumberField label="Incoming requests/sec" value={config.incoming} min={0} max={15000} increment={100} onChange={incoming => configure({ incoming })} />
            <NumberField label="Server count" value={config.servers.length} min={1} max={6} increment={1} onChange={resizeFleet} />
            <label className="lab-select">Routing strategy
              <select value={config.routing} onChange={event => configure({ routing: event.target.value as Routing })}>
                {Object.entries(ROUTING).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            <button className="os-control" type="button" onClick={() => reset(true)}>Load overload preset</button>
            <div className="lab-inspector">
              <h3>{selectedServer ? `Inspect App ${selectedServer.id}` : selected === "client" ? "Inspect client" : "Inspect load balancer"}</h3>
              {selectedServer ? <>
                <p>{selectedServer.online ? "Online" : "Offline"} · {serverMetrics?.completed.toLocaleString("en-US") ?? "0"} completed last tick</p>
                <NumberField label="Capacity (requests/sec)" value={selectedServer.capacity} min={500} max={6000} increment={100} onChange={capacity => changeServer({ capacity })} />
                <NumberField label="Added latency (ms)" value={selectedServer.latency} min={0} max={500} increment={5} onChange={latency => changeServer({ latency })} />
                {config.routing === "weighted" && <NumberField label="Routing weight" value={selectedServer.weight} min={1} max={8} increment={1} onChange={weight => changeServer({ weight })} />}
                <button type="button" className="os-control" onClick={() => changeServer({ online: !selectedServer.online })}>{selectedServer.online ? "Disable server" : "Restore server"}</button>
              </> : <p>{selected === "client" ? "The client sends a fixed number of requests each tick." : "The balancer routes new requests to online servers. Select an application node to tune capacity, delay, or availability."}</p>}
            </div>
          </div>
        </div>
        <MetricsPanel config={config} metrics={metrics} history={history} />
      </section>

      <div className="lab-notes">
        <section className="lab-challenge" aria-labelledby="challenge-title">
          <h2 id="challenge-title">Engineering challenges</h2>
          <label className="lab-select">Select a challenge
            <select value={challenge} onChange={event => dispatch({ type: "challenge", challenge: event.target.value as State["challenge"] })}>
              <option value="">Free exploration</option>
              {Object.entries(CHALLENGES).map(([id, item]) => <option key={id} value={id}>{item.title}</option>)}
            </select>
          </label>
          {challenge && <div>
            <p>{CHALLENGES[challenge].description}</p>
            <progress aria-label="Consecutive qualifying ticks" max={TARGET_TICKS} value={streak} />
            <p role="status">{streak === TARGET_TICKS ? "Challenge cleared. The last five measured ticks met the target." : note || `${streak}/${TARGET_TICKS} qualifying ticks. Run or step the simulation to check the target.`}</p>
          </div>}
        </section>
        <section className="lab-assumptions" aria-labelledby="assumptions-title">
          <h2 id="assumptions-title">Model assumptions</h2>
          <details open><summary>Capacity, queueing, and latency</summary>
            <p>Each step represents one second. Arrivals route first, then each online server serves up to its capacity from its FIFO queue. Admission is capped at twice capacity, including requests served that tick.</p>
            <p>Completed requests have 35 ms of base latency, plus injected delay and 1,000 ms for every full tick they waited. Added delay changes reported latency without reducing capacity. p95 is calculated across that tick’s completions.</p>
          </details>
          <details><summary>Routing and failures</summary>
            <p>Round Robin rotates through online servers. Least Connections routes to the server with the fewest outstanding requests and breaks ties by server order. Smooth Weighted Round Robin rations requests by the configured integer weights.</p>
            <p>There is one routing attempt. A full destination drops the request without retry. Disabling or removing a server discards its queued requests on the next tick. Lowering capacity discards newest queued work above the new limit.</p>
          </details>
        </section>
      </div>
    </>
  );
}
