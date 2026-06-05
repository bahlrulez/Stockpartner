const INITIAL_STOCKS = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries Ltd.", price: 1303.70, change: -9.50, changePercent: -0.72, volume: 23455147, marketCap: 17642280000000, sector: "Energy" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services Ltd.", price: 2241.00, change: -0.70, changePercent: -0.03, volume: 4865423, marketCap: 8108130000000, sector: "Technology" }
];

class StockCacheTest {
  constructor() {
    this.stocks = INITIAL_STOCKS.map(s => ({
      ...s,
      high: s.price,
      low: s.price,
      open: s.price,
      previousClose: s.price,
      apiSource: "SIMULATED"
    }));
    this.indices = {
      NIFTY: { symbol: "^NSEI", name: "NIFTY 50", price: 0, change: 0, changePercent: 0, history: [], apiSource: "SIMULATED" },
      SENSEX: { symbol: "^BSESN", name: "BSE SENSEX", price: 0, change: 0, changePercent: 0, history: [], apiSource: "SIMULATED" }
    };
  }

  async fetchLiveQuotes() {
    const stockUrl = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${this.stocks.map(s => s.symbol).join(",")}&range=2d&interval=1d`;
    const indexUrl = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=^NSEI,^BSESN&range=1d&interval=5m`;
    
    try {
      const [stockRes, indexRes] = await Promise.all([
        fetch(stockUrl, { headers: { "User-Agent": "Mozilla/5.0" } }),
        fetch(indexUrl, { headers: { "User-Agent": "Mozilla/5.0" } })
      ]);
      const stockData = await stockRes.json();
      const indexData = await indexRes.json();

      if (stockData.spark && stockData.spark.result) {
        const resultsMap = new Map();
        for (const item of stockData.spark.result) {
          if (item.response && item.response[0]) {
            const meta = item.response[0].meta;
            const closes = item.response[0].indicators?.quote?.[0]?.close || [];
            
            const price = meta.regularMarketPrice ?? closes[closes.length - 1] ?? 0;
            const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? closes[0] ?? price;
            const change = price - prevClose;
            const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;
            
            resultsMap.set(item.symbol, {
              price: Number(price.toFixed(2)),
              change: Number(change.toFixed(2)),
              changePercent: Number(changePercent.toFixed(2)),
              volume: meta.regularMarketVolume ?? 0,
              high: meta.regularMarketDayHigh ?? price,
              low: meta.regularMarketDayLow ?? price,
              open: closes[0] ?? prevClose,
              previousClose: Number(prevClose.toFixed(2))
            });
          }
        }
        
        this.stocks = this.stocks.map(stock => {
          const live = resultsMap.get(stock.symbol);
          if (live) {
            return {
              ...stock,
              ...live,
              apiSource: "LIVE"
            };
          }
          return stock;
        });
      }

      if (indexData.spark && indexData.spark.result) {
        for (const item of indexData.spark.result) {
          if (item.response && item.response[0]) {
            const meta = item.response[0].meta;
            const closes = item.response[0].indicators?.quote?.[0]?.close || [];
            
            const price = meta.regularMarketPrice ?? closes[closes.length - 1] ?? 0;
            const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
            const change = price - prevClose;
            const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;
            const history = closes.filter(p => p !== null && p !== undefined).map(p => Number(p.toFixed(2)));
            
            const key = item.symbol === "^NSEI" ? "NIFTY" : item.symbol === "^BSESN" ? "SENSEX" : null;
            if (key) {
              this.indices[key] = {
                symbol: item.symbol,
                name: key === "NIFTY" ? "NIFTY 50" : "BSE SENSEX",
                price: Number(price.toFixed(2)),
                change: Number(change.toFixed(2)),
                changePercent: Number(changePercent.toFixed(2)),
                history: history,
                apiSource: "LIVE"
              };
            }
          }
        }
      }
      console.log("Quotes Fetch Successful!");
    } catch (err) {
      console.error("Quotes Fetch Failed:", err);
    }
  }

  async getStockDetail(symbol) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const data = await res.json();
      
      if (data.chart && data.chart.result && data.chart.result[0]) {
        const result = data.chart.result[0];
        const meta = result.meta;
        const timestamps = result.timestamp || [];
        const quote = result.indicators.quote[0];
        
        const history = [];
        for (let i = 0; i < timestamps.length; i++) {
          if (quote.close[i] === null || quote.close[i] === undefined) continue;
          history.push({
            date: new Date(timestamps[i] * 1000).toISOString().split("T")[0],
            open: Number((quote.open[i] ?? quote.close[i]).toFixed(2)),
            high: Number((quote.high[i] ?? quote.close[i]).toFixed(2)),
            low: Number((quote.low[i] ?? quote.close[i]).toFixed(2)),
            close: Number(quote.close[i].toFixed(2)),
            volume: Math.floor(quote.volume[i] ?? 0)
          });
        }
        
        const price = meta.regularMarketPrice ?? history[history.length - 1]?.close ?? 0;
        const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? history[history.length - 2]?.close ?? price;
        const change = price - prevClose;
        const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;
        
        const detail = {
          symbol,
          name: meta.longName ?? meta.shortName ?? symbol,
          price: Number(price.toFixed(2)),
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          volume: meta.regularMarketVolume ?? history[history.length - 1]?.volume ?? 0,
          marketCap: meta.marketCap ?? 0,
          sector: "Energy",
          high: meta.regularMarketDayHigh ?? price,
          low: meta.regularMarketDayLow ?? price,
          open: history[history.length - 1]?.open ?? prevClose,
          previousClose: Number(prevClose.toFixed(2)),
          history,
          apiSource: "LIVE"
        };
        console.log("Detail Fetch Successful for:", symbol);
        return detail;
      }
    } catch (err) {
      console.error("Detail Fetch Failed for:", symbol, err);
    }
  }
}

async function run() {
  const cache = new StockCacheTest();
  await cache.fetchLiveQuotes();
  console.log("Stocks live state:", JSON.stringify(cache.stocks, null, 2));
  console.log("Indices live state (first 3 historical prices shown):");
  console.log({
    NIFTY: { ...cache.indices.NIFTY, history: cache.indices.NIFTY.history.slice(0, 3) },
    SENSEX: { ...cache.indices.SENSEX, history: cache.indices.SENSEX.history.slice(0, 3) }
  });
  
  const detail = await cache.getStockDetail("RELIANCE.NS");
  console.log("Detail sample:", {
    symbol: detail.symbol,
    name: detail.name,
    price: detail.price,
    change: detail.change,
    changePercent: detail.changePercent,
    historyLength: detail.history.length,
    firstHistory: detail.history[0],
    lastHistory: detail.history[detail.history.length - 1]
  });
}

run();
