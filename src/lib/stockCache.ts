// Edge compatible stock cache without subprocesses

export interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  apiSource: "LIVE" | "SIMULATED";
  weekPerf?: number;
  monthPerf?: number;
  yearPerf?: number;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockDetail {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  history: HistoricalDataPoint[];
  apiSource: "LIVE" | "SIMULATED";
}

export interface IndexInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: number[];
  apiSource: "LIVE" | "SIMULATED";
}

// Initial 50 NSE Stock database (Yahoo format .NS) with realistic starting values
const INITIAL_STOCKS: Omit<StockInfo, "high" | "low" | "open" | "previousClose" | "apiSource">[] = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries Ltd.", price: 1303.70, change: -9.50, changePercent: -0.72, volume: 23455147, marketCap: 17642280000000, sector: "Energy" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services Ltd.", price: 2241.00, change: -0.70, changePercent: -0.03, volume: 4865423, marketCap: 8108130000000, sector: "Technology" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd.", price: 1602.10, change: 8.40, changePercent: 0.53, volume: 12400000, marketCap: 12500000000000, sector: "Financial Services" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank Ltd.", price: 1120.40, change: 15.65, changePercent: 1.42, volume: 8900000, marketCap: 7800000000000, sector: "Financial Services" },
  { symbol: "INFY.NS", name: "Infosys Ltd.", price: 1201.30, change: -19.20, changePercent: -1.57, volume: 12754428, marketCap: 4863580000000, sector: "Technology" },
  { symbol: "SBIN.NS", name: "State Bank of India", price: 830.15, change: 4.85, changePercent: 0.59, volume: 15100000, marketCap: 7400000000000, sector: "Financial Services" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel Ltd.", price: 1380.00, change: 25.40, changePercent: 1.87, volume: 4800000, marketCap: 8100000000000, sector: "Telecommunications" },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever Ltd.", price: 2350.25, change: -18.75, changePercent: -0.79, volume: 1500000, marketCap: 5500000000000, sector: "Consumer Goods" },
  { symbol: "ITC.NS", name: "ITC Ltd.", price: 430.45, change: 2.15, changePercent: 0.50, volume: 11000000, marketCap: 5300000000000, sector: "Consumer Goods" },
  { symbol: "LT.NS", name: "Larsen & Toubro Ltd.", price: 3500.60, change: 68.40, changePercent: 1.99, volume: 1800000, marketCap: 4900000000000, sector: "Construction & Engineering" },
  { symbol: "TMPV.NS", name: "Tata Motors Passenger Vehicles Ltd.", price: 396.70, change: -3.00, changePercent: -0.75, volume: 9200000, marketCap: 3400000000000, sector: "Automotive" },
  { symbol: "WIPRO.NS", name: "Wipro Ltd.", price: 460.90, change: -3.20, changePercent: -0.69, volume: 5100000, marketCap: 2400000000000, sector: "Technology" },
  { symbol: "HCLTECH.NS", name: "HCL Technologies Ltd.", price: 1320.15, change: 11.20, changePercent: 0.86, volume: 2900000, marketCap: 3600000000000, sector: "Technology" },
  { symbol: "SUNPHARMA.NS", name: "Sun Pharmaceutical Industries Ltd.", price: 1500.50, change: 18.90, changePercent: 1.28, volume: 2200000, marketCap: 3600000000000, sector: "Healthcare" },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel Ltd.", price: 900.40, change: -8.60, changePercent: -0.95, volume: 3100000, marketCap: 2200000000000, sector: "Basic Materials" },
  { symbol: "ADANIENT.NS", name: "Adani Enterprises Ltd.", price: 3150.00, change: 105.30, changePercent: 3.46, volume: 3800000, marketCap: 3600000000000, sector: "Energy & Industrials" },
  { symbol: "ADANIPORTS.NS", name: "Adani Ports & SEZ Ltd.", price: 1400.25, change: 35.80, changePercent: 2.62, volume: 4400000, marketCap: 3000000000000, sector: "Industrials" },
  { symbol: "POWERGRID.NS", name: "Power Grid Corp. of India Ltd.", price: 310.40, change: 1.15, changePercent: 0.37, volume: 8500000, marketCap: 2150000000000, sector: "Utilities" },
  { symbol: "NTPC.NS", name: "NTPC Ltd.", price: 360.75, change: -2.30, changePercent: -0.63, volume: 9100000, marketCap: 3500000000000, sector: "Utilities" },
  { symbol: "TATASTEEL.NS", name: "Tata Steel Ltd.", price: 170.20, change: 0.85, changePercent: 0.50, volume: 24000000, marketCap: 2120000000000, sector: "Basic Materials" },
  { symbol: "ASIANPAINT.NS", name: "Asian Paints Ltd.", price: 2850.15, change: -32.40, changePercent: -1.12, volume: 1100000, marketCap: 2750000000000, sector: "Consumer Goods" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank Ltd.", price: 1720.90, change: 14.50, changePercent: 0.85, volume: 3200000, marketCap: 3400000000000, sector: "Financial Services" },
  { symbol: "AXISBANK.NS", name: "Axis Bank Ltd.", price: 1180.35, change: -12.10, changePercent: -1.01, volume: 5900000, marketCap: 3650000000000, sector: "Financial Services" },
  { symbol: "MARUTI.NS", name: "Maruti Suzuki India Ltd.", price: 12200.00, change: 185.00, changePercent: 1.54, volume: 450000, marketCap: 3800000000000, sector: "Automotive" },
  { symbol: "COALINDIA.NS", name: "Coal India Ltd.", price: 480.20, change: 6.45, changePercent: 1.36, volume: 7600000, marketCap: 2950000000000, sector: "Utilities" },
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement Ltd.", price: 9800.50, change: -110.00, changePercent: -1.11, volume: 350000, marketCap: 2850000000000, sector: "Construction Materials" },
  { symbol: "TITAN.NS", name: "Titan Company Ltd.", price: 3250.40, change: 42.10, changePercent: 1.31, volume: 1400000, marketCap: 2900000000000, sector: "Consumer Goods" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance Ltd.", price: 6800.80, change: -92.50, changePercent: -1.34, volume: 1600000, marketCap: 4100000000000, sector: "Financial Services" },
  { symbol: "BAJAJFINSV.NS", name: "Bajaj Finserv Ltd.", price: 1600.25, change: 8.90, changePercent: 0.56, volume: 2200000, marketCap: 2550000000000, sector: "Financial Services" },
  { symbol: "NESTLEIND.NS", name: "Nestle India Ltd.", price: 2500.15, change: -15.40, changePercent: -0.61, volume: 600000, marketCap: 2400000000000, sector: "Consumer Goods" },
  { symbol: "APOLLOHOSP.NS", name: "Apollo Hospitals Enterprise Ltd.", price: 5900.60, change: 124.50, changePercent: 2.16, volume: 750000, marketCap: 85000000000, sector: "Healthcare" },
  { symbol: "GRASIM.NS", name: "Grasim Industries Ltd.", price: 2400.10, change: -12.90, changePercent: -0.53, volume: 890000, marketCap: 1600000000000, sector: "Industrials" },
  { symbol: "HINDALCO.NS", name: "Hindalco Industries Ltd.", price: 670.30, change: 14.20, changePercent: 2.16, volume: 6800000, marketCap: 1500000000000, sector: "Basic Materials" },
  { symbol: "TECHM.NS", name: "Tech Mahindra Ltd.", price: 1350.50, change: -24.80, changePercent: -1.80, volume: 2400000, marketCap: 1300000000000, sector: "Technology" },
  { symbol: "CIPLA.NS", name: "Cipla Ltd.", price: 1480.20, change: 5.60, changePercent: 0.38, volume: 1900000, marketCap: 1200000000000, sector: "Healthcare" },
  { symbol: "EICHERMOT.NS", name: "Eicher Motors Ltd.", price: 4700.80, change: 85.40, changePercent: 1.85, volume: 650000, marketCap: 1300000000000, sector: "Automotive" },
  { symbol: "BPCL.NS", name: "Bharat Petroleum Corp. Ltd.", price: 630.15, change: -4.30, changePercent: -0.68, volume: 4500000, marketCap: 1350000000000, sector: "Energy" },
  { symbol: "DRREDDY.NS", name: "Dr. Reddy's Laboratories Ltd.", price: 6100.40, change: -88.90, changePercent: -1.44, volume: 550000, marketCap: 1020000000000, sector: "Healthcare" },
  { symbol: "SBILIFE.NS", name: "SBI Life Insurance Co. Ltd.", price: 1450.60, change: 12.30, changePercent: 0.86, volume: 1500000, marketCap: 1450000000000, sector: "Financial Services" },
  { symbol: "HDFCLIFE.NS", name: "HDFC Life Insurance Co. Ltd.", price: 580.40, change: -3.50, changePercent: -0.60, volume: 3800000, marketCap: 1250000000000, sector: "Financial Services" },
  { symbol: "HEROMOTOCO.NS", name: "Hero MotoCorp Ltd.", price: 5100.25, change: 75.90, changePercent: 1.51, volume: 480000, marketCap: 1020000000000, sector: "Automotive" },
  { symbol: "BRITANNIA.NS", name: "Britannia Industries Ltd.", price: 5200.75, change: -12.40, changePercent: -0.24, volume: 520000, marketCap: 1250000000000, sector: "Consumer Goods" },
  { symbol: "TATACONSUM.NS", name: "Tata Consumer Products Ltd.", price: 1100.10, change: 8.50, changePercent: 0.78, volume: 2200000, marketCap: 1080000000000, sector: "Consumer Goods" },
  { symbol: "SHRIRAMFIN.NS", name: "Shriram Finance Ltd.", price: 2350.50, change: 35.60, changePercent: 1.54, volume: 1400000, marketCap: 880000000000, sector: "Financial Services" },
  { symbol: "ONGC.NS", name: "Oil & Natural Gas Corp. Ltd.", price: 270.80, change: -2.10, changePercent: -0.77, volume: 14200000, marketCap: 3400000000000, sector: "Energy" },
  { symbol: "BEL.NS", name: "Bharat Electronics Ltd.", price: 280.40, change: 8.90, changePercent: 3.28, volume: 18500000, marketCap: 2050000000000, sector: "Industrials" },
  { symbol: "HAL.NS", name: "Hindustan Aeronautics Ltd.", price: 4700.50, change: 165.20, changePercent: 3.64, volume: 1900000, marketCap: 3150000000000, sector: "Industrials" },
  { symbol: "ETERNAL.NS", name: "Eternal Ltd. (Zomato)", price: 254.60, change: 0.25, changePercent: 0.10, volume: 28000000, marketCap: 1680000000000, sector: "Technology/Consumer Services" },
  { symbol: "JIOFIN.NS", name: "Jio Financial Services Ltd.", price: 350.60, change: -8.90, changePercent: -2.48, volume: 12000000, marketCap: 2220000000000, sector: "Financial Services" },
  { symbol: "LTM.NS", name: "LTIMindtree Ltd.", price: 4021.70, change: -46.00, changePercent: -1.13, volume: 750000, marketCap: 1400000000000, sector: "Technology" }
];

class StockCacheManager {
  private stocks: StockInfo[] = [];
  private detailCache: Map<string, { data: StockDetail; expiry: number }> = new Map();
  private lastTickTime: number = Date.now();
  private lastFetchTime: number = 0;
  private isFetching: boolean = false;
  public apiStatus: "LIVE" | "RATE_LIMITED" | "NONE" = "NONE";

  // Indices: NIFTY 50 and BSE SENSEX
  private indices: Record<string, IndexInfo> = {
    NIFTY: {
      symbol: "^NSEI",
      name: "NIFTY 50",
      price: 23416.55,
      change: 10.95,
      changePercent: 0.05,
      history: [],
      apiSource: "SIMULATED"
    },
    SENSEX: {
      symbol: "^BSESN",
      name: "BSE SENSEX",
      price: 74360.01,
      change: 13.84,
      changePercent: 0.02,
      history: [],
      apiSource: "SIMULATED"
    }
  };

  constructor() {
    this.initializeStocks();
    this.initializeIndices();
  }

  private initializeStocks() {
    this.stocks = INITIAL_STOCKS.map(s => {
      const prevClose = s.price - s.change;
      const fluctuation = s.price * 0.02; // 2% daily fluctuation limit
      return {
        ...s,
        high: s.price + (Math.random() * fluctuation),
        low: s.price - (Math.random() * fluctuation),
        open: prevClose + ((Math.random() - 0.5) * fluctuation * 0.5),
        previousClose: prevClose,
        weekPerf: Number((s.changePercent * 3 + (Math.random() - 0.5) * 5).toFixed(2)),
        monthPerf: Number((s.changePercent * 8 + (Math.random() - 0.5) * 12).toFixed(2)),
        yearPerf: Number((s.changePercent * 25 + (Math.random() - 0.5) * 40).toFixed(2)),
        apiSource: "SIMULATED"
      };
    });
  }

  private initializeIndices() {
    // Generate simulated histories for indices initially
    Object.keys(this.indices).forEach(key => {
      const idx = this.indices[key];
      const points = [];
      let base = idx.price;
      for (let i = 0; i < 20; i++) {
        base = base + (Math.random() - 0.5) * base * 0.005;
        points.push(Number(base.toFixed(2)));
      }
      idx.history = points;
    });
  }

  private isMarketOpen(): boolean {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const istTime = new Date(utc + 3600000 * 5.5);
    
    const day = istTime.getDay();
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    const timeVal = hour * 100 + minute;

    const isWeekday = day >= 1 && day <= 5;
    const isTradingHours = timeVal >= 915 && timeVal <= 1530; // 9:15 AM to 3:30 PM IST

    return isWeekday && isTradingHours;
  }

  // Small random walk to simulate ticking between fetch intervals
  public tickPrices() {
    // Only tick prices if the market is open
    if (!this.isMarketOpen()) return;

    const now = Date.now();
    const elapsed = now - this.lastTickTime;
    
    if (elapsed < 2000) return;
    this.lastTickTime = now;

    // Fluctuate stocks
    this.stocks = this.stocks.map(stock => {
      const percentage = (Math.random() - 0.5) * 0.0006;
      const diff = stock.price * percentage;
      const newPrice = Number((stock.price + diff).toFixed(2));
      
      const newChange = Number((newPrice - stock.previousClose).toFixed(2));
      const newChangePercent = Number(((newChange / stock.previousClose) * 100).toFixed(2));

      return {
        ...stock,
        price: newPrice,
        change: newChange,
        changePercent: newChangePercent,
        high: newPrice > stock.high ? newPrice : stock.high,
        low: newPrice < stock.low ? newPrice : stock.low
      };
    });

    // Fluctuate indices
    Object.keys(this.indices).forEach(key => {
      const idx = this.indices[key];
      const percentage = (Math.random() - 0.49) * 0.0003; // tiny positive drift
      const diff = idx.price * percentage;
      const newPrice = Number((idx.price + diff).toFixed(2));
      const newChange = Number((newPrice - (idx.price - idx.change)).toFixed(2));
      const prev = newPrice - newChange;
      const newChangePercent = Number(((newChange / prev) * 100).toFixed(2));

      idx.price = newPrice;
      idx.change = newChange;
      idx.changePercent = newChangePercent;
      
      // Keep sparkline updated with ticking last price
      if (idx.history.length > 0) {
        idx.history[idx.history.length - 1] = newPrice;
      }
    });
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }

  // Pure Edge-compatible HTTP Fetch
  private async fetchLiveQuotes() {
    if (this.isFetching) return;
    
    const now = Date.now();
    // Refresh quotes every 30 seconds
    if (now - this.lastFetchTime < 30000) return;
    
    this.isFetching = true;

    try {
      const stockSymbols = this.stocks.map(s => s.symbol);
      const symbolChunks = this.chunkArray(stockSymbols, 20);

      const fetchPromises = symbolChunks.map(chunk => {
        const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${chunk.join(",")}&range=1y&interval=1d`;
        return fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        }).then(r => {
          if (!r.ok) throw new Error(`Stock fetch status ${r.status}`);
          return r.json() as Promise<any>;
        });
      });

      const indexUrl = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=^NSEI,^BSESN&range=1d&interval=5m`;
      const indexPromise = fetch(indexUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      }).then(r => {
        if (!r.ok) throw new Error(`Index fetch status ${r.status}`);
        return r.json() as Promise<any>;
      });

      const results = await Promise.all([...fetchPromises, indexPromise]);
      const indexData = results[results.length - 1];
      const stockDataChunks = results.slice(0, results.length - 1);

      // Parse stock quotes from all chunks
      const resultsMap = new Map();
      for (const stockData of stockDataChunks) {
        if (stockData.spark?.result) {
          for (const item of stockData.spark.result) {
            if (item.response?.[0]) {
              const meta = item.response[0].meta;
              const rawCloses = item.response[0].indicators?.quote?.[0]?.close || [];
              const closes = rawCloses.filter((c: any) => c !== null && c !== undefined);
              
              const price = meta.regularMarketPrice ?? closes[closes.length - 1] ?? 0;
              // Daily previous close is the second to last element in the closes array
              const prevClose = closes.length > 1 ? closes[closes.length - 2] : price;
              const change = price - prevClose;
              const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

              const weekPrice = closes.length >= 5 ? closes[closes.length - 5] : closes[0];
              const monthPrice = closes.length >= 21 ? closes[closes.length - 21] : closes[0];
              const yearPrice = closes[0];

              const weekPerf = weekPrice ? ((price - weekPrice) / weekPrice) * 100 : changePercent;
              const monthPerf = monthPrice ? ((price - monthPrice) / monthPrice) * 100 : changePercent;
              const yearPerf = yearPrice ? ((price - yearPrice) / yearPrice) * 100 : changePercent;

              resultsMap.set(item.symbol, {
                price: Number(price.toFixed(2)),
                change: Number(change.toFixed(2)),
                changePercent: Number(changePercent.toFixed(2)),
                volume: meta.regularMarketVolume ?? 0,
                high: meta.regularMarketDayHigh ?? price,
                low: meta.regularMarketDayLow ?? price,
                open: closes[closes.length - 1] ?? prevClose,
                previousClose: Number(prevClose.toFixed(2)),
                weekPerf: Number(weekPerf.toFixed(2)),
                monthPerf: Number(monthPerf.toFixed(2)),
                yearPerf: Number(yearPerf.toFixed(2))
              });
            }
          }
        }
      }

      this.stocks = this.stocks.map(stock => {
        const live = resultsMap.get(stock.symbol);
        if (live) {
          return {
            ...stock,
            ...live,
            apiSource: "LIVE" as const
          };
        }
        return stock;
      });

      // Parse index quotes & sparklines
      if (indexData.spark?.result) {
        for (const item of indexData.spark.result) {
          if (item.response?.[0]) {
            const meta = item.response[0].meta;
            const closes = item.response[0].indicators?.quote?.[0]?.close || [];
            
            const price = meta.regularMarketPrice ?? closes[closes.length - 1] ?? 0;
            const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
            const change = price - prevClose;
            const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;
            const history = closes.filter((p: any) => p !== null && p !== undefined).map((p: number) => Number(p.toFixed(2)));

            const key = item.symbol === "^NSEI" ? "NIFTY" : item.symbol === "^BSESN" ? "SENSEX" : null;
            if (key) {
              this.indices[key] = {
                symbol: item.symbol,
                name: key === "NIFTY" ? "NIFTY 50" : "BSE SENSEX",
                price: Number(price.toFixed(2)),
                change: Number(change.toFixed(2)),
                changePercent: Number(changePercent.toFixed(2)),
                history: history,
                apiSource: "LIVE" as const
              };
            }
          }
        }
      }

      this.lastFetchTime = Date.now();
      this.apiStatus = "LIVE";
    } catch (err) {
      console.error("Error fetching live quotes from Yahoo Finance:", err);
      this.apiStatus = "RATE_LIMITED";
    } finally {
      this.isFetching = false;
    }
  }

  public async getStocks(): Promise<StockInfo[]> {
    await this.fetchLiveQuotes();
    this.tickPrices();
    return this.stocks;
  }

  public async getIndices(): Promise<Record<string, IndexInfo>> {
    await this.fetchLiveQuotes();
    return this.indices;
  }

  // Fetch detailed data dynamically (on-demand via Promise)
  public async getStockDetail(symbol: string): Promise<StockDetail> {
    const now = Date.now();
    const cached = this.detailCache.get(symbol);
    
    if (cached && cached.expiry > now) {
      return cached.data;
    }

    const stockInfo = this.stocks.find(s => s.symbol === symbol) || {
      symbol,
      name: symbol.split(".")[0],
      price: 100,
      change: 0,
      changePercent: 0,
      volume: 1000000,
      marketCap: 10000,
      sector: "Unknown",
      high: 105,
      low: 95,
      open: 100,
      previousClose: 100,
      apiSource: "SIMULATED" as const
    };

    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (!res.ok) {
        throw new Error(`Yahoo chart details API returned status ${res.status}`);
      }

      const data = (await res.json()) as any;
      
      if (data.chart?.result?.[0]) {
        const result = data.chart.result[0];
        const meta = result.meta;
        const timestamps = result.timestamp || [];
        const quote = result.indicators?.quote?.[0] || {};
        
        const history: HistoricalDataPoint[] = [];
        for (let i = 0; i < timestamps.length; i++) {
          if (quote.close?.[i] === null || quote.close?.[i] === undefined) continue;
          history.push({
            date: new Date(timestamps[i] * 1000).toISOString().split("T")[0],
            open: Number((quote.open?.[i] ?? quote.close[i]).toFixed(2)),
            high: Number((quote.high?.[i] ?? quote.close[i]).toFixed(2)),
            low: Number((quote.low?.[i] ?? quote.close[i]).toFixed(2)),
            close: Number(quote.close[i].toFixed(2)),
            volume: Math.floor(quote.volume?.[i] ?? 0)
          });
        }
        
        const price = meta.regularMarketPrice ?? history[history.length - 1]?.close ?? stockInfo.price;
        // Lookup daily previous close from the stockInfo database
        const prevClose = stockInfo.previousClose ?? meta.chartPreviousClose ?? meta.previousClose ?? history[history.length - 2]?.close ?? price;
        const change = price - prevClose;
        const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;
        
        const localStock = INITIAL_STOCKS.find(s => s.symbol === symbol);
        
        const detail: StockDetail = {
          symbol,
          name: meta.longName ?? meta.shortName ?? localStock?.name ?? stockInfo.name,
          price: Number(price.toFixed(2)),
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          volume: meta.regularMarketVolume ?? history[history.length - 1]?.volume ?? stockInfo.volume,
          marketCap: localStock?.marketCap ?? meta.marketCap ?? stockInfo.marketCap,
          sector: localStock?.sector ?? stockInfo.sector,
          high: meta.regularMarketDayHigh ?? price,
          low: meta.regularMarketDayLow ?? price,
          open: history[history.length - 1]?.open ?? prevClose,
          previousClose: Number(prevClose.toFixed(2)),
          history,
          apiSource: "LIVE" as const
        };
        
        // Update in-memory stock list quote
        const idx = this.stocks.findIndex(s => s.symbol === symbol);
        if (idx !== -1) {
          this.stocks[idx] = {
            ...this.stocks[idx],
            price: detail.price,
            change: detail.change,
            changePercent: detail.changePercent,
            volume: detail.volume,
            high: detail.high,
            low: detail.low,
            open: detail.open,
            previousClose: detail.previousClose,
            apiSource: "LIVE"
          };
        }
        
        this.detailCache.set(symbol, { data: detail, expiry: now + 30000 });
        return detail;
      } else {
        console.warn(`Yahoo Finance chart detail failed for ${symbol}, fallback to simulated.`);
        return this.createFallbackDetail(stockInfo);
      }
    } catch (err) {
      console.error(`Error fetching detail from Yahoo Finance for ${symbol}:`, err);
      return this.createFallbackDetail(stockInfo);
    }
  }

  private createFallbackDetail(stockInfo: StockInfo): StockDetail {
    const history: HistoricalDataPoint[] = [];
    let currentPrice = stockInfo.price;
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      const priceVal = currentPrice + (Math.random() - 0.5) * currentPrice * 0.015;
      history.push({
        date: date.toISOString().split("T")[0],
        open: Number(currentPrice.toFixed(2)),
        high: Number(Math.max(currentPrice, priceVal).toFixed(2)),
        low: Number(Math.min(currentPrice, priceVal).toFixed(2)),
        close: Number(priceVal.toFixed(2)),
        volume: Math.floor(stockInfo.volume * (0.8 + Math.random() * 0.4))
      });
      currentPrice = priceVal;
    }
    
    return {
      ...stockInfo,
      history,
      apiSource: "SIMULATED"
    };
  }
}

export const stockCache = new StockCacheManager();
