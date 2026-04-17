import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { mockTracks } from "../data/mockTracks";

export default function FeaturedTracks() {
  return (
    <section className="bg-gray-100 px-10 py-5">
      {/* title */}
      <p className="text-primary text-sm font-semibold mb-3">LEARNING TRACKS</p>
      <div className="flex justify-between mb-8">
        <h1 className="font-bold text-4xl">Popular tracks:</h1>
        <Link
          to="/tracks"
          className="flex items-center gap-2 text-primary text-sm font-medium"
        >
          View all tracks
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* tracks */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {mockTracks.map((track) => (
          <div
            key={track.id}
            className="bg-white rounded-xl overflow-hidden flex flex-col h-full"
          >
            {/* card top */}
            <img
              src={track.icon_url}
              alt={track.name}
              className="w-full h-40 object-cover"
            />
            {/* content */}
            <div className="p-4 flex flex-col gap-3 flex-1">
              <h2 className="font-bold text-lg">{track.name}</h2>
              <p className="text-gray-500 text-sm flex-1 leading-relaxed">
                {track.description}
              </p>
              <Link
                to={`/tracks/${track.track_id}`}
                className="bg-primary text-white font-semibold py-2 rounded-lg text-center hover:opacity-90 transition duration-300"
              >
                Start Track
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
