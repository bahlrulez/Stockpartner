async function testChartDetail() {
  const sym = "RELIANCE.NS";
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1mo&interval=1d`;
  console.log(`Fetching: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const data = await res.json();
    if (data.chart && data.chart.result) {
      const result = data.chart.result[0];
      const meta = result.meta;
      const timestamps = result.timestamp;
      const quote = result.indicators.quote[0];
      
      console.log("Meta fields:", Object.keys(meta));
      console.log("RegularMarketPrice:", meta.regularMarketPrice);
      console.log("ChartPreviousClose / PreviousClose:", meta.chartPreviousClose, meta.previousClose);
      console.log("Timestamps length:", timestamps.length);
      console.log("Quote fields:", Object.keys(quote));
      
      if (timestamps.length > 0) {
        console.log("First point:");
        console.log({
          timestamp: timestamps[0],
          date: new Date(timestamps[0] * 1000).toISOString().split("T")[0],
          open: quote.open[0],
          high: quote.high[0],
          low: quote.low[0],
          close: quote.close[0],
          volume: quote.volume[0]
        });
        console.log("Last point:");
        const lastIdx = timestamps.length - 1;
        console.log({
          timestamp: timestamps[lastIdx],
          date: new Date(timestamps[lastIdx] * 1000).toISOString().split("T")[0],
          open: quote.open[lastIdx],
          high: quote.high[lastIdx],
          low: quote.low[lastIdx],
          close: quote.close[lastIdx],
          volume: quote.volume[lastIdx]
        });
      }
    } else {
      console.log("Failed:", data);
    }
  } catch (err) {
    console.error(err);
  }
}
testChartDetail();
