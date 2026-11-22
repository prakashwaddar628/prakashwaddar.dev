export const experiments = [
  { number: "001", title: "Load Balancing", difficulty: "Foundations", description: "Route traffic, saturate a fleet, and see what changes when an application server fails.", concepts: ["Routing", "Queueing", "Tail latency"], nodes: ["Client", "Balancer", "App fleet"], href: "/system-lab/load-balancing" },
  { number: "002", title: "Redis Caching", difficulty: "Foundations", description: "Explore cache-aside reads and the trade-offs between freshness and database load.", concepts: ["Cache hits", "TTL", "Eviction"], nodes: ["API", "Cache", "Database"] },
  { number: "003", title: "Event-Driven Architecture", difficulty: "Intermediate", description: "Follow an event through a topic and observe when consumers fall behind.", concepts: ["Partitions", "Backpressure", "Consumer lag"], nodes: ["Producer", "Topic", "Consumers"] },
  { number: "004", title: "Database Scaling", difficulty: "Intermediate", description: "Compare a single database, read replicas, and sharding.", concepts: ["Replication", "Read routing", "Hot partitions"], nodes: ["Client", "Router", "Data nodes"] },
  { number: "005", title: "Chaos Engineering", difficulty: "Advanced", description: "Explore how timeouts, retries, and circuit breakers change failure behavior.", concepts: ["Fault injection", "Retries", "Recovery"], nodes: ["Client", "Gateway", "Services"] },
] as const;
