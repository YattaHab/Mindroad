import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { getCurrentUser, isLoggedIn } from "../services/authService";

import RoadmapHero from "../components/RoadmapHero";
import RoadmapOverviewTab from "../components/RoadmapOverviewTab";
import RoadmapResourcesTab from "../components/RoadmapResourcesTab";
import RoadmapReviewsTab from "../components/RoadmapReviewsTab";
import TrackSidebar from "../components/TrackSidebar";

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
  const [completingTopic, setCompletingTopic] = useState(null);

  const [bookmarked, setBookmarked] = useState({});
  const [bookmarkLoading, setBookmarkLoading] = useState({});

  const [reviewContent, setReviewContent] = useState("");
  const [reviewRate, setReviewRate] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Fetch track
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

  // Fetch roadmap
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

  // Fetch progress
  useEffect(() => {
    if (!loggedIn) return;
    api
      .get(`/api/Progress/roadmap/${roadmapId}`)
      .then((res) => {
        const data = res.data.result;
        const completedMap = {};
        if (data && Array.isArray(data.completedTopics)) {
          data.completedTopics.forEach((id) => {
            completedMap[Number(id)] = true;
          });
        }
        setCompleted(completedMap);
      })
      .catch((err) => {
        if (err.response?.status !== 404)
          console.error("progress fetch error", err);
      });
  }, [loggedIn, roadmapId]);

  // Fetch bookmarks
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

  // Fetch reviews
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

  // Toggle topic done
  const toggleTopicDone = async (topicId) => {
    if (!loggedIn || completingTopic === topicId) return;
    setCompletingTopic(topicId);
    const wasDone = !!completed[topicId];
    setCompleted((prev) => ({ ...prev, [topicId]: !wasDone }));
    try {
      if (wasDone) await api.delete(`/api/Progress/complete-topic/${topicId}`);
      else await api.post(`/api/Progress/complete-topic/${topicId}`);
    } catch {
      setCompleted((prev) => ({ ...prev, [topicId]: wasDone }));
    } finally {
      setCompletingTopic(null);
    }
  };

  // Toggle bookmark
  const toggleBookmark = async (resourceId) => {
    if (!loggedIn || bookmarkLoading[resourceId]) return;
    setBookmarkLoading((prev) => ({ ...prev, [resourceId]: true }));
    const wasBookmarked = !!bookmarked[resourceId];
    setBookmarked((prev) => ({ ...prev, [resourceId]: !wasBookmarked }));
    try {
      if (wasBookmarked) await api.delete(`/api/Bookmarks/${resourceId}`);
      else await api.post(`/api/Bookmarks/${resourceId}`);
    } catch {
      setBookmarked((prev) => ({ ...prev, [resourceId]: wasBookmarked }));
    } finally {
      setBookmarkLoading((prev) => ({ ...prev, [resourceId]: false }));
    }
  };

  // Submit review
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
      fetchReviews();
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to submit review.",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // Derived values
  const totalTopics = levels.reduce(
    (n, l) => n + (l.topicResponses?.length || 0),
    0,
  );
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const toggleTopic = (topicId) =>
    setOpenTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));

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

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#030712]">
        <Navbar isLoggedIn={loggedIn} user={user} />
      </div>
      <RoadmapHero
        track={track}
        trackId={trackId}
        roadmap={roadmap}
        levels={levels}
        reviews={reviews}
        avgRating={avgRating}
        loggedIn={loggedIn}
        totalTopics={totalTopics}
        completedCount={completedCount}
        progress={progress}
      />

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

          {activeTab === "overview" && <RoadmapOverviewTab />}

          {activeTab === "resources" && (
            <RoadmapResourcesTab
              levels={levels}
              trackId={trackId}
              roadmapId={roadmapId}
              loggedIn={loggedIn}
              openTopics={openTopics}
              completed={completed}
              completingTopic={completingTopic}
              bookmarked={bookmarked}
              bookmarkLoading={bookmarkLoading}
              onToggleTopic={toggleTopic}
              onToggleTopicDone={toggleTopicDone}
              onToggleBookmark={toggleBookmark}
            />
          )}

          {activeTab === "reviews" && (
            <RoadmapReviewsTab
              reviews={reviews}
              avgRating={avgRating}
              loggedIn={loggedIn}
              reviewContent={reviewContent}
              reviewRate={reviewRate}
              submittingReview={submittingReview}
              reviewError={reviewError}
              reviewSuccess={reviewSuccess}
              onReviewContentChange={setReviewContent}
              onReviewRateChange={setReviewRate}
              onSubmitReview={handleSubmitReview}
            />
          )}
        </div>

        {/* Right Sidebar */}
        <TrackSidebar track={track} />
      </section>

      <Footer />
    </div>
  );
}

export default RoadmapPage;
