import { Link } from "react-router-dom";

export default function TrackRoadmapsTab({
  track,
  trackId,
  roadmaps,
  loggedIn,
  isEnrolled,
  checkingEnrollment,
  enrollLoading,
  enrollError,
  onEnroll,
}) {
  return (
    <div>
      {/* Enroll banner */}
      {loggedIn && !isEnrolled && !checkingEnrollment && (
        <div className="bg-primary/5 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-primary text-sm font-medium">
            Enroll in this track to track your progress
          </p>
          <button
            onClick={onEnroll}
            disabled={enrollLoading}
            className="ml-4 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition flex-shrink-0 disabled:opacity-60"
          >
            {enrollLoading ? "Enrolling..." : "Enroll now"}
          </button>
        </div>
      )}

      {enrollError && (
        <p className="text-red-500 text-sm mb-4">{enrollError}</p>
      )}

      {/* Roadmap cards */}
      {roadmaps.map((roadmap) => (
        <Link
          key={roadmap.roadmapId}
          to={`/tracks/${trackId}/${roadmap.roadmapId}`}
          className="bg-gray-100 block mb-4 rounded-xl overflow-hidden hover:shadow-md transition duration-300"
        >
          <div className="flex gap-4 items-center">
            <img
              src={`https://mindroad.runasp.net/${track.trackIcon}`}
              alt={roadmap.roadmapName}
              className="w-44 h-28 object-cover flex-shrink-0"
            />
            <div className="py-3 pr-4">
              <h3 className="font-semibold text-xl">{roadmap.roadmapName}</h3>
              <p className="text-sm text-gray-500 mt-4">
                {roadmap.roadmapDescription}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
