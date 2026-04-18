import { EventEmitter } from "events";
import { Trade, Order, OrderBookSnapshot } from "../types";

class EventBus extends EventEmitter {}

export const eventBus = new EventBus();

/**
 * Emit trade event
 */
export function emitTrade(trade: Trade) {
  eventBus.emit("trade", trade);
}

/**
 * Emit orderbook update
 */
export function emitOrderBook(snapshot: any) {
  eventBus.emit("orderbook", snapshot);
}