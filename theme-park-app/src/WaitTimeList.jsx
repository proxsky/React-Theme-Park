import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';

function WaitTimeList() {
  const { parkId } = useParams();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('ATTRACTION');

  useEffect(() => {
    // Fetch live ride data from your API Gateway endpoint.
    const controller = new AbortController();
    const fetchUrl = `https://ag4akx3m4a.execute-api.us-east-2.amazonaws.com/rides/${parkId}`;
    setLoading(true);

    fetch(fetchUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // API should return an array of rides. If it returns an object, adapt accordingly.
        if (Array.isArray(data)) setRides(data);
        else if (data && Array.isArray(data.rides)) setRides(data.rides);
        else setRides([]);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Failed to fetch rides:', err);
        setRides([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [parkId]);

  // Helper function for color-coding wait times
  const getWaitTimeColor = (time) => {
    if (time <= 20) return 'bg-green-100 text-green-800 border-green-200';
    if (time <= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const displayedRides = rides.filter((r) => !entityFilter || r.entityType === entityFilter);

  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-blue-600 font-medium mb-2 active:opacity-70"
      >
        <ArrowLeft size={20} /> Back to Parks
      </button>

      <h2 className="text-xl font-bold text-gray-800 capitalize">
        {parkId.replace(/-/g, ' ')}
      </h2>

      <div className="flex w-full gap-0 my-2">
        <button
          onClick={() => setEntityFilter((p) => (p === 'ATTRACTION' ? null : 'ATTRACTION'))}
          className={`flex-1 h-10 border border-gray-200 flex items-center justify-center text-sm font-medium ${
            entityFilter === 'ATTRACTION' ? 'bg-blue-50' : 'bg-white'
          } rounded-none`}
          aria-pressed={entityFilter === 'ATTRACTION'}
        >
          Attractions
        </button>
        <button
          onClick={() => setEntityFilter((p) => (p === 'SHOW' ? null : 'SHOW'))}
          className={`flex-1 h-10 border border-gray-200 border-l-0 flex items-center justify-center text-sm font-medium ${
            entityFilter === 'SHOW' ? 'bg-blue-50' : 'bg-white'
          } rounded-none`}
          aria-pressed={entityFilter === 'SHOW'}
        >
          Shows
        </button>
        <button
          onClick={() => setEntityFilter((p) => (p === 'RESTAURANT' ? null : 'RESTAURANT'))}
          className={`flex-1 h-10 border border-gray-200 border-l-0 flex items-center justify-center text-sm font-medium ${
            entityFilter === 'RESTAURANT' ? 'bg-blue-50' : 'bg-white'
          } rounded-none`}
          aria-pressed={entityFilter === 'RESTAURANT'}
        >
          Restaurants
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-8 animate-pulse">Loading live data...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {displayedRides.map((ride) => {
            const isOpen = ride.status === 'OPERATING';
            const wait = typeof ride.waitTime === 'number' ? ride.waitTime : 0;
            return (
              <div
                key={ride.rideId || ride.id}
                className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
              >
                <div className="flex flex-col items-start">
                  <span className={`font-medium ${!isOpen ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {ride.name}
                  </span>
                  {ride.lastUpdated && (
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(ride.lastUpdated).toLocaleString()}
                    </span>
                  )}
                </div>

                {ride.entityType === 'SHOW' ? (
                  <div className="flex flex-col items-end">
                    <div className="flex flex-wrap gap-2 justify-end">
                      {ride.showTimes && ride.showTimes.length ? (
                        ride.showTimes.map((st, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {new Date(st).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No show times</span>
                      )}
                    </div>
                    <span className={`text-xs mt-1 ${ride.status === 'OPERATING' ? 'text-green-700' : 'text-red-700'}`}>
                      {ride.status}
                    </span>
                  </div>
                ) : isOpen ? (
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-bold ${getWaitTimeColor(wait)}`}>
                    <Clock size={14} />
                    {wait} min
                  </div>
                ) : (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gray-100 ${ride.status === 'OPERATING' ? 'text-green-700' : 'text-red-700'}`}>
                    {ride.status}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WaitTimeList;