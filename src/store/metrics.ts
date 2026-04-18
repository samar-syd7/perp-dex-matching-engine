interface Metrics {
  totalOrders: number;
  totalLatencyMs: number;
  lastLatencyMs: number;
  tradesCount: number;
}

class MetricsStore {
  private metrics: Metrics = {
    totalOrders: 0,
    totalLatencyMs: 0,
    lastLatencyMs: 0,
    tradesCount: 0,
  };

  recordOrder(latencyMs: number) {
    this.metrics.totalOrders += 1;
    this.metrics.totalLatencyMs += latencyMs;
    this.metrics.lastLatencyMs = latencyMs;
  }

  recordTrade() {
    this.metrics.tradesCount += 1;
  }

  getMetrics() {
    const avgLatency =
      this.metrics.totalOrders === 0
        ? 0
        : this.metrics.totalLatencyMs / this.metrics.totalOrders;

    return {
      ...this.metrics,
      avgLatencyMs: avgLatency,
    };
  }
}

export const metricsStore = new MetricsStore();