import assert from "node:assert/strict";
import { test } from "node:test";
import {
  advanceChallenge, defaultConfig, evaluateChallenge, initialSimulation, makeServer, step,
} from "./load-balancing.ts";

const server = (id, values = {}) => ({ ...makeServer(id), capacity: 10, ...values });
const run = (config, ticks = 1) => {
  let state = initialSimulation();
  for (let i = 0; i < ticks; i++) state = step(state, config);
  return state;
};
const admits = state => state.metrics.servers.map(item => item.admitted);

test("round robin gives each server turns across ticks", () => {
  const config = { incoming: 4, routing: "roundRobin", servers: [server(1), server(2), server(3)] };
  const first = run(config);
  assert.deepEqual(admits(first), [2, 1, 1]);
  const second = step(first, config);
  assert.deepEqual(admits(second), [1, 2, 1]);
  assert.deepEqual(admits(step(second, config)), [1, 1, 2]);
});

test("weighted round robin follows integer weights and keeps tie-breaking deterministic", () => {
  const config = { incoming: 12, routing: "weighted", servers: [server(1, { weight: 3 }), server(2), server(3, { weight: 2 })] };
  assert.deepEqual(admits(run(config)), [6, 2, 4]);
  assert.deepEqual(run(config, 30), run(config, 30));
});

test("least connections prefers a server with less outstanding work", () => {
  const config = { incoming: 12, routing: "leastConnections", servers: [server(1, { capacity: 2 }), server(2)] };
  const first = run(config);
  const second = step(first, { ...config, incoming: 2 });
  assert.equal(first.metrics.servers[0].queued, 2);
  assert.deepEqual(admits(second), [0, 2]);
});

test("capacity, finite queues, drops, and FIFO latency agree under overload", () => {
  const config = { incoming: 16, routing: "roundRobin", servers: [server(1)] };
  const first = run(config);
  const second = step(first, config);
  assert.deepEqual([first.metrics.completed, first.metrics.queued, first.metrics.dropped, first.metrics.p95], [10, 6, 0, 35]);
  assert.deepEqual([second.metrics.completed, second.metrics.queued, second.metrics.dropped, second.metrics.p95], [10, 10, 2, 1035]);
  assert.equal(second.metrics.utilization, 1);
  assert.equal(16 + first.metrics.queued, second.metrics.completed + second.metrics.queued + second.metrics.dropped);
});

test("disabled and removed servers discard old queues and receive no new work", () => {
  const config = { incoming: 32, routing: "roundRobin", servers: [server(1), server(2)] };
  const loaded = run(config);
  const disabled = step(loaded, { ...config, incoming: 6, servers: [server(1, { online: false }), server(2)] });
  assert.deepEqual(admits(disabled), [0, 6]);
  assert.equal(disabled.metrics.dropped, 6);
  const removed = step(loaded, { ...config, incoming: 6, servers: [server(2)] });
  assert.equal(removed.metrics.dropped, 6);
  const down = step(loaded, { ...config, servers: config.servers.map(item => ({ ...item, online: false })) });
  assert.equal(down.metrics.dropped, 44);
  assert.equal(down.metrics.p95, null);
  assert.equal(step(disabled, { ...config, incoming: 6 }).metrics.servers[0].admitted, 3);
});

test("injected latency affects weighted p95 without changing capacity", () => {
  const config = { incoming: 10, routing: "roundRobin", servers: [server(1), server(2, { latency: 200 })] };
  const state = run(config);
  assert.equal(state.metrics.p95, 235);
  assert.equal(state.metrics.completed, 10);
});

test("challenge evaluation requires measured conditions and resets a failing streak", () => {
  const good = run({ ...defaultConfig(), incoming: 10000 }).metrics;
  const low = run({ ...defaultConfig(), incoming: 3000 }).metrics;
  let streak = 0;
  for (let tick = 0; tick < 4; tick++) streak = advanceChallenge("throughput", streak, good).streak;
  assert.equal(streak, 4);
  assert.deepEqual(advanceChallenge("throughput", streak, good), { streak: 5, note: "" });
  assert.equal(advanceChallenge("throughput", streak, low).streak, 0);
  assert.equal(evaluateChallenge("latency", good), null);
  assert.match(evaluateChallenge("latency", { ...good, p95: 200 }), /below 150/);
  assert.match(evaluateChallenge("failure", good), /exactly one/);
  const failure = defaultConfig();
  failure.servers[0].online = false;
  assert.equal(evaluateChallenge("failure", run(failure).metrics), null);
});
