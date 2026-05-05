import { Link } from "react-router-dom";
import { BookOpen, Clock, Star, Users, CheckCircle } from "lucide-react";

export default function TrackHero({
  track,
  trackId,
  filteredRoadmaps,
  loggedIn,
  isEnrolled,
}) {
  return (
    <div
      className="relative"
      style={{
        backgroundImage: `url(https://mindroad.runasp.net/${track.trackIcon})`,
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-black/80" />
      <div className="relative z-10">
        <section className="py-20 px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-gray-300 font-semibold mb-8">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <p>{">"}</p>
            <Link to="/tracks" className="hover:text-white">
              Tracks
            </Link>
            <p>{">"}</p>
            <p>{track.trackName}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center font-semibold">
            <Star size={16} className="fill-[#ffb900] mr-2 text-[#ffb900]" />
            <h2 className="text-[#ffb900] mr-1">4.9</h2>
            <p className="text-gray-300">(1,240 reviews)</p>
          </div>

          {/* Title */}
          <h1 className="text-5xl text-white mt-8 font-bold">
            {track.trackName}
          </h1>

          {/* Description */}
          <p className="mt-8 text-gray-300 leading-relaxed w-1/2">
            {track.trackDescription}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-8">
            <div className="text-gray-400 flex items-center gap-2">
              <Clock size={16} />
              <p>6 months</p>
            </div>
            <div className="text-gray-400 flex items-center gap-2">
              <BookOpen size={16} />
              <p>
                {filteredRoadmaps.length} roadmap
                {filteredRoadmaps.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-gray-400 flex items-center gap-2">
              <Users size={16} />
              <p>12,400 enrolled</p>
            </div>
          </div>

          {/* Enrolled badge */}
          {loggedIn && isEnrolled && (
            <div className="mt-6 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl">
              <CheckCircle size={16} />
              <span className="font-semibold text-sm">
                You're enrolled in this track
              </span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
