import type { Config, Metrics } from "@/lib/system-lab/load-balancing";

const format = (number: number) => number.toLocaleString("en-US");

export function MetricsSummary({ metrics }: { metrics: Metrics | null }) {
  const rows = [
    ["Throughput", metrics ? format(metrics.completed) : "—", "completed/sec"],
    ["Queued", metrics ? format(metrics.queued) : "—", "end of tick"],
    ["Utilization", metrics ? `${Math.round(metrics.utilization * 100)}%` : "—", "online capacity"],
    ["p95 latency", metrics?.p95 == null ? "—" : format(metrics.p95), "ms · completed"],
    ["Dropped", metrics ? format(metrics.dropped) : "—", "this tick"],
  ];

  return (
    <dl className="lab-metrics" aria-label="Latest simulation metrics">
      {rows.map(([label, value, unit]) => <div key={label}><dt>{label}</dt><dd>{value}<span>{unit}</span></dd></div>)}
    </dl>
  );
}

export default function MetricsPanel({ config, metrics, history }: { config: Config; metrics: Metrics | null; history: Metrics[] }) {
  const peak = Math.max(1, ...history.map(item => Math.max(item.incoming, item.completed)));
  const path = history.map((item, index) => `${history.length === 1 ? 1 : index * 300 / (history.length - 1)},${80 - item.completed * 76 / peak}`).join(" ");
  const demand = history.map((item, index) => `${history.length === 1 ? 1 : index * 300 / (history.length - 1)},${80 - item.incoming * 76 / peak}`).join(" ");

  return (
    <div className="lab-telemetry">
      <div className="lab-history">
        <h3>Throughput history</h3>
        <p><span /> Completed <span /> Arrivals · last {history.length} ticks</p>
        <svg viewBox="0 0 300 84" preserveAspectRatio="none" role="img" aria-label={metrics ? `Latest tick: ${format(metrics.completed)} completed, ${format(metrics.incoming)} arrivals. Chart scale reaches ${format(peak)}.` : "No traffic samples yet."}>
          <path d="M0 4H300M0 42H300M0 80H300" />
          <polyline className="lab-demand" points={demand}/>
          <polyline className="lab-completed" points={path}/>
        </svg>
      </div>
      <div className="lab-distribution">
        <h3>Request distribution</h3>
        <p>Share of arrivals admitted by each server in the last tick.</p>
        <ul>
          {config.servers.map(server => {
            const item = metrics?.servers.find(row => row.id === server.id);
            const share = metrics?.incoming ? (item?.admitted ?? 0) / metrics.incoming : 0;
            return <li key={server.id}><span>App {server.id}</span><div aria-hidden="true"><i style={{ width: `${share * 100}%` }} /></div><strong>{format(item?.admitted ?? 0)}</strong></li>;
          })}
        </ul>
      </div>
    </div>
  );
}
