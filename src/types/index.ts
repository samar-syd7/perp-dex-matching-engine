export type OrderSide = "buy" | "sell";

/**
 * Core order model
 * - remaining is critical for partial fills
 */
export interface Order {
  id: string;
  side: OrderSide;
  price: number;
  quantity: number;
  remaining: number;
  timestamp: number;
}

/**
 * Trade = execution event
 */
export interface Trade {
  price: number;
  quantity: number;
  buyOrderId: string;
  sellOrderId: string;
  timestamp: number;
}