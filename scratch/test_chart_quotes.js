async function testChartQuotes() {
  const symbols = ["RELIANCE.NS", "TCS.NS", "^NSEI", "^BSESN"];
  
  for (const sym of symbols) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=2d&interval=1d`;
    console.log(`Fetching: ${url}`);
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      const data = await res.json();
      if (data.chart && data.chart.result) {
        const result = data.chart.result[0];
        const meta = result.meta;
        const indicators = result.indicators.quote[0];
        const closes = indicators.close;
        const price = meta.regularMarketPrice;
        const prevClose = meta.previousClose;
        
        console.log(`Symbol: ${sym}`);
        console.log(`  Meta price: ${price}`);
        console.log(`  Meta prevClose: ${prevClose}`);
        console.log(`  Chart closes: ${JSON.stringify(closes)}`);
        console.log(`  Calculated change: ${price - prevClose}`);
      } else {
        console.log(`  Failed for ${sym}:`, data);
      }
    } catch (err) {
      console.error(`  Error for ${sym}:`, err);
    }
  }
}

testChartQuotes();
