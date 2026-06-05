async function testSpark2d() {
  const symbols = ["RELIANCE.NS", "TCS.NS", "^NSEI", "^BSESN"];
  const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${symbols.join(",")}&range=2d&interval=1d`;
  console.log(`Fetching: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const data = await res.json();
    console.log("Keys in response:");
    if (data.spark && data.spark.result) {
      for (const item of data.spark.result) {
        console.log(`Symbol: ${item.symbol}`);
        if (item.response && item.response[0]) {
          const resObj = item.response[0];
          console.log("  Meta:", JSON.stringify(resObj.meta, null, 2));
          console.log("  Indicators quote close:", resObj.indicators.quote[0].close);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
testSpark2d();
