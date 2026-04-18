export class OrderQueue<T extends { id: string }> {
  private items: T[] = [];

  enqueue(item: T) {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  getAll(): T[] {
    return this.items;
  }

  /**
   * Remove specific order (for cancel)
   * O(n) — acceptable for MVP
   */
  removeById(id: string): boolean {
    const index = this.items.findIndex(o => o.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}