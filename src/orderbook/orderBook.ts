import { Order } from "../types";

/**
 * OrderBook responsibilities:
 * - Maintain sorted bids & asks
 * - Enforce price-time priority
 * - Provide best bid/ask access
 */
export class OrderBook {
  public bids: Order[] = [];
  public asks: Order[] = [];

  /**
   * Insert order into correct side
   * Sorting enforces:
   *  - price priority
   *  - time priority (FIFO within price)
   */
  addOrder(order: Order) {
    if (order.side === "buy") {
      this.bids.push(order);

      // Highest price first, then earliest timestamp
      this.bids.sort((a, b) => {
        if (b.price !== a.price) return b.price - a.price;
        return a.timestamp - b.timestamp;
      });

    } else {
      this.asks.push(order);

      // Lowest price first, then earliest timestamp
      this.asks.sort((a, b) => {
        if (a.price !== b.price) return a.price - b.price;
        return a.timestamp - b.timestamp;
      });
    }
  }

  /**
   * Remove fully filled order
   */
  removeOrder(order: Order) {
    const book = order.side === "buy" ? this.bids : this.asks;

    const index = book.findIndex(o => o.id === order.id);
    if (index !== -1) {
      book.splice(index, 1);
    }
  }

  /**
   * Best prices (top of book)
   */
  getBestBid(): Order | undefined {
    return this.bids[0];
  }

  getBestAsk(): Order | undefined {
    return this.asks[0];
  }
}