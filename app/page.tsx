/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

"use client";

import { useEffect, useState, useMemo } from "react";
import { getTopCoins } from "../lib/api";
import Link from "next/link";
import { useDebounce } from "../lib/useDebounce";

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

export default function HomePage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof Coin>("market_cap");
  const [page, setPage] = useState(1);
  const coinsPerPage = 12;

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTopCoins();
        setCoins(data);
      } catch (err) {
        setError('Failed to fetch coins. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    const storedWatchlist = localStorage.getItem("watchlist");
    if (storedWatchlist) {
      setWatchlist(JSON.parse(storedWatchlist));
    }
  }, []);

  const toggleWatchlist = (coinId: string) => {
    const updated = watchlist.includes(coinId)
      ? watchlist.filter((id) => id !== coinId)
      : [...watchlist, coinId];
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  const filteredCoins = useMemo(() => {
    return coins.filter((coin) =>
      coin.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [coins, debouncedSearch]);

  const sortedCoins = useMemo(() => {
    return [...filteredCoins].sort((a, b) => {
      if (sortBy === 'name' || sortBy === 'symbol') {
        return a[sortBy].localeCompare(b[sortBy]);
      }
      
      const valA = Number(a[sortBy]) || 0;
      const valB = Number(b[sortBy]) || 0;
      return valB - valA;
    });
  }, [filteredCoins, sortBy]);

  const paginatedCoins = useMemo(() => {
    const startIndex = (page - 1) * coinsPerPage;
    return sortedCoins.slice(startIndex, startIndex + coinsPerPage);
  }, [sortedCoins, page]);

  const totalPages = Math.ceil(sortedCoins.length / coinsPerPage);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto relative min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-center md:text-left w-full md:w-auto">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Crypto Market
          </span>
        </h1>
        
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-normal">
          <Link 
            href="/watchlist" 
            className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 transition-colors text-sm md:text-base"
          >
            <span className="text-lg md:text-xl">★</span>
            <span className="font-medium">{watchlist.length}</span>
            <span className="hidden sm:inline">Watchlist</span>
          </Link>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-4 md:mb-6 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="🔍 Search coins..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm md:text-base"
          />
        </div>
        
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as keyof Coin)}
          className="px-3 py-2 md:px-4 md:py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm md:text-base"
        >
          <option value="market_cap_rank">Rank</option>
          <option value="name">Name (A-Z)</option>
          <option value="current_price">Price (High-Low)</option>
          <option value="price_change_percentage_24h">24h %</option>
          <option value="market_cap">Market Cap</option>
        </select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 mb-4 md:mb-6 rounded-lg">
          <div className="flex items-center">
            <svg className="h-4 w-4 md:h-5 md:w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="ml-2 text-xs md:text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {[...Array(coinsPerPage)].map((_, i) => (
            <div key={i} className="h-28 md:h-32 bg-gray-50 rounded-xl animate-pulse overflow-hidden">
              <div className="h-full flex flex-col p-3 md:p-4 gap-2 md:gap-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-1 md:space-y-2">
                    <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 md:h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-auto space-y-1 md:space-y-2">
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 md:h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : paginatedCoins.length === 0 ? (
        <div className="text-center py-8 md:py-12 bg-gray-50 rounded-xl">
          <svg className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-base md:text-lg font-medium text-gray-900">No coins found</h3>
          <p className="mt-1 text-xs md:text-sm text-gray-500">
            {debouncedSearch ? `No results for "${debouncedSearch}"` : "Failed to load coins"}
          </p>
          <div className="mt-4 md:mt-6">
            <button
              onClick={() => {
                setSearchTerm("");
                setError(null);
                setIsLoading(true);
                getTopCoins()
                  .then(setCoins)
                  .catch(err => setError('Failed to fetch coins'))
                  .finally(() => setIsLoading(false));
              }}
              className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 border border-transparent text-xs md:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-0.5 mr-1.5 h-4 w-4 md:-ml-1 md:mr-2 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Coin Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            {paginatedCoins.map((coin) => (
              <div
                key={coin.id}
                className="border rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white overflow-hidden"
              >
                <Link href={`/coin/${coin.id}`} className="block p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <img 
                        src={coin.image} 
                        alt={coin.name} 
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                        loading="lazy"
                      />
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-gray-900 text-sm md:text-base truncate">{coin.name}</h3>
                        <p className="text-xs md:text-sm text-gray-500">{coin.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded bg-gray-100 text-gray-800 shrink-0">
                      #{coin.market_cap_rank}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-base md:text-lg font-semibold">
                      {formatCurrency(coin.current_price)}
                    </p>
                    <p className={`text-xs md:text-sm ${
                      coin.price_change_percentage_24h >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {coin.price_change_percentage_24h?.toFixed(2) || 0}%
                    </p>
                  </div>
                </Link>
                
                <div className="border-t px-3 py-2 md:px-4 md:py-3 bg-gray-50 flex justify-between items-center">
                  <button
                    onClick={() => toggleWatchlist(coin.id)}
                    className={`flex items-center gap-1 text-xs md:text-sm ${
                      watchlist.includes(coin.id) 
                        ? "text-yellow-500 hover:text-yellow-600" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <span className="text-base md:text-lg">★</span>
                    <span className="hidden xs:inline">
                      {watchlist.includes(coin.id) ? "In Watchlist" : "Add to Watchlist"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 md:mt-6">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-1.5 py-1 md:px-2 md:py-2 rounded-l-md border border-gray-300 bg-white text-xs md:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = page <= 3 
                    ? i + 1 
                    : page >= totalPages - 2 
                      ? totalPages - 4 + i 
                      : page - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-2.5 py-1 md:px-4 md:py-2 border text-xs md:text-sm font-medium ${
                        page === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-1.5 py-1 md:px-2 md:py-2 rounded-r-md border border-gray-300 bg-white text-xs md:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}