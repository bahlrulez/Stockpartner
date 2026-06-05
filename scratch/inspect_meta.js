async function inspect() {
  const sym = "RELIANCE.NS";
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=2d&interval=1d`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const data = await res.json();
    if (data.chart && data.chart.result) {
      const result = data.chart.result[0];
      console.log("META keys and values:");
      console.log(JSON.stringify(result.meta, null, 2));
      console.log("INDICATORS quote keys:");
      console.log(JSON.stringify(result.indicators.quote[0], null, 2));
    } else {
      console.log("Failed:", data);
    }
  } catch (err) {
    console.error(err);
  }
}
inspect();
