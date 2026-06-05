async function testSpark() {
  const symbols = ["RELIANCE.NS", "TCS.NS", "^NSEI", "^BSESN"];
  const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${symbols.join(",")}&range=1d&interval=5m`;
  console.log(`Fetching: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
testSpark();
