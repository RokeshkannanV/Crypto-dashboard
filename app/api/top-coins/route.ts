
// import { NextResponse } from "next/server";

// export async function GET() {
//   const url =
//     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false";

//   try {
//     const response = await fetch(url, {
//       headers: {
//         Accept: "application/json",
//       },
//       cache: "no-store", 
//     });

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Server error:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch coins" },
//       { status: 500 }
//     );
//   }
// }
// /app/api/top-coins/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const BASE_URL = 'https://api.coingecko.com/api/v3/coins/markets';
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '50',
    page: '1',
    sparkline: 'false'
  });

  const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers: {
        ...(API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {})
      },
      // Fix CORS issue:
      next: { revalidate: 3600 } // Optional: cache for 1 hour
    });

    const data = await res.json();

    // Handle CoinGecko rate-limit errors
    if (!Array.isArray(data)) {
      console.error("Unexpected response from CoinGecko:", data);
      return NextResponse.json([], { status: 200 }); // avoid crashing UI
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching top coins:', error);
    return NextResponse.json([], { status: 500 });
  }
}

