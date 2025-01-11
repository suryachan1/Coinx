import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [bitcoinData, setBitcoinData] = useState(null);
  const [trendingCoins, setTrendingCoins] = useState([]);

  useEffect(() => {
    // Fetch Bitcoin Price Data
    const fetchBitcoinPrice = async () => {
      const res = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'bitcoin',
          vs_currencies: 'usd,inr',
          include_24hr_change: true,
        },
      });
      setBitcoinData(res.data.bitcoin);
    };

    // Fetch Trending Coins
    const fetchTrendingCoins = async () => {
      const res = await axios.get('https://api.coingecko.com/api/v3/search/trending');
      setTrendingCoins(res.data.coins.slice(0, 3));
    };

    fetchBitcoinPrice();
    fetchTrendingCoins();
  }, []);

  // Slick Carousel Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Bitcoin Price */}
      <section>
        <h2>Bitcoin Price</h2>
        {bitcoinData ? (
          <div>
            <p>USD: ${bitcoinData.usd}</p>
            <p>INR: ₹{bitcoinData.inr}</p>
            <p>24h Change: {bitcoinData.usd_24h_change.toFixed(2)}%</p>
          </div>
        ) : (
          <p>Loading Bitcoin Price...</p>
        )}
      </section>

      {/* TradingView Chart */}
      <section style={{ marginTop: '20px' }}>
        <h2>Bitcoin Chart</h2>
        <iframe
          src="https://www.tradingview.com/widgetembed/?symbol=BTCUSD"
          width="100%"
          height="500"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </section>

      {/* Trending Coins */}
      <section style={{ marginTop: '20px' }}>
        <h2>Trending Coins (24h)</h2>
        {trendingCoins.length > 0 ? (
          <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', padding: 0 }}>
            {trendingCoins.map((coin) => (
              <li key={coin.item.id} style={{ textAlign: 'center' }}>
                <img src={coin.item.small} alt={coin.item.name} width="50" />
                <p>{coin.item.name} ({coin.item.symbol.toUpperCase()})</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading Trending Coins...</p>
        )}
      </section>

      {/* You May Also Like Carousel */}
      <section style={{ marginTop: '20px' }}>
        <h2>You May Also Like</h2>
        <Slider {...sliderSettings}>
          {trendingCoins.map((coin) => (
            <div key={coin.item.id} style={{ padding: '10px', textAlign: 'center' }}>
              <img src={coin.item.small} alt={coin.item.name} width="50" />
              <p>{coin.item.name}</p>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
}
