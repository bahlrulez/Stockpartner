import { NextRequest, NextResponse } from "next/server";
import { stockCache } from "@/lib/stockCache";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        { status: "error", message: "Symbol parameter is required" },
        { status: 400 }
      );
    }

    const detail = await stockCache.getStockDetail(symbol);

    return NextResponse.json({
      status: "success",
      apiStatus: stockCache.apiStatus === "NONE" ? "SIMULATED" : stockCache.apiStatus,
      timestamp: Date.now(),
      data: detail
    }, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60" // Allow light client caching for 1 minute
      }
    });
  } catch (error) {
    console.error(`API stock detail error for symbol:`, error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch stock details" },
      { status: 500 }
    );
  }
}
