import { Trade } from "../types";

export class TradeStore {
  private trades: Trade[] = [];

  addTrade(trade: Trade) {
    this.trades.push(trade);
  }

  getTrades() {
    return this.trades;
  }
}

export const tradeStore = new TradeStore();