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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { getCurrentUser, isLoggedIn } from "../services/authService";
import StarRating from "../components/StarRating";

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

  //topics
  const [completed, setCompleted] = useState({});
  const [completingTopic, setCompletingTopic] = useState(null);

  const [progressLastTopic, setProgressLastTopic] = useState("");

  //bookmarks
  const [bookmarked, setBookmarked] = useState({});
  const [bookmarkLoading, setBookmarkLoading] = useState({});

  //review
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRate, setReviewRate] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  //fetch track
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

  //fetch roadmap
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
  }, [roadmapId]);

  //fetch progress
  useEffect(() => {
    if (!loggedIn) return;

    api
      .get(`/api/Progress/roadmap/${roadmapId}`)
      .then((res) => {
        console.log("FULL PROGRESS RESPONSE:", res.data);
        const data = res.data.result;
        setProgressLastTopic(data.lastTopicCompleted);
        console.log("PROGRESS RESULT:", data);
        const completedMap = {};

        if (data && Array.isArray(data.completedTopics)) {
          data.completedTopics.forEach((id) => {
            completedMap[Number(id)] = true;
          });
        }

        setCompleted(completedMap);
      })
      .catch((err) => {
        if (err.response?.status !== 404) {
          console.error("progress fetch error", err);
        }
      });
  }, [loggedIn, roadmapId]);

  //fetch bookmarks
  useEffect(() => {
    if (!loggedIn) return;

    api
      .get("/api/Bookmarks?page=1&pageSize=100")
      .then((res) => {
        const items = res.data.items || res.data || [];
        const map = {};
        items.forEach((item) => {
          const id = item.resId ?? item.resourceId;
          if (id != null) map[id] = true;
        });
        setBookmarked(map);
      })
      .catch((err) => console.error("bookmarks fetch error", err));
  }, [loggedIn]);

  //fetch reviews
  const fetchReviews = useCallback(() => {
    api
      .get(`/api/Roadmap/${roadmapId}/reviews?page=1&pageSize=20`)
      .then((res) => {
        const items = res.data.items || res.data || [];
        setReviews(items);
        if (items.length > 0) {
          const avg =
            items.reduce((sum, r) => sum + (r.rate || 0), 0) / items.length;
          setAvgRating(avg.toFixed(1));
        }
      })
      .catch((err) => console.error("reviews fetch error", err));
  }, [roadmapId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  //topic done
  const toggleTopicDone = async (topicId) => {
    if (!loggedIn || completingTopic === topicId) return;
    setCompletingTopic(topicId);
    const wasDone = !!completed[topicId];

    setCompleted((prev) => ({
      ...prev,
      [topicId]: !wasDone,
    }));

    try {
      if (wasDone) {
        await api.delete(`/api/Progress/complete-topic/${topicId}`);
      } else {
        await api.post(`/api/Progress/complete-topic/${topicId}`);
      }
    } catch (err) {
      console.error("toggle topic error", err);
      // Rollback
      setCompleted((prev) => ({ ...prev, [topicId]: wasDone }));
    } finally {
      setCompletingTopic(null);
    }
  };

  //toggle bookmark
  const toggleBookmark = async (resourceId) => {
    if (!loggedIn || bookmarkLoading[resourceId]) return;

    setBookmarkLoading((prev) => ({ ...prev, [resourceId]: true }));
    const wasBookmarked = !!bookmarked[resourceId];

    // Optimistic update
    setBookmarked((prev) => ({ ...prev, [resourceId]: !wasBookmarked }));

    try {
      if (wasBookmarked) {
        await api.delete(`/api/Bookmarks/${resourceId}`);
      } else {
        await api.post(`/api/Bookmarks/${resourceId}`);
      }
    } catch (err) {
      console.error("bookmark toggle error", err);
      // Rollback
      setBookmarked((prev) => ({ ...prev, [resourceId]: wasBookmarked }));
    } finally {
      setBookmarkLoading((prev) => ({ ...prev, [resourceId]: false }));
    }
  };

  //submit review
  const handleSubmitReview = async () => {
    if (!reviewRate) {
      setReviewError("Please select a rating.");
      return;
    }
    setReviewError(null);
    setSubmittingReview(true);
    try {
      await api.post(`/api/Roadmap/${roadmapId}/reviews`, {
        content: reviewContent,
        rate: reviewRate,
      });
      setReviewSuccess(true);
      setReviewContent("");
      setReviewRate(0);
      fetchReviews(); // refresh
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to submit review.";

      setReviewError(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  //values

  const totalTopics = levels.reduce(
    (n, l) => n + (l.topicResponses?.length || 0),
    0,
  );

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const toggleTopic = (topicId) => {
    setOpenTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const isTopicDone = (topic) => {
    return completed[topic.topicId];
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading</p>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{error || "Roadmap not found"}</p>
      </div>
    );
  }
  //map
  return (
    <div>
      {/* Hero with track bg */}
      <div
        className="relative"
        style={{
          backgroundImage: `url(https://mindroad.runasp.net/${track?.trackIcon})`,
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-black/80" />
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
            {avgRating && (
              <div className="flex items-center font-semibold mb-4">
                <Star
                  size={16}
                  className="fill-[#ffb900] mr-2 text-[#ffb900]"
                />
                <h2 className="text-[#ffb900] mr-1">{avgRating}</h2>
                <p className="text-gray-300">({reviews.length} reviews)</p>
              </div>
            )}

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

      {/* Content */}
      <section className="py-20 px-10 gap-10 flex">
        {/* Left */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            {["overview", "resources", "reviews"].map((tab) => (
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
                {tab === "reviews" && reviews.length > 0 && (
                  <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                    {reviews.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === "overview" && (
            <div>
              {/* projects u will build */}
              <div>
                <h2 className="text-2xl font-bold mb-5 mt-8">
                  Projects you'll build
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {/* 5 */}
                  {[
                    { num: "P1", name: "Portfolio Website" },
                    { num: "P2", name: "Full-Stack Blog" },
                    { num: "P3", name: "E-Commerce Platform" },
                    { num: "P4", name: "Real-time Chat App" },
                    { num: "P5", name: "SaaS Dashboard" },
                  ].map((project) => (
                    <div
                      key={project.num}
                      className="flex items-center gap-3 bg-100 rounded-lg px-4 py-3 bg-gray-50 max-w-sm"
                    >
                      <span className="bg-[#423ef7] text-white py-1 px-2 rounded-lg">
                        {project.num}
                      </span>
                      <span className="text-gray-600">{project.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* this track includes */}
              <div>
                <h2 className="text-2xl font-bold mb-5 mt-8">
                  This track includes
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Play size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">5h on-demand video</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">Lesson notes & resources</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">18 hands-on projects </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">Community forum access</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">Certificate of completio</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">Lifetime access</p>
                  </div>
                </div>
              </div>
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
                    console.log("TOPIC ID:", topic.topicId);
                    console.log("COMPLETED:", completed);
                    const topicId = topic.topicId;
                    const isOpen = !!openTopics[topicId];
                    const resources = Array.isArray(topic.resources)
                      ? topic.resources
                      : [];
                    const done = isTopicDone(topic);
                    const isCompleting = completingTopic === topicId;
                    return (
                      <div key={topicId} className="mb-3">
                        <div className="bg-gray-100 rounded-xl overflow-hidden">
                          <div
                            className="flex justify-between items-center cursor-pointer px-4 py-4"
                            onClick={() => toggleTopic(topicId)}
                          >
                            <div className="flex items-center gap-3">
                              {/* Complete checkbox */}
                              {loggedIn && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTopicDone(topicId);
                                  }}
                                  disabled={isCompleting}
                                  title={
                                    done
                                      ? "Mark incomplete"
                                      : "Mark as complete"
                                  }
                                  className="flex-shrink-0"
                                >
                                  {isCompleting ? (
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                  ) : done ? (
                                    <SquareCheck
                                      size={20}
                                      className="fill-primary text-white"
                                    />
                                  ) : (
                                    <Square
                                      size={20}
                                      className="text-gray-400 hover:text-primary transition"
                                    />
                                  )}
                                </button>
                              )}
                              <span
                                className={`font-semibold ${done ? "text-gray-400 line-through" : "text-gray-800"}`}
                              >
                                {topic.topicName}
                              </span>
                            </div>

                            <div className="flex gap-3 items-center">
                              {/* Discussion link */}
                              <Link
                                to={`/tracks/${trackId}/${roadmapId}/${topicId}/comments`}
                                onClick={(e) => e.stopPropagation()}
                                title="Discussion"
                              >
                                <MessageCircle
                                  size={18}
                                  className="text-gray-400 hover:text-primary transition"
                                />
                              </Link>
                              {/* Expand chevron */}
                              {isOpen ? (
                                <ChevronUp
                                  size={18}
                                  className="text-gray-400"
                                />
                              ) : (
                                <ChevronDown
                                  size={18}
                                  className="text-gray-400"
                                />
                              )}
                            </div>
                          </div>
                          {/* resourses list  */}
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
                                  const resId = res.resourceId ?? res.resId;
                                  const isBookmarked = !!bookmarked[resId];
                                  const isBookmarkLoading =
                                    !!bookmarkLoading[resId];
                                  return (
                                    <div
                                      key={resId}
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
                                        {res.resourceType && (
                                          <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded uppercase">
                                            {res.resourceType}
                                          </span>
                                        )}
                                        {res.resourceName}

                                        {res.paid && (
                                          <span className="text-xs bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded">
                                            Pro
                                          </span>
                                        )}
                                      </a>
                                      {/* bookmark */}
                                      {loggedIn && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleBookmark(resId);
                                          }}
                                          disabled={isBookmarkLoading}
                                          title={
                                            isBookmarked
                                              ? "Remove bookmark"
                                              : "Bookmark"
                                          }
                                          className="ml-3 flex-shrink-0"
                                        >
                                          {isBookmarkLoading ? (
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                          ) : (
                                            <Bookmark
                                              size={18}
                                              className={
                                                isBookmarked
                                                  ? "fill-primary text-primary"
                                                  : "text-gray-300 hover:text-primary transition"
                                              }
                                            />
                                          )}
                                        </button>
                                      )}
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

          {/* reviews tab */}
          {activeTab === "reviews" && (
            <div>
              {/* Avg rating summary */}
              {reviews.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-gray-900">
                      {avgRating}
                    </p>
                    <div className="flex gap-0.5 mt-1 justify-center">
                      <StarRating
                        initialRating={Math.round(avgRating)}
                        readOnly
                      />
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {reviews.length} reviews
                    </p>
                  </div>
                </div>
              )}

              {/* Review cards */}
              <div className="flex flex-col gap-4 mb-10">
                {reviews.length === 0 && (
                  <p className="text-gray-400">No reviews yet. Be the first!</p>
                )}
                {reviews.map((review) => (
                  <div
                    key={review.revId}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {(review.username || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {review.username || "Learner"}
                        </p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={
                                s <= review.rate
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.content && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {review.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Add review form (logged in users only) */}
              {loggedIn ? (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-lg mb-4">Leave a Review</h3>

                  {/* Star picker */}
                  <div className="mb-4">
                    <StarRating
                      initialRating={reviewRate}
                      onRate={(value) => setReviewRate(value)}
                    />
                  </div>

                  <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="Share your experience with this roadmap..."
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none mb-4"
                  />

                  {reviewError && (
                    <p className="text-red-500 text-sm mb-3">{reviewError}</p>
                  )}
                  {reviewSuccess && (
                    <p className="text-green-500 text-sm mb-3">
                      Review submitted! Thank you.
                    </p>
                  )}

                  <button
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                    className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-60"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                  <p className="text-gray-500 mb-3">
                    Sign in to leave a review
                  </p>
                  <Link
                    to="/signin"
                    className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-72 flex-shrink-0">
          <div className="rounded-2xl shadow-xl overflow-hidden sticky top-6 border border-gray-100">
            <img
              src={Container}
              alt={track?.trackName}
              className="w-full h-40 object-cover"
            />
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

              {loggedIn ? (
                <Link
                  to={`/tracks/${trackId}/${roadmapId}/learn`}
                  className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl text-center hover:opacity-90 transition mb-4 block"
                >
                  Continue Learning →
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl text-center hover:opacity-90 transition block mb-4"
                >
                  Get Started for Free →
                </Link>
              )}

              {/* progress small  */}
              {loggedIn && totalTopics > 0 && (
                <div className="mb-4 bg-gray-50 rounded-xl p-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>
                      {completedCount}/{totalTopics} topics done
                    </span>
                    <span className="font-bold text-primary">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

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
