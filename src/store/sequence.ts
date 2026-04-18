class Sequence {
  private current = 0;

  next(): number {
    this.current += 1;
    return this.current;
  }

  get(): number {
    return this.current;
  }
}

export const sequence = new Sequence();