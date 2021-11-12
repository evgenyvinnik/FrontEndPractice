export class TickerEntry {
  ticker: string;
  price: number;
  date: Date;

  constructor(ticker: string, price: number) {
    this.ticker = ticker;
    this.price = price;
    this.date = new Date();
  }
}

export class Cache {
  capacity: number;
  timeToLive: number;
  cache: TickerEntry[] = [];

  constructor(capacity: number, timeToLive: number) {
    this.capacity = capacity;
    this.timeToLive = timeToLive;
  }

  get(key: string) {
    return this.cache[key];
  }

  set(key: string, value: TickerEntry) {
    this.cache[key] = value;
    this.evictionPolicy();
  }

  evictionPolicy(): void {
    this.oldEntryPolicy();
    if (this.cache.length > this.capacity) {
      this.lruPolicy();
    }
  }

  lruPolicy() {
    this.cache = this.cache.sort(
      (tickerA: TickerEntry, tickerB: TickerEntry) =>
        tickerA.date.getUTCSeconds() - tickerB.date.getUTCSeconds()
    );
    this.cache.shift();
  }

  oldEntryPolicy() {
    const now = new Date().getUTCSeconds();
    this.cache = this.cache.filter(
      (ticker: TickerEntry) =>
        now - ticker.date.getUTCSeconds() < this.timeToLive
    );
  }

  has(key: string) {
    this.oldEntryPolicy();
    return key in this.cache;
  }

  delete(key: string | number) {
    delete this.cache[key];
  }
}

export const cache = new Cache(10, 1000);
