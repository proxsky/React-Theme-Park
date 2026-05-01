import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import AdBanner from "./AdBanner";
import NativeAd from "./NativeAd";

// --- Weather Helper Functions & Component ---
const getWeatherIcon = (code) => {
  if (code === 0) return '☀️'; 
  if (code >= 1 && code <= 3) return '⛅'; 
  if (code >= 45 && code <= 48) return '🌫️'; 
  if (code >= 51 && code <= 67) return '🌧️'; 
  if (code >= 71 && code <= 77) return '❄️'; 
  if (code >= 80 && code <= 82) return '🌦️'; 
  if (code >= 85 && code <= 86) return '❄️'; 
  if (code >= 95) return '⛈️'; 
  return '🌡️'; 
};

function WeatherBanner({ region }) {
  const [weatherData, setWeatherData] = useState({ forecasts: [], loading: true });

  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherData({ forecasts: [], loading: true });
      
      // Set coordinates based on the selected region
      const coords = region === 'Florida' 
        ? { lat: 28.5383, lon: -81.3792 } // Orlando
        : { lat: 34.0522, lon: -118.2437 }; // Los Angeles
        
      // Fetching hourly data with UNIX timestamps for easy time comparison, fetching 2 days to prevent midnight cutoff issues
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,weather_code&temperature_unit=fahrenheit&timeformat=unixtime&forecast_days=2`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        
        const currentUnixTime = Math.floor(Date.now() / 1000);
        
        // Find the index in the hourly array that is closest to our current time
        // We subtract 3600 (1 hour in seconds) to ensure we grab the current active hour block
        let startIndex = data.hourly.time.findIndex(t => t >= currentUnixTime - 3600);
        if (startIndex === -1) startIndex = 0; // Fallback just in case
        
        const forecasts = [];
        
        // Loop 4 times starting from the current hour's index
        for (let i = 0; i < 5; i++) {
          const index = startIndex + i;
          
          if (index < data.hourly.time.length) {
            // Convert the UNIX timestamp back to a Javascript Date object
            const date = new Date(data.hourly.time[index] * 1000);
            
            // First item is labeled "Now", subsequent items show their respective hour (e.g., "2 PM")
            const timeLabel = i === 0 ? "Now" : date.toLocaleTimeString([], { hour: 'numeric' });
            
            forecasts.push({
              timeLabel,
              temp: Math.round(data.hourly.temperature_2m[index]),
              icon: getWeatherIcon(data.hourly.weather_code[index])
            });
          }
        }
        
        setWeatherData({ forecasts, loading: false });
      } catch (error) {
        console.error("Failed to fetch weather:", error);
        setWeatherData({ forecasts: [], loading: false });
      }
    };

    fetchWeather();
  }, [region]);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-blue-50 text-slate-800 border-b border-blue-100 shadow-sm rounded-lg mb-2">
      {weatherData.loading ? (
        <span className="text-sm font-medium animate-pulse text-slate-500">Fetching local weather...</span>
      ) : weatherData.forecasts.length > 0 ? (
        <div className="w-full flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-500 text-center uppercase tracking-wider">
            {region === 'Florida' ? 'Orlando Forecast' : 'Los Angeles Forecast'}
          </span>
          <div className="flex w-full items-center justify-evenly">
            {weatherData.forecasts.map((forecast, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-xs font-medium text-slate-600">{forecast.timeLabel}</span>
                <span className="text-3xl my-1" role="img" aria-label="weather icon">{forecast.icon}</span>
                <span className="text-sm font-bold text-slate-800">{forecast.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <span className="text-sm font-medium text-slate-500">Weather unavailable</span>
      )}
    </div>
  );
}
// --- End Weather Section ---

const PARKS = [
  { id: "magic-kingdom", name: "Magic Kingdom", region: "Florida", color: "bg-blue-100" },
  { id: "animal-kingdom", name: "Animal Kingdom", region: "Florida", color: "bg-blue-100" },
  { id: "epcot", name: "Epcot", region: "Florida", color: "bg-blue-100" },
  { id: "hollywood-studios", name: "Hollywood Studios", region: "Florida", color: "bg-blue-100" },
  { id: "universal-studios-florida", name: "Universal Studios FL", region: "Florida", color: "bg-blue-100" },
  { id: "islands-of-adventure", name: "Island of Adventure", region: "Florida", color: "bg-blue-100" },
  { id: "epic-universe", name: "Epic Universe", region: "Florida", color: "bg-blue-100" },
  { id: "disneyland", name: "Disneyland", region: "California", color: "bg-blue-100" },
  { id: "california-adventure", name: "Disney California Adventure", region: "California", color: "bg-blue-100" },
  { id: "universal-hollywood", name: "Universal Studios Hollywood", region: "California", color: "bg-blue-100" },
];

function Home() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState("Florida");
  const [parkHours, setParkHours] = useState({});

  useEffect(() => {
    fetch("https://m82b80pnt7.execute-api.us-east-2.amazonaws.com/parks")
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        if (data && Array.isArray(data.parks)) {
          data.parks.forEach((p) => {
            if (p.showTimes && p.showTimes.length) {
              const times = p.showTimes
                .map((t) => new Date(t))
                .filter((d) => !isNaN(d));

              if (times.length >= 4) {
                const earlyStart = times[0];
                const earlyEnd = times[1];
                const regularStart = times[2];
                const regularEnd = times[3];
                map[p.parkId] = {
                  early: { start: earlyStart.toISOString(), end: earlyEnd.toISOString() },
                  regular: { start: regularStart.toISOString(), end: regularEnd.toISOString() },
                };
              } else if (times.length === 2) {
                map[p.parkId] = {
                  early: null,
                  regular: { start: times[0].toISOString(), end: times[1].toISOString() },
                };
              } else if (times.length > 0) {
                const start = new Date(Math.min(...times.map((d) => d.getTime())));
                const end = new Date(Math.max(...times.map((d) => d.getTime())));
                map[p.parkId] = {
                  early: null,
                  regular: { start: start.toISOString(), end: end.toISOString() },
                };
              }
            }
          });
        }
        setParkHours(map);
      })
      .catch(() => {
        setParkHours({});
      });
  }, []);



  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      if (isNaN(d)) return "";
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="flex flex-col gap-1">
    
      {/* 4-Hour Weather Banner */}
      <WeatherBanner region={selectedRegion} />
       

      <div className="flex w-full gap-0 my-2">
        <button
          onClick={() => setSelectedRegion("Florida")}
          className={`flex-1 h-10 border border-gray-200 flex items-center justify-center text-sm font-medium ${
            selectedRegion === "Florida" ? "bg-blue-50" : "bg-white"
          } rounded-none`}
          aria-pressed={selectedRegion === "Florida"}
        >
          Florida
        </button>
        <button
          onClick={() => setSelectedRegion("California")}
          className={`flex-1 h-10 border border-gray-200 border-l-0 flex items-center justify-center text-sm font-medium ${
            selectedRegion === "California" ? "bg-blue-50" : "bg-white"
          } rounded-none`}
          aria-pressed={selectedRegion === "California"}
        >
          California
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {PARKS.filter((park) => !selectedRegion || park.region === selectedRegion).map((park) => (
            <button
              key={park.id}
              onClick={() => navigate(`/park/${park.id}`)}
              className={`flex items-center justify-between gap-4 p-4 rounded-xl shadow-sm border border-gray-100 active:scale-95 transition-transform ${park.color}`}
            >
            <div className="flex-1 min-w-0">
              <span className="font-bold text-gray-900 block leading-tight whitespace-normal break-words">{park.name}</span>
              <span className="text-xs text-gray-600 mt-1 flex items-center gap-1 justify-center w-full">
                <MapPin size={12} /> {park.region}
              </span>
            </div>
            <div className="flex flex-col items-end justify-center text-xs text-gray-600 mr-3 whitespace-nowrap">
              {parkHours[park.id] ? (
                <>
                  {parkHours[park.id].early ? (
                    <span className="leading-tight">
                      <span className="font-medium">Early</span>: {`${formatTime(
                        parkHours[park.id].early.start
                      )} - ${formatTime(parkHours[park.id].early.end)}`}
                    </span>
                  ) : null}
                  {parkHours[park.id].regular ? (
                    <span className="leading-tight">
                      <span className="font-medium">Regular</span>: {`${formatTime(
                        parkHours[park.id].regular.start
                      )} - ${formatTime(parkHours[park.id].regular.end)}`}
                    </span>
                  ) : null}
                </>
              ) : (
                <span>Hours unavailable</span>
              )}
            </div>
            <span className="text-gray-400">➔</span>
          </button>
        ))}
      </div>
      
    </div>
  );
}

export default Home;