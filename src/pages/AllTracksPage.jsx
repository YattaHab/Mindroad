import Navbar from "../components/Navbar";
import { useState } from "react";
import { Flame, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

import profile from "../assets/profile.jpg";

import { mockTracks } from "../data/mockTracks";

function AllTracksPage() {
  const [search, setSearch] = useState("");
  const filteredTracks = mockTracks.filter((track) =>
    track.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="bg-[#0a101d]">
        <Navbar
          isLoggedIn={false}
          user={{ name: "Toka Moustafa", image: profile }}
        />
        {/* hero */}
        <section className="py-20 px-10">
          <div className="text-[#ffb900] flex items-center gap-2 font-semibold">
            <Flame size={16} className="fill-[#ffb900]" />
            <h2 className="">{mockTracks.length} learning tracks available</h2>
          </div>
          <h1 className="text-5xl text-white mt-8 font-bold">
            Find Your Learning Track
          </h1>
          <p className="mt-8 text-gray-400 leading-relaxed">
            Expert-designed roadmaps covering the most in-demand CS skills.
            Start free, learn at <br /> your own pace.
          </p>
          {/* search */}
          <div className="bg-white/5 mt-10 flex gap-3 items-center px-5 py-4 border border-white/10 rounded-xl w-3/5">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search Tracks, skills, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent placeholder-gray-500 outline-none text-white"
            />
          </div>
        </section>{" "}
      </div>
      {/* tracks */}
      <section className="bg-gray-50 px-32 py-20 ">
        {/* text */}
        <h2 className="text-4xl font-bold mb-8">Available Tracks:</h2>
        <p className="text-primary font-semibold text-lg">
          Showing <span className="text-black">{filteredTracks.length}</span>{" "}
          tracks
        </p>
        {/* trackscards */}
        {filteredTracks.length > 0 ? (
          <div className="grid grid-cols-3 gap-10 mb-10 mt-8">
            {filteredTracks.map((track) => (
              <div
                key={track.track_id}
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
        ) : (
          <div className="text-center p-20">
            <p className="text-gray-500 text-ld font-semibold">
              No tracks found for "{search}"
            </p>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
export default AllTracksPage;
