import { Order } from "../types";
import { OrderQueue } from "./queue";
import { sequence } from "../store/sequence";

/**
 * High-performance OrderBook
 * - price levels (Map)
 * - FIFO queues per price
 */
export class OrderBook {
  public bids = new Map<number, OrderQueue<Order>>();
  public asks = new Map<number, OrderQueue<Order>>();

  public bidPrices: number[] = [];
  public askPrices: number[] = [];

  /**
   * Insert order into price level
   */
  addOrder(order: Order) {
    const book = order.side === "buy" ? this.bids : this.asks;
    const priceList = order.side === "buy" ? this.bidPrices : this.askPrices;

    if (!book.has(order.price)) {
      book.set(order.price, new OrderQueue());

      // insert price into sorted list
      priceList.push(order.price);

      if (order.side === "buy") {
        priceList.sort((a, b) => b - a); // DESC
      } else {
        priceList.sort((a, b) => a - b); // ASC
      }
    }

    book.get(order.price)!.enqueue(order);
  }

  /**
   * Get best bid
   */
  getBestBid(): Order | undefined {
    if (this.bidPrices.length === 0) return undefined;
    const bestPrice = this.bidPrices[0];
    return this.bids.get(bestPrice)?.peek();
  }

  /**
   * Get best ask
   */
  getBestAsk(): Order | undefined {
    if (this.askPrices.length === 0) return undefined;
    const bestPrice = this.askPrices[0];
    return this.asks.get(bestPrice)?.peek();
  }

  /**
   * Remove fully filled order
   */
  removeOrder(order: Order) {
    const book = order.side === "buy" ? this.bids : this.asks;
    const priceList = order.side === "buy" ? this.bidPrices : this.askPrices;

    const queue = book.get(order.price);
    if (!queue) return;

    queue.dequeue(); // FIFO removal

    if (queue.isEmpty()) {
      book.delete(order.price);

      const index = priceList.indexOf(order.price);
      if (index !== -1) priceList.splice(index, 1);
    }
  }

  /**
   * Cancel order by ID
   */
  cancelOrder(orderId: string): boolean {
    // search bids
    for (const price of this.bidPrices) {
      const queue = this.bids.get(price)!;
      const removed = queue.removeById(orderId);

      if (removed) {
        if (queue.isEmpty()) {
          this.bids.delete(price);
          this.bidPrices = this.bidPrices.filter(p => p !== price);
        }
        return true;
      }
    }

    // search asks
    for (const price of this.askPrices) {
      const queue = this.asks.get(price)!;
      const removed = queue.removeById(orderId);

      if (removed) {
        if (queue.isEmpty()) {
          this.asks.delete(price);
          this.askPrices = this.askPrices.filter(p => p !== price);
        }
        return true;
      }
    }

    return false;
  }

  /**
   * Flatten orderbook (for API)
   */
  getSnapshot() {
    const bids: Order[] = [];
    const asks: Order[] = [];

    for (const price of this.bidPrices) {
      bids.push(...this.bids.get(price)!.getAll());
    }

    for (const price of this.askPrices) {
      asks.push(...this.asks.get(price)!.getAll());
    }

    return {
      sequenceId: sequence.next(), // NEW
      bids,
      asks,
    };
  }
}