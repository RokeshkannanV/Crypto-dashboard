/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

"use client";

import { useEffect, useState, useCallback } from "react";
import { getTopCoins } from "../../lib/api";
import Link from "next/link";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap: number;
  market_cap_rank: number;
}

export default function WatchlistPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load watchlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    if (stored) setWatchlist(JSON.parse(stored));
  }, []);

  // Fetch coins data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTopCoins();
        setCoins(data);
      } catch (err) {
        console.error("Failed to fetch coins:", err);
        setError("Failed to load watchlist data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const removeFromWatchlist = useCallback((coinId: string) => {
    const updated = watchlist.filter(id => id !== coinId);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  }, [watchlist]);

  const filteredCoins = coins.filter(coin => watchlist.includes(coin.id));

  // Format currency with proper decimal places
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="p-4 max-w-7xl mx-auto min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            My Watchlist
          </h1>
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse overflow-hidden">
              <div className="h-full flex flex-col p-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-auto space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          My Watchlist
        </h1>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-700 hover:text-red-600 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          My Watchlist
        </h1>
        <span className="text-gray-500 font-medium">
          {filteredCoins.length} {filteredCoins.length === 1 ? "coin" : "coins"}
        </span>
      </div>

      {filteredCoins.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Your watchlist is empty</h3>
          <p className="mt-2 text-gray-500">
            You haven't added any coins to your watchlist yet.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Browse Popular Coins
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCoins.map(coin => (
            <div
              key={coin.id}
              className="relative border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white overflow-hidden group"
            >
              <Link href={`/coin/${coin.id}`} className="block p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={coin.image} 
                      alt={coin.name} 
                      className="w-10 h-10 rounded-full"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{coin.name}</h3>
                      <p className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-800">
  #{coin.market_cap_rank ?? coin.market_cap} 
</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-semibold">
                    {formatCurrency(coin.current_price)}
                  </p>
                  <p className={`text-sm ${
                    coin.price_change_percentage_24h >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                    <span className="text-gray-500 ml-1">(24h)</span>
                  </p>
                </div>
              </Link>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWatchlist(coin.id);
                }}
                className="absolute top-3 right-3 p-2 text-yellow-500 hover:text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label={`Remove ${coin.name} from watchlist`}
                title="Remove from watchlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}