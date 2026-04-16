import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
            className={`flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-100 active:scale-95 transition-transform ${park.color}`}
          >
            <div className="flex flex-col items-start">
              <span className="font-bold text-gray-900">{park.name}</span>
              <span className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                <MapPin size={12} /> {park.region}
              </span>
            </div>
            <span className="text-gray-400">➔</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
