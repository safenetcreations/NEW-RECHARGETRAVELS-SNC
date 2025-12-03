import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Sunrise,
  Sunset,
  Eye,
  Loader2,
  RefreshCw,
  MapPin,
  AlertCircle
} from 'lucide-react';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  description: string;
  icon: string;
  visibility: number;
  pressure: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  name: string;
}

interface ForecastDay {
  date: string;
  day: string;
  temp_max: number;
  temp_min: number;
  icon: string;
  description: string;
}

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
  locationName: string;
  apiKey?: string;
}

// Weather icon mapping
const getWeatherIcon = (iconCode: string, size: string = 'w-12 h-12') => {
  const iconMap: Record<string, React.ReactNode> = {
    '01d': <Sun className={`${size} text-yellow-500`} />,
    '01n': <Sun className={`${size} text-yellow-400`} />,
    '02d': <Cloud className={`${size} text-gray-400`} />,
    '02n': <Cloud className={`${size} text-gray-500`} />,
    '03d': <Cloud className={`${size} text-gray-500`} />,
    '03n': <Cloud className={`${size} text-gray-600`} />,
    '04d': <Cloud className={`${size} text-gray-600`} />,
    '04n': <Cloud className={`${size} text-gray-700`} />,
    '09d': <CloudRain className={`${size} text-blue-500`} />,
    '09n': <CloudRain className={`${size} text-blue-600`} />,
    '10d': <CloudRain className={`${size} text-blue-400`} />,
    '10n': <CloudRain className={`${size} text-blue-500`} />,
    '11d': <CloudLightning className={`${size} text-purple-500`} />,
    '11n': <CloudLightning className={`${size} text-purple-600`} />,
    '13d': <CloudSnow className={`${size} text-blue-200`} />,
    '13n': <CloudSnow className={`${size} text-blue-300`} />,
    '50d': <CloudFog className={`${size} text-gray-400`} />,
    '50n': <CloudFog className={`${size} text-gray-500`} />,
  };
  return iconMap[iconCode] || <Sun className={`${size} text-yellow-500`} />;
};

// Wind direction to compass
const getWindDirection = (deg: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

// Format time from unix timestamp
const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Demo weather data (used when no API key)
const getDemoWeatherData = (locationName: string): WeatherData => ({
  temp: 28 + Math.random() * 5,
  feels_like: 30 + Math.random() * 3,
  humidity: 70 + Math.random() * 15,
  wind_speed: 8 + Math.random() * 7,
  wind_deg: Math.random() * 360,
  description: 'Partly Cloudy',
  icon: '02d',
  visibility: 10000,
  pressure: 1013,
  clouds: 25,
  sunrise: Math.floor(Date.now() / 1000) - 21600,
  sunset: Math.floor(Date.now() / 1000) + 21600,
  name: locationName
});

const getDemoForecast = (): ForecastDay[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i + 1);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      day: days[date.getDay()],
      temp_max: 28 + Math.random() * 6,
      temp_min: 22 + Math.random() * 4,
      icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)],
      description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)]
    };
  });
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  latitude,
  longitude,
  locationName,
  apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchWeather = async () => {
    setIsLoading(true);
    setError(null);

    // If no API key, use demo data
    if (!apiKey) {
      setWeather(getDemoWeatherData(locationName));
      setForecast(getDemoForecast());
      setLastUpdated(new Date());
      setIsLoading(false);
      setIsDemo(true);
      return;
    }

    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const weatherData = await weatherResponse.json();

      setWeather({
        temp: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        wind_speed: weatherData.wind.speed * 3.6, // Convert m/s to km/h
        wind_deg: weatherData.wind.deg,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        visibility: weatherData.visibility,
        pressure: weatherData.main.pressure,
        clouds: weatherData.clouds.all,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        name: weatherData.name
      });

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();

        // Process forecast - get one entry per day
        const dailyForecasts: ForecastDay[] = [];
        const processedDates = new Set<string>();

        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          if (!processedDates.has(dateStr) && dailyForecasts.length < 5) {
            processedDates.add(dateStr);
            dailyForecasts.push({
              date: dateStr,
              day: date.toLocaleDateString('en-US', { weekday: 'short' }),
              temp_max: item.main.temp_max,
              temp_min: item.main.temp_min,
              icon: item.weather[0].icon,
              description: item.weather[0].description
            });
          }
        });

        setForecast(dailyForecasts);
      }

      setLastUpdated(new Date());
      setIsDemo(false);
    } catch (err) {
      console.error('Weather fetch error:', err);
      // Fallback to demo data
      setWeather(getDemoWeatherData(locationName));
      setForecast(getDemoForecast());
      setLastUpdated(new Date());
      setIsDemo(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [latitude, longitude, apiKey]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-8 text-white flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-8 text-white flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>Unable to load weather data</p>
          <button
            onClick={fetchWeather}
            className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Demo Mode Badge */}
      {isDemo && (
        <div className="absolute top-4 right-4 bg-amber-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Demo Data
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold">{locationName}</span>
          </div>
          <button
            onClick={fetchWeather}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Refresh weather"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Current Weather */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {getWeatherIcon(weather.icon, 'w-20 h-20')}
            <div>
              <div className="text-5xl font-bold">{Math.round(weather.temp)}°C</div>
              <div className="text-white/80 capitalize">{weather.description}</div>
            </div>
          </div>
          <div className="text-right text-sm text-white/70">
            <div>Feels like {Math.round(weather.feels_like)}°C</div>
            {lastUpdated && (
              <div className="mt-1">
                Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-200" />
            <div className="text-lg font-semibold">{Math.round(weather.humidity)}%</div>
            <div className="text-xs text-white/70">Humidity</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Wind className="w-5 h-5 mx-auto mb-1 text-blue-200" />
            <div className="text-lg font-semibold">{Math.round(weather.wind_speed)} km/h</div>
            <div className="text-xs text-white/70">{getWindDirection(weather.wind_deg)} Wind</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Sunrise className="w-5 h-5 mx-auto mb-1 text-amber-300" />
            <div className="text-lg font-semibold">{formatTime(weather.sunrise)}</div>
            <div className="text-xs text-white/70">Sunrise</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Sunset className="w-5 h-5 mx-auto mb-1 text-orange-300" />
            <div className="text-lg font-semibold">{formatTime(weather.sunset)}</div>
            <div className="text-xs text-white/70">Sunset</div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 text-white/80">5-Day Forecast</h4>
            <div className="grid grid-cols-5 gap-2">
              {forecast.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 rounded-xl p-3 text-center hover:bg-white/15 transition-colors"
                >
                  <div className="text-xs font-semibold mb-1">{day.day}</div>
                  <div className="text-[10px] text-white/60 mb-2">{day.date}</div>
                  {getWeatherIcon(day.icon, 'w-8 h-8 mx-auto')}
                  <div className="mt-2">
                    <span className="text-sm font-semibold">{Math.round(day.temp_max)}°</span>
                    <span className="text-xs text-white/60 ml-1">{Math.round(day.temp_min)}°</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {(weather.visibility / 1000).toFixed(1)} km visibility
            </span>
            <span className="flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              {weather.clouds}% clouds
            </span>
          </div>
          <span>{weather.pressure} hPa</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
