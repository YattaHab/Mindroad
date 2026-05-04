import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../services/authService";

export default function Progress() {
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
      return;
    }

    const fetchUserProgress = async () => {
      try {
        const response = await api.get("/api/Users/progress");
        const data = response.data || [];

        const flattened = data.flatMap((track) =>
          (track.roadmaps || []).map((roadmap) => ({
            ...roadmap,
            trackId: track.trackId,
            trackName: track.trackName,
          })),
        );

        setUserProgress(flattened);
      } catch (err) {
        console.error("Progress fetch error:", err);
        setError("Failed to load your progress");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <section className="bg-gray-100 px-10 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sign in to see your progress
          </h2>
          <p className="text-gray-600 mb-8">
            Track your learning journey and continue where you left off!
          </p>
          <Link
            to="/signin"
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
          >
            Sign In →
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="bg-gray-100 px-10 py-20 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-100 px-10 py-20 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  if (!userProgress.length) {
    return (
      <section className="bg-gray-100 px-10 py-20 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Progress Yet
          </h2>
          <p className="text-gray-600 mb-8">
            Start your first track to see your learning progress here!
          </p>
          <Link
            to="/tracks"
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
          >
            Start Learning →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className=" px-10 py-5">
      <div className="flex gap-6 overflow-x-auto pb-4">
        {userProgress.map((item, index) => (
          <Link
            key={item.roadmapId || index}
            to={`/tracks/${item.trackId}/${item.roadmapId}`}
            className="flex flex-col bg-white rounded-2xl p-5 hover:shadow-lg transition duration-300 border border-gray-100 w-80 flex-shrink-0"
          >
            <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-1">
              {item.roadmapName || item.title || "Learning Path"}
            </h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
              {item.roadmapDescription ||
                item.description ||
                "Continue your learning journey"}
            </p>

            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="text-primary font-bold">
                  {item.percentage || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage || 0}%` }}
                />
              </div>
            </div>

            {item.lastTopicCompleted && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <p className="text-gray-400 text-xs">
                  Last: {item.lastTopicCompleted}
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
