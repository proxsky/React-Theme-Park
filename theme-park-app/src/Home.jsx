import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

const PARKS = [
  {
    id: "magic-kingdom",
    name: "Magic Kingdom",
    region: "Florida",
    color: "bg-blue-100",
  },
  {
    id: "animal-kingdom",
    name: "Animal Kingdom",
    region: "Florida",
    color: "bg-blue-100",
  },
  { id: "epcot", name: "Epcot", region: "Florida", color: "bg-blue-100" },
  {
    id: "hollywood-studios",
    name: "Hollywood Studios",
    region: "Florida",
    color: "bg-blue-100",
  },
  {
    id: "universal-studios-florida",
    name: "Universal Studios FL",
    region: "Florida",
    color: "bg-purple-100",
  },
  {
    id: "islands-of-adventure",
    name: "Island of Adventure",
    region: "Florida",
    color: "bg-purple-100",
  },
  {
    id: "epic-universe",
    name: "Epic Universe",
    region: "Florida",
    color: "bg-purple-100",
  },
  {
    id: "disneyland",
    name: "Disneyland",
    region: "California",
    color: "bg-red-100",
  },
  {
    id: "california-adventure",
    name: "Disney California Adventure",
    region: "California",
    color: "bg-red-100",
  },
  {
    id: "universal-hollywood",
    name: "Universal Studios Hollywood",
    region: "California",
    color: "bg-yellow-100",
  },
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
    <div className="flex flex-col gap-4">
      {/* <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Select a Park
      </h2> */}

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
