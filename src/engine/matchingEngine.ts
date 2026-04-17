import { Order, Trade } from "../types";
import { OrderBook } from "../orderbook/orderBook";
import { tradeStore } from "../store/tradeStore";

/**
 * MatchingEngine:
 * - deterministic
 * - single-threaded safe
 * - enforces price-time priority
 */
export class MatchingEngine {
  private processedOrders = new Set<string>(); // idempotency

  constructor(private orderBook: OrderBook) {}

  processOrder(order: Order) {
    /**
     * Idempotency:
     * Prevent duplicate processing of same order ID
     */
    if (this.processedOrders.has(order.id)) {
      return;
    }
    this.processedOrders.add(order.id);

    if (order.side === "buy") {
      this.matchBuy(order);
    } else {
      this.matchSell(order);
    }

    /**
     * If not fully filled → rest on book
     */
    if (order.remaining > 0) {
      this.orderBook.addOrder(order);
    }
  }

  /**
   * BUY matches against ASKS
   */
  private matchBuy(order: Order) {
    while (
      order.remaining > 0 &&
      this.orderBook.asks.length > 0
    ) {
      const bestAsk = this.orderBook.getBestAsk();
      if (!bestAsk) break;

      /**
       * Price condition
       */
      if (bestAsk.price > order.price) break;

      const tradeQty = Math.min(order.remaining, bestAsk.remaining);

      this.executeTrade(
        order,       // buyer
        bestAsk,     // seller
        tradeQty,
        bestAsk.price // maker price
      );

      /**
       * Remove fully filled resting order
       */
      if (bestAsk.remaining === 0) {
        this.orderBook.removeOrder(bestAsk);
      }
    }
  }

  /**
   * SELL matches against BIDS
   */
  private matchSell(order: Order) {
    while (
      order.remaining > 0 &&
      this.orderBook.bids.length > 0
    ) {
      const bestBid = this.orderBook.getBestBid();
      if (!bestBid) break;

      /**
       * Price condition
       */
      if (bestBid.price < order.price) break;

      const tradeQty = Math.min(order.remaining, bestBid.remaining);

      this.executeTrade(
        bestBid,    // buyer
        order,      // seller
        tradeQty,
        bestBid.price // maker price
      );

      if (bestBid.remaining === 0) {
        this.orderBook.removeOrder(bestBid);
      }
    }
  }

  /**
   * Trade execution:
   * - updates remaining quantities
   * - records trade
   */
  private executeTrade(
    buyOrder: Order,
    sellOrder: Order,
    quantity: number,
    price: number
  ) {
    buyOrder.remaining -= quantity;
    sellOrder.remaining -= quantity;

    const trade: Trade = {
      price,
      quantity,
      buyOrderId: buyOrder.id,
      sellOrderId: sellOrder.id,
      timestamp: Date.now(),
    };

    tradeStore.addTrade(trade);
  }
}