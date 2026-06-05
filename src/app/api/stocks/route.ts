import { NextResponse } from "next/server";
import { stockCache } from "@/lib/stockCache";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  try {
    const stocks = await stockCache.getStocks();
    const indices = await stockCache.getIndices();
    return NextResponse.json({
      status: "success",
      apiStatus: stockCache.apiStatus === "NONE" ? "SIMULATED" : stockCache.apiStatus,
      timestamp: Date.now(),
      data: stocks,
      indices: indices
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error) {
    console.error("API stock list error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch stock list" },
      { status: 500 }
    );
  }
}
