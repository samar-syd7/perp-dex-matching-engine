import { EventEmitter } from "events";
import { Trade, Order } from "../types";

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
export function emitOrderBook(bids: Order[], asks: Order[]) {
  eventBus.emit("orderbook", { bids, asks });
}