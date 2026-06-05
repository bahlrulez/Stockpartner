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

async function testChunked() {
  const stockSymbols = INITIAL_STOCKS.map(s => s.symbol);
  const symbolChunks = chunkArray(stockSymbols, 20);
  
  try {
    const fetchPromises = symbolChunks.map(chunk => {
      const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${chunk.join(",")}&range=2d&interval=1d`;
      return fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then(r => r.json());
    });

    const indexUrl = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=^NSEI,^BSESN&range=1d&interval=5m`;
    const indexPromise = fetch(indexUrl, { headers: { "User-Agent": "Mozilla/5.0" } }).then(r => r.json());

    const results = await Promise.all([...fetchPromises, indexPromise]);
    
    let totalStocksFetched = 0;
    const stockResults = results.slice(0, results.length - 1);
    const indexData = results[results.length - 1];

    for (const data of stockResults) {
      if (data.spark && data.spark.result) {
        totalStocksFetched += data.spark.result.length;
      }
    }

    console.log(`Successfully fetched ${totalStocksFetched} stocks!`);
    console.log(`Indices response keys:`, indexData.spark ? Object.keys(indexData.spark) : "Failed");
    if (indexData.spark?.result) {
      console.log(`Indices result length:`, indexData.spark.result.length);
    }
  } catch (err) {
    console.error(err);
  }
}

testChunked();
