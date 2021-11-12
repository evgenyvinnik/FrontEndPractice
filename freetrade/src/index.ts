/*
River Phillips to Everyone (7:09 AM)
1. *Your code must have a single entry point, allowing us to fetch the price of a stock. For example:*
    
    ```tsx
    getStockPrice('TSLA')
    // 442.25
    ```
    
2. *Users must not be able to decide whether or not they receive a cached value.*
3. *We only want to call the third party once for each stock (except in other cache modes, see below.)*
4. *The cache should also be configurable into different modes:*
    - Limited capacity - the cache should hold a limited number of items, and evict entries when it is full.
    - Limited time - the cache should store entries for a limited amount of time. If the entry has expired, it should retrieve a fresh value.
*/

import { cache, TickerEntry } from "./cache";

export const getStockPrice = (symbol: string): number => {
  if (cache.has(symbol)) {
    return cache.get(symbol).price;
  } else {
    const price = getStockPriceFromThirdParty(symbol);
    cache.set(symbol, new TickerEntry(symbol, price));
    return price;
  }
};

function getStockPriceFromThirdParty(_symbol: string): number {
  return Math.random() * 1000;
  // axios
  //   .get(`https://api.iextrading.com/1.0/stock/${symbol}/price`)
  //   .then((response) => response.data)
  //   .catch((err) => {
  //     console.log(err);
  //   });
}
