// app/coin/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getCoinDetails } from '../../../lib/api';
import PriceChart from '../../../components/PriceChart';
import Link from 'next/link';
import LoadingSpinner from '../../../components/LoadingSpinner';
import {use} from 'react'

export default function CoinDetailPage({ params }: { params: Promise<{ id: string }>  }) {
  const [coin, setCoin] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('7');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const { id } = use(params);

  useEffect(() => {
    const storedWatchlist = localStorage.getItem('watchlist');
    if (storedWatchlist) {
      setWatchlist(JSON.parse(storedWatchlist));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coinData, chart] = await Promise.all([
          getCoinDetails(id),
          fetchChartData(id, timeRange)
        ]);
        setCoin(coinData);
        setChartData(chart);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, timeRange]);

  const fetchChartData = async (id: string, days: string) => {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      { next: { revalidate: 60 } }
    );
    
    if (!res.ok) throw new Error('Failed to fetch chart data');
    
    const json = await res.json();
    return json.prices.map(([timestamp, price]: [number, number]) => ({
      time: new Date(timestamp),
      price: parseFloat(price.toFixed(2)),
    }));
  };

  const toggleWatchlist = () => {
    const updated = watchlist.includes(id)
      ? watchlist.filter(id => id !== id)
      : [...watchlist, id];
    
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorPage error={error} />;
  if (!coin) return <CoinNotFound id={id} />;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-blue-600 hover:underline flex items-center">
          ← Back to all coins
        </Link>
        <button
          onClick={toggleWatchlist}
          className={`flex items-center gap-2 ${watchlist.includes(id) ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
        >
          <span className="text-xl">★</span>
          <span>{watchlist.includes(id) ? 'In Watchlist' : 'Add to Watchlist'}</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex items-center gap-4">
          <img src={coin.image.large} alt={coin.name} className="w-16 h-16" />
          <div>
            <h1 className="text-3xl font-bold">
              {coin.name} <span className="text-gray-500">({coin.symbol.toUpperCase()})</span>
            </h1>
            <p className="text-2xl font-semibold">
              ${coin.market_data.current_price.usd.toLocaleString()}
              <span className={`text-sm ml-2 ${
                coin.market_data.price_change_percentage_24h >= 0 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {coin.market_data.price_change_percentage_24h?.toFixed(2) || 0}%
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CoinStatsCard coin={coin} />
        <MarketDataCard coin={coin} />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Price Chart</h2>
          <div className="flex gap-2">
            {['1', '7', '30', '90'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {range === '1' ? '24H' : `${range}D`}
              </button>
            ))}
          </div>
        </div>
        <PriceChart data={chartData} />
      </div>

      {coin.description?.en && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">About {coin.name}</h2>
          <div 
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
        </div>
      )}
    </div>
  );
}

function CoinStatsCard({ coin }: { coin: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Coin Stats</h2>
      <div className="space-y-3">
        <StatItem label="Market Cap" value={`$${coin.market_data.market_cap.usd.toLocaleString()}`} />
        <StatItem label="24h Trading Volume" value={`$${coin.market_data.total_volume.usd.toLocaleString()}`} />
        <StatItem label="Circulating Supply" value={`${coin.market_data.circulating_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`} />
        <StatItem label="Total Supply" value={coin.market_data.total_supply ? `${coin.market_data.total_supply.toLocaleString()} ${coin.symbol.toUpperCase()}` : 'N/A'} />
        <StatItem label="All Time High" value={`$${coin.market_data.ath.usd.toLocaleString()}`} />
        <StatItem label="All Time Low" value={`$${coin.market_data.atl.usd.toLocaleString()}`} />
      </div>
    </div>
  );
}

function MarketDataCard({ coin }: { coin: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Market Data</h2>
      <div className="space-y-3">
        <StatItem label="Market Cap Rank" value={`#${coin.market_cap_rank}`} />
        <StatItem label="24h High" value={`$${coin.market_data.high_24h.usd.toLocaleString()}`} />
        <StatItem label="24h Low" value={`$${coin.market_data.low_24h.usd.toLocaleString()}`} />
        <StatItem label="Price Change (24h)" value={`${coin.market_data.price_change_24h.toFixed(2)}%`} />
        <StatItem label="Price Change (7d)" value={`${coin.market_data.price_change_percentage_7d.toFixed(2)}%`} />
        <StatItem label="Price Change (30d)" value={`${coin.market_data.price_change_percentage_30d.toFixed(2)}%`} />
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function CoinNotFound({ id }: { id: string }) {
  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Coin Not Found</h1>
      <p className="text-gray-600 mb-6">We couldn't find a coin with ID: {id}</p>
      <Link href="/" className="text-blue-600 hover:underline">
        ← Return to all coins
      </Link>
    </div>
  );
}

function ErrorPage({ error }: { error: string }) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Error Loading Coin Data</h1>
      <p className="text-gray-600 mb-6">{error}</p>
      <Link href="/" className="text-blue-600 hover:underline">
        ← Return to all coins
      </Link>
    </div>
  );
}