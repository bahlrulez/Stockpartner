const INITIAL_STOCKS = [
  { symbol: "RELIANCE.NS" }, { symbol: "TCS.NS" }, { symbol: "HDFCBANK.NS" }, { symbol: "ICICIBANK.NS" },
  { symbol: "INFY.NS" }, { symbol: "SBIN.NS" }, { symbol: "BHARTIARTL.NS" }, { symbol: "HINDUNILVR.NS" },
  { symbol: "ITC.NS" }, { symbol: "LT.NS" }, { symbol: "TATAMOTORS.NS" }, { symbol: "WIPRO.NS" },
  { symbol: "HCLTECH.NS" }, { symbol: "SUNPHARMA.NS" }, { symbol: "JSWSTEEL.NS" }, { symbol: "ADANIENT.NS" },
  { symbol: "ADANIPORTS.NS" }, { symbol: "POWERGRID.NS" }, { symbol: "NTPC.NS" }, { symbol: "TATASTEEL.NS" },
  { symbol: "ASIANPAINT.NS" }, { symbol: "KOTAKBANK.NS" }, { symbol: "AXISBANK.NS" }, { symbol: "MARUTI.NS" },
  { symbol: "COALINDIA.NS" }, { symbol: "ULTRACEMCO.NS" }, { symbol: "TITAN.NS" }, { symbol: "BAJFINANCE.NS" },
  { symbol: "BAJAJFINSV.NS" }, { symbol: "NESTLEIND.NS" }, { symbol: "APOLLOHOSP.NS" }, { symbol: "GRASIM.NS" },
  { symbol: "HINDALCO.NS" }, { symbol: "TECHM.NS" }, { symbol: "CIPLA.NS" }, { symbol: "EICHERMOT.NS" },
  { symbol: "BPCL.NS" }, { symbol: "DRREDDY.NS" }, { symbol: "SBILIFE.NS" }, { symbol: "HDFCLIFE.NS" },
  { symbol: "HEROMOTOCO.NS" }, { symbol: "BRITANNIA.NS" }, { symbol: "TATACONSUM.NS" }, { symbol: "SHRIRAMFIN.NS" },
  { symbol: "ONGC.NS" }, { symbol: "BEL.NS" }, { symbol: "HAL.NS" }, { symbol: "ZOMATO.NS" },
  { symbol: "JIOFIN.NS" }, { symbol: "LTIM.NS" }
];

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function findMissing() {
  const stockSymbols = INITIAL_STOCKS.map(s => s.symbol);
  const symbolChunks = chunkArray(stockSymbols, 20);
  
  try {
    const fetchPromises = symbolChunks.map(chunk => {
      const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${chunk.join(",")}&range=2d&interval=1d`;
      return fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then(r => r.json());
    });

    const results = await Promise.all(fetchPromises);
    
    const fetchedSymbols = [];
    results.forEach((data, index) => {
      if (data.spark && data.spark.result) {
        data.spark.result.forEach(item => {
          fetchedSymbols.push(item.symbol);
        });
      } else {
        console.log(`Chunk ${index} failed:`, data);
      }
    });

    console.log(`Fetched count: ${fetchedSymbols.length}`);
    const missing = stockSymbols.filter(s => !fetchedSymbols.includes(s));
    console.log("Missing symbols:", missing);
  } catch (err) {
    console.error(err);
  }
}

findMissing();
