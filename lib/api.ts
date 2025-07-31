// const BASE_URL = "https://api.coingecko.com/api/v3";
// const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

// const getHeaders = (): HeadersInit => {
//   const headers: HeadersInit = {};
//   if (API_KEY) {
//     headers["x-cg-demo-api-key"] = API_KEY;
//   }
//   return headers;
// };

// export const getTopCoins = async (limit: number = 50) => {
//   try {
//     const res = await fetch("/api/top-coins");

//     if (!res.ok) {
//       throw new Error("Failed to fetch coins");
//     }

//     const data = await res.json();
//     // return data;
//     if (!Array.isArray(data)) {
//       console.error("Expected array, got:", data);
//       return [];
//     }

//     return data;
//   } catch (error) {
//     console.error("getTopCoins error:", error);
//     return [];
//   }
// };
// export async function getCoinDetails(id: string) {
//   const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?x_cg_demo_api_key=${process.env.NEXT_PUBLIC_CG_KEY}`);
//   if (!res.ok) return null;
//   return res.json();
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

const BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {};
  if (API_KEY) {
    headers["x-cg-demo-api-key"] = API_KEY;
  }
  return headers;
};

export const getTopCoins = async (limit: number = 50) => {
  try {
    const res = await fetch('/api/top-coins');
    
    if (!res.ok) {
      throw new Error("Failed to fetch coins");
    }

    return await res.json();
  } catch (error) {
    console.error("getTopCoins error:", error);
    return [];
  }
};

export async function getCoinDetails(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/coins/${id}`, {
      headers: getHeaders()
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch coin details: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("getCoinDetails error:", error);
    return null;
  }
}