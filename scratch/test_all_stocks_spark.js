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

async function testAll() {
  const symbols = INITIAL_STOCKS.map(s => s.symbol);
  const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${symbols.join(",")}&range=2d&interval=1d`;
  console.log(`URL Length: ${url.length}`);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    console.log(`Response Status: ${res.status}`);
    const data = await res.json();
    if (data.spark && data.spark.result) {
      console.log(`Successfully fetched ${data.spark.result.length} symbols!`);
    } else {
      console.log("Error details:", data);
    }
  } catch (err) {
    console.error(err);
  }
}
testAll();
