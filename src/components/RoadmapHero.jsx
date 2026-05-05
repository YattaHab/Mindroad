import { Link } from "react-router-dom";
import { BookOpen, Clock, Star, Users } from "lucide-react";

export default function RoadmapHero({
  track,
  trackId,
  roadmap,
  levels,
  reviews,
  avgRating,
  loggedIn,
  totalTopics,
  completedCount,
  progress,
}) {
  return (
    <div
      className="relative"
      style={{
        backgroundImage: `url(https://mindroad.runasp.net/${track?.trackIcon})`,
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
            <Link to={`/tracks/${trackId}`} className="hover:text-white">
              {track?.trackName}
            </Link>
            <p>{">"}</p>
            <p>{roadmap.roadmapName}</p>
          </div>

          {/* Rating */}
          {avgRating && (
            <div className="flex items-center font-semibold mb-4">
              <Star size={16} className="fill-[#ffb900] mr-2 text-[#ffb900]" />
              <h2 className="text-[#ffb900] mr-1">{avgRating}</h2>
              <p className="text-gray-300">({reviews.length} reviews)</p>
            </div>
          )}

          {/* Title */}
          <h1 className="text-5xl text-white mt-8 font-bold">
            {roadmap.roadmapName}
          </h1>

          {/* Description */}
          <p className="mt-8 text-gray-300 leading-relaxed w-1/2">
            {roadmap.roadmapDescription}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-8">
            <div className="text-gray-400 flex items-center gap-2">
              <Clock size={16} />
              <p>Self-paced</p>
            </div>
            <div className="text-gray-400 flex items-center gap-2">
              <BookOpen size={16} />
              <p>{totalTopics} topics</p>
            </div>
            <div className="text-gray-400 flex items-center gap-2">
              <Users size={16} />
              <p>{levels.length} levels</p>
            </div>
          </div>

          {/* Progress bar */}
          {loggedIn && totalTopics > 0 && (
            <div className="mt-6 max-w-sm">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">
                  Your progress — {completedCount}/{totalTopics} topics
                </span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
