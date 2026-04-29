import Navbar from "../components/Navbar";
import Container from "../assets/Container.png";
import Footer from "../components/Footer";
import { useParams, Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Play,
  Star,
  Users,
  FileText,
  Code,
  Award,
  Zap,
  Bookmark,
  SquareCheck,
  Square,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";
import { getCurrentUser, isLoggedIn } from "../services/authService";

////console

function RoadmapPage() {
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();
  const { trackId, roadmapId } = useParams();

  const [track, setTrack] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [levels, setLevels] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [openTopics, setOpenTopics] = useState({});
  const [completed, setCompleted] = useState({});
  const [bookmarked, setBookmarked] = useState({});

  //if (loading)
  // Load completed from localStorage
  // useEffect(() => {
  //   const saved = localStorage.getItem(`completed_${roadmapId}`);
  //   if (saved) {
  //     try {
  //       setCompleted(JSON.parse(saved));
  //     } catch {
  //       setCompleted({});
  //     }
  //   }
  // }, [roadmapId]);

  // Load user progress from the correct endpoint
  useEffect(() => {
    if (!loggedIn) return;

    api
      .get("/api/Users/progress")
      .then((res) => {
        const data = res.data;

        // Find progress for THIS roadmap
        const roadmapProgress = (data.items || data).find(
          (item) => item.roadmapId === parseInt(roadmapId),
        );

        if (roadmapProgress && roadmapProgress.completedTopics) {
          const completedMap = {};
          roadmapProgress.completedTopics.forEach((topicId) => {
            completedMap[topicId] = true;
          });
          setCompleted(completedMap);
        }
      })
      .catch((err) => console.error("progress fetch error", err));
  }, [roadmapId, loggedIn]);

  useEffect(() => {
    api
      .get("/api/Track")
      .then((res) => {
        const found = (res.data.items || res.data).find(
          (t) => t.trackId === parseInt(trackId),
        );
        setTrack(found || null);
      })
      .catch((err) => console.error("track fetch error", err));
  }, [trackId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get(`/api/roadmap/${roadmapId}`)
      .then((res) => {
        if (cancelled) return;
        const rm = res.data;
        setRoadmap(rm);
        setLevels(rm.levelResoponses || []);

        // Save enrollment when roadmap loads successfully
        if (loggedIn && trackId && roadmapId) {
          const enrolled = JSON.parse(
            localStorage.getItem("enrolledTracks") || "[]",
          );
          if (!enrolled.some((e) => e.roadmapId === parseInt(roadmapId))) {
            enrolled.push({
              trackId: parseInt(trackId),
              roadmapId: parseInt(roadmapId),
              startedAt: new Date().toISOString(),
            });
            localStorage.setItem("enrolledTracks", JSON.stringify(enrolled));
          }
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("Failed to load roadmap.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [roadmapId, trackId, loggedIn]);

  // useEffect(() => {
  //   api
  //     .get(`/api/roadmaps/reviews/${roadmapId}`)
  //     .then((res) => {
  //       const items = res.data.items || res.data;
  //       setReviews(items);
  //       if (items.length > 0) {
  //         const avg = items.reduce((sum, r) => sum + r.rate, 0) / items.length;
  //         setAvgRating(avg.toFixed(1));
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Reviews fetch error", err);
  //     });
  // }, [roadmapId]);

  // useEffect(() => {
  //   if (!loggedIn) return;
  //   api
  //     .get("/api/bookmarks")
  //     .then((res) => {
  //       const items = res.data.items || res.data;
  //       const map = {};
  //       items.forEach((b) => {
  //         map[b.resId] = true;
  //       });
  //       setBookmarked(map);
  //     })
  //     .catch((err) => {
  //       console.error("bookmark error", err);
  //     });
  // }, [loggedIn]);

  const isTopicDone = (topicId) => !!completed[topicId];

  const toggleTopic = (topicId) => {
    setOpenTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  // const toggleBookmark = async (resId) => {
  //   if (!loggedIn) {
  //     navigate("/signin");
  //     return;
  //   }
  //   const wasBookmarked = bookmarked[resId];
  //   setBookmarked((prev) => ({ ...prev, [resId]: !wasBookmarked }));
  //   try {
  //     if (wasBookmarked) {
  //       await api.delete(`/api/bookmarks/${resId}`);
  //     } else {
  //       await api.post(`/api/bookmarks/${resId}`);
  //     }
  //   } catch {
  //     setBookmarked((prev) => ({ ...prev, [resId]: wasBookmarked }));
  //   }
  // };

  //completed
  const toggleTopicDone = async (topicId) => {
    if (!loggedIn) return;
    if (completed[topicId]) return;

    console.log(`Completing topic: ${topicId} for user:`, user?.email);

    // Update UI immediately
    setCompleted((prev) => ({
      ...prev,
      [topicId]: true,
    }));

    try {
      // Try sending user info in the request body
      const response = await api.post(
        `/api/Progress/complete-topic/${topicId}`,
        {
          userId: user?.email,
          roadmapId: parseInt(roadmapId),
          completed: true,
        },
      );

      console.log("POST response:", response.status, response.data);

      // After successful POST, manually add to localStorage as backup
      const savedProgress = localStorage.getItem(
        `completed_${roadmapId}_${user?.email}`,
      );
      const progressMap = savedProgress ? JSON.parse(savedProgress) : {};
      progressMap[topicId] = true;
      localStorage.setItem(
        `completed_${roadmapId}_${user?.email}`,
        JSON.stringify(progressMap),
      );
    } catch (err) {
      console.error("Failed to complete topic:", err);
      console.error("Error details:", err.response?.data);

      // Rollback UI update on error
      setCompleted((prev) => ({
        ...prev,
        [topicId]: false,
      }));

      alert("Failed to save progress. Please try again.");
    }
  };

  // Totalprogress

  const totalTopics = levels.reduce(
    (n, l) => n + (l.topicResponses?.length || 0),
    0,
  );

  const completedCount = Object.keys(completed).length;

  const progress =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // if (error || !roadmap) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-[#030712]">
  //       <p className="text-red-400 text-lg">{error || "Roadmap not found."}</p>
  //     </div>
  //   );
  // }
  if (!roadmap) return null;

  const toggleBookmark = (resId) => {
    const next = { ...bookmarked, [resId]: !bookmarked[resId] };
    setBookmarked(next);
  };

  //completedCount
  return (
    <div>
      {/* Hero with track bg */}
      <div
        className="relative"
        style={{
          backgroundImage: `url(${track?.trackIcon})`,
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-black/50" />
        <div className="relative z-10">
          <Navbar isLoggedIn={loggedIn} user={user} />
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
            <div className="flex items-center font-semibold">
              <Star size={16} className="fill-[#ffb900] mr-2 text-[#ffb900]" />
              <h2 className="text-[#ffb900] mr-1">{avgRating ?? "—"}</h2>
              <p className="text-gray-300">({reviews.length} reviews)</p>
            </div>

            <h1 className="text-5xl text-white mt-8 font-bold">
              {roadmap.roadmapName}
            </h1>
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

            {/* Progress bar if logged in */}
            {loggedIn && totalTopics > 0 && (
              <div className="mt-6 max-w-sm">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Your progress</span>
                  <span className="text-primary font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Content */}
      <section className="py-20 px-10 gap-10 flex">
        {/* Left */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            {["overview", "resources"].map((tab) => (
              <button
                key={tab}
                className={`px-3 pb-3 text-sm font-medium capitalize transition duration-300 ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-bold mb-5">What you'll learn</h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  "Build responsive UIs with HTML, CSS & Tailwind",
                  "Create interactive SPAs with React & hooks",
                  "Work with databases and ORMs",
                  "Containerise apps with Docker",
                  "Master JavaScript ES6+ and async programming",
                  "Design and build REST APIs",
                  "Implement JWT authentication and OAuth",
                  "Deploy to cloud with CI/CD pipelines",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-center text-gray-600"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#10b981] flex-shrink-0" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <h2 className="text-2xl font-bold mb-5">Skills covered</h2>
              <div className="flex gap-3 flex-wrap mb-8">
                {[
                  "HTML/CSS",
                  "JavaScript",
                  "React",
                  "Node.js",
                  "PostgreSQL",
                  "REST APIs",
                  "Docker",
                  "CI/CD",
                ].map((skill) => (
                  <p
                    key={skill}
                    className="bg-gray-100 text-gray-600 py-2 px-3 rounded-2xl text-sm"
                  >
                    {skill}
                  </p>
                ))}
              </div>

              {/* Reviews */}
              {reviews.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-2xl font-bold mb-5">
                    Student Reviews{" "}
                    <span className="ml-2 text-yellow-500 text-xl font-normal">
                      ⭐ {avgRating}
                    </span>
                  </h2>
                  <div className="flex flex-col gap-4">
                    {reviews.slice(0, 4).map((review) => (
                      <div
                        key={review.revId}
                        className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">
                            {review.username || "Learner"}
                          </p>
                          <p className="text-yellow-500">
                            {"⭐".repeat(review.rate)}
                          </p>
                        </div>
                        {review.content && (
                          <p className="text-gray-500 text-sm">
                            {review.content}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Resources tab */}
          {activeTab === "resources" && (
            <div>
              {levels.length === 0 && (
                <p className="text-gray-400">No content available yet.</p>
              )}
              {levels.map((level, lIndex) => (
                <div key={lIndex} className="mb-8">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">
                    {level.levelName}
                  </h2>
                  {(level.topicResponses || []).map((topic) => {
                    const topicId = topic.topicId;
                    const isOpen = !!openTopics[topicId];
                    const resources = Array.isArray(topic.resources)
                      ? topic.resources
                      : [];
                    return (
                      <div key={topicId} className="mb-3">
                        <div className="bg-gray-100 rounded-xl overflow-hidden">
                          <div
                            className="flex justify-between items-center cursor-pointer px-4 py-4"
                            onClick={() => toggleTopic(topicId)}
                          >
                            <span className="font-semibold text-gray-800">
                              {topic.topicName}
                            </span>
                            <div className="flex gap-3 items-center">
                              {loggedIn && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTopicDone(topic.topicId);
                                  }}
                                  title={
                                    isTopicDone(topic.topicId)
                                      ? "Completed"
                                      : "Mark as complete"
                                  }
                                >
                                  {isTopicDone(topic.topicId) ? (
                                    <SquareCheck
                                      size={20}
                                      className="fill-primary text-primary"
                                    />
                                  ) : (
                                    <Square
                                      size={20}
                                      className="text-gray-400"
                                    />
                                  )}
                                </button>
                              )}
                              <Link
                                to={`/tracks/${trackId}/${roadmapId}/${topicId}/comments`}
                                onClick={(e) => e.stopPropagation()}
                                title="Discussion"
                              >
                                <MessageCircle
                                  size={20}
                                  className="text-gray-400 hover:text-primary transition"
                                />
                              </Link>
                            </div>
                          </div>

                          <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              isOpen
                                ? "max-h-[1000px] opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="border-t border-gray-200 px-4 py-3">
                              {resources.length === 0 ? (
                                <p className="text-gray-400 text-sm py-2">
                                  No resources yet.
                                </p>
                              ) : (
                                resources.map((res) => {
                                  return (
                                    <div
                                      key={res.resourceId}
                                      className="flex justify-between items-center mb-3 mt-2"
                                    >
                                      <a
                                        href={
                                          res.rsourceUrl?.startsWith("http")
                                            ? res.rsourceUrl
                                            : `https://${res.rsourceUrl}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm flex items-center gap-2"
                                      >
                                        {res.resourceName}

                                        {res.paid && (
                                          <span className="text-xs bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded">
                                            Pro
                                          </span>
                                        )}
                                      </a>

                                      <div className="flex gap-3 items-center">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleBookmark(res.resourceId);
                                          }}
                                        >
                                          <Bookmark
                                            size={18}
                                            className={
                                              bookmarked[res.resourceId]
                                                ? "fill-primary text-primary"
                                                : "text-gray-400"
                                            }
                                          />
                                        </button>

                                        {loggedIn && (
                                          <button
                                            hidden
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleTopicDone(topic.topicId);
                                            }}
                                          >
                                            {completed[topic.topicId] ? (
                                              <SquareCheck
                                                size={18}
                                                className="text-primary fill-primary"
                                              />
                                            ) : (
                                              <Square
                                                size={18}
                                                className="text-gray-400"
                                              />
                                            )}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-72 flex-shrink-0">
          <div className="rounded-2xl shadow-xl overflow-hidden sticky top-6 border border-gray-100">
            {track?.trackIcon && (
              <img
                src={Container}
                alt={track?.trackName}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-5">
              <h1 className="text-2xl font-bold mb-1">
                Free{" "}
                <span className="text-sm font-normal text-gray-500">
                  to start
                </span>
              </h1>
              <p className="text-gray-400 text-sm mb-5">
                Pro features from $19/mo
              </p>

              <div className="flex flex-col gap-3 mb-5">
                {loggedIn ? (
                  <Link
                    to={`/tracks/${trackId}/${roadmapId}/learn`}
                    className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl text-center hover:opacity-90 transition"
                  >
                    Continue Learning →
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl text-center hover:opacity-90 transition"
                  >
                    Get Started for Free →
                  </Link>
                )}
                <Link
                  to="/pricing"
                  className="w-full py-3 px-4 bg-gray-50 text-gray-700 font-semibold rounded-xl text-center hover:bg-gray-100 transition border border-gray-200 text-sm"
                >
                  View Pro Plan
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Play size={14} className="text-gray-400" />
                  <p>Self-paced video lessons</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Code size={14} className="text-gray-400" />
                  <p>Real-world projects</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award size={14} className="text-gray-400" />
                  <p>Certificate of completion</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap size={14} className="text-gray-400" />
                  <p>Lifetime access</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText size={14} className="text-gray-400" />
                  <p>Lesson notes & resources</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default RoadmapPage;
