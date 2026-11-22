export const ROUTING = {
  roundRobin: "Round Robin",
  leastConnections: "Least Connections",
  weighted: "Weighted Round Robin",
};

export type Routing = keyof typeof ROUTING;
export type Server = { id: number; capacity: number; weight: number; latency: number; online: boolean };
export type Config = { incoming: number; routing: Routing; servers: Server[] };
type Cohort = { at: number; count: number };
export type ServerMetrics = {
  id: number; online: boolean; admitted: number; completed: number; queued: number; utilization: number; dropped: number;
};
export type Metrics = {
  tick: number; incoming: number; completed: number; queued: number; dropped: number; utilization: number;
  p95: number | null; servers: ServerMetrics[];
};
export type Simulation = {
  tick: number; cursor: number; credits: Record<number, number>; queues: Record<number, Cohort[]>;
  routingKey: string; metrics: Metrics | null;
};

export function makeServer(id: number): Server {
  return { id, capacity: 4000, weight: 1, latency: 0, online: true };
}

export function defaultConfig(): Config {
  return { incoming: 6500, routing: "roundRobin", servers: [makeServer(1), makeServer(2), makeServer(3)] };
}

export function initialSimulation(): Simulation {
  return { tick: 0, cursor: 0, credits: {}, queues: {}, routingKey: "", metrics: null };
}

function percentile(histogram: Map<number, number>, count: number) {
  if (!count) return null;
  const rank = Math.ceil(count * .95);
  let seen = 0;
  for (const [latency, frequency] of [...histogram].sort(([a], [b]) => a - b)) {
    seen += frequency;
    if (seen >= rank) return latency;
  }
  return null;
}

export function step(previous: Simulation, config: Config): Simulation & { metrics: Metrics } {
  const tick = previous.tick + 1;
  const active = config.servers.filter(server => server.online);
  const routingKey = config.routing + ":" + active.map(server => `${server.id}/${server.weight}`).join(",");
  const sameRouting = routingKey === previous.routingKey;
  let cursor = sameRouting ? previous.cursor : 0;
  const credits = sameRouting ? { ...previous.credits } : {};
  const queues: Simulation["queues"] = {};
  const work = config.servers.map(server => {
    const queue = (previous.queues[server.id] ?? []).map(cohort => ({ ...cohort }));
    let pending = queue.reduce((total, cohort) => total + cohort.count, 0);
    const dropped = Math.max(0, pending - (server.online ? server.capacity * 2 : 0));
    let discard = dropped;
    while (discard > 0) {
      const tail = queue[queue.length - 1];
      const count = Math.min(tail.count, discard);
      tail.count -= count;
      discard -= count;
      if (!tail.count) queue.pop();
    }
    pending -= dropped;
    queues[server.id] = queue;
    return { server, queue, pending, admitted: 0, completed: 0, dropped };
  });
  const online = work.filter(item => item.server.online);
  const weightTotal = active.reduce((total, server) => total + server.weight, 0);
  const incoming = config.incoming;
  const removed = Object.entries(previous.queues).reduce((total, [id, queue]) =>
    config.servers.some(server => server.id === Number(id)) ? total : total + queue.reduce((sum, cohort) => sum + cohort.count, 0), 0);
  const unrouted = online.length ? 0 : incoming;

  for (let request = 0; request < incoming - unrouted; request++) {
    let chosen = online[0];
    if (config.routing === "roundRobin") {
      chosen = online[cursor];
      cursor = (cursor + 1) % online.length;
    } else if (config.routing === "leastConnections") {
      for (const candidate of online) {
        if (candidate.pending < chosen.pending) chosen = candidate;
      }
    } else {
      for (const { server } of online) credits[server.id] = (credits[server.id] ?? 0) + server.weight;
      for (const candidate of online) {
        if (credits[candidate.server.id] > credits[chosen.server.id]) chosen = candidate;
      }
      credits[chosen.server.id] -= weightTotal;
    }
    if (chosen.pending >= chosen.server.capacity * 2) {
      chosen.dropped++;
      continue;
    }
    chosen.pending++;
    chosen.admitted++;
  }

  const histogram = new Map<number, number>();
  const servers = work.map(item => {
    const { server, queue } = item;
    if (item.admitted) queue.push({ at: tick, count: item.admitted });
    let remaining = server.online ? server.capacity : 0;
    while (remaining && queue.length) {
      const head = queue[0];
      const served = Math.min(remaining, head.count);
      const latency = 35 + server.latency + (tick - head.at) * 1000;
      histogram.set(latency, (histogram.get(latency) ?? 0) + served);
      head.count -= served;
      remaining -= served;
      item.completed += served;
      if (!head.count) queue.shift();
    }
    return {
      id: server.id, online: server.online, admitted: item.admitted, completed: item.completed,
      queued: item.pending - item.completed, dropped: item.dropped, utilization: server.online ? item.completed / server.capacity : 0,
    };
  });
  const sum = (field: "completed" | "queued" | "dropped") => servers.reduce((total, server) => total + server[field], 0);
  const completed = sum("completed");
  const capacity = active.reduce((total, server) => total + server.capacity, 0);
  return { tick, cursor, credits, queues, routingKey, metrics: {
    tick, incoming, completed, queued: sum("queued"), dropped: sum("dropped") + unrouted + removed,
    p95: percentile(histogram, completed), utilization: capacity ? completed / capacity : 0, servers,
  } };
}

export const CHALLENGES = {
  throughput: { title: "Handle 10,000 requests/sec", description: "Complete at least 10,000 requests each tick with zero drops for five consecutive ticks." },
  latency: { title: "Keep p95 below 150 ms", description: "With at least 6,000 incoming requests/sec, finish each tick below 150 ms with zero drops for five consecutive ticks." },
  failure: { title: "Survive a server failure", description: "Keep one configured server offline and complete all incoming traffic (at least 6,000/sec) with an empty queue and zero drops for five consecutive ticks." },
};
export type Challenge = keyof typeof CHALLENGES;
export const TARGET_TICKS = 5;

export function evaluateChallenge(challenge: Challenge, metrics: Metrics): string | null {
  if (metrics.dropped) return "Requests were dropped. Add headroom or redistribute traffic.";
  if (challenge === "throughput" && metrics.completed < 10000) return "Throughput is below 10,000 completed requests/sec.";
  if (challenge === "latency") {
    if (metrics.incoming < 6000) return "Raise incoming traffic to at least 6,000 requests/sec.";
    if (metrics.p95 === null || metrics.p95 >= 150) return "p95 must be below 150 ms. Check queueing and injected delay.";
  }
  if (challenge === "failure") {
    if (metrics.servers.filter(server => !server.online).length !== 1) return "Set exactly one configured server offline.";
    if (metrics.incoming < 6000) return "Raise incoming traffic to at least 6,000 requests/sec.";
    if (metrics.completed < metrics.incoming || metrics.queued) return "The remaining fleet must complete all arrivals without a backlog.";
  }
  return null;
}

export function advanceChallenge(challenge: Challenge, streak: number, metrics: Metrics) {
  if (streak >= TARGET_TICKS) return { streak: TARGET_TICKS, note: "" };
  const note = evaluateChallenge(challenge, metrics);
  return { streak: note ? 0 : streak + 1, note: note ?? "" };
}
