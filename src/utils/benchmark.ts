export function nowNs(): bigint {
  return process.hrtime.bigint();
}

export function durationMs(start: bigint, end: bigint): number {
  return Number(end - start) / 1e6;
}