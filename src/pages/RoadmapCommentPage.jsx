import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Send,
  Reply,
  Trash2,
  ChevronLeft,
  SquareCheck,
  Square,
  Bookmark,
} from "lucide-react";
import api from "../services/api";
import { getCurrentUser, isLoggedIn } from "../services/authService";
import Navbar from "../components/Navbar";
import Card from "../components/user-sections/Card";

export default function RoadmapCommentPage() {
  const { trackId, roadmapId, topicId } = useParams();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();

  //sidebar
  const [roadmap, setRoadmap] = useState(null);
  const [track, setTrack] = useState(null);
  const [levels, setLevels] = useState([]);
  const [openTopics, setOpenTopics] = useState({});
  const [completed, setCompleted] = useState({});
  const [completingTopic, setCompletingTopic] = useState(null);
  const [bookmarked, setBookmarked] = useState({});
  const [bookmarkLoading, setBookmarkLoading] = useState({});

  //comments
  const [activeTopicId, setActiveTopicId] = useState(
    topicId ? parseInt(topicId) : null,
  );
  const [currentTopic, setCurrentTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  //track
  useEffect(() => {
    api.get("/api/Track").then((res) => {
      const found = (res.data.items || res.data).find(
        (t) => t.trackId === parseInt(trackId),
      );
      setTrack(found || null);
    });
  }, [trackId]);

  //roadmap + lvls
  useEffect(() => {
    api.get(`/api/roadmap/${roadmapId}`).then((res) => {
      const rm = res.data;
      setRoadmap(rm);
      const lvls = rm.levelResoponses || [];
      setLevels(lvls);

      lvls.forEach((l) => {
        (l.topicResponses || []).forEach((t) => {
          if (t.topicId === parseInt(topicId)) setCurrentTopic(t);
        });
      });
    });
  }, [roadmapId, topicId]);

  //progress
  useEffect(() => {
    if (!loggedIn) return;

    api
      .get(`/api/Progress/roadmap/${roadmapId}`)
      .then((res) => {
        const data = res.data?.result;

        const map = {};

        if (data?.completedTopics && Array.isArray(data.completedTopics)) {
          data.completedTopics.forEach((id) => {
            map[Number(id)] = true;
          });
        }

        setCompleted(map);
      })
      .catch((err) => {
        if (err.response?.status !== 404) console.error(err);
      });
  }, [loggedIn, roadmapId]);

  //bookmarks
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
      .catch(console.error);
  }, [loggedIn]);

  //comments
  const loadComments = useCallback((tId) => {
    setCommentsLoading(true);
    api
      .get(`/api/Topic/${tId}/comments`)
      .then((res) => {
        console.log("COMMENTS:", res.data);
        setComments(Array.isArray(res.data) ? res.data : res.data.items || []);
      })
      .catch(() => setComments([]))
      .finally(() => setCommentsLoading(false));
  }, []);

  useEffect(() => {
    if (activeTopicId) loadComments(activeTopicId);
  }, [activeTopicId, loadComments]);

  //sb sec
  const toggleTopic = (id) => setOpenTopics((p) => ({ ...p, [id]: !p[id] }));

  const toggleTopicDone = async (tId, e) => {
    e.stopPropagation();
    if (!loggedIn || completingTopic === tId) return;
    setCompletingTopic(tId);
    const wasDone = !!completed[tId];
    setCompleted((p) => ({ ...p, [tId]: !wasDone }));
    try {
      if (wasDone) await api.delete(`/api/Progress/complete-topic/${tId}`);
      else await api.post(`/api/Progress/complete-topic/${tId}`);
    } catch {
      setCompleted((p) => ({ ...p, [tId]: wasDone }));
    } finally {
      setCompletingTopic(null);
    }
  };

  const toggleBookmark = async (resourceId, e) => {
    e.stopPropagation();
    if (!loggedIn || bookmarkLoading[resourceId]) return;
    setBookmarkLoading((p) => ({ ...p, [resourceId]: true }));
    const was = !!bookmarked[resourceId];
    setBookmarked((p) => ({ ...p, [resourceId]: !was }));
    try {
      if (was) await api.delete(`/api/Bookmarks/${resourceId}`);
      else await api.post(`/api/Bookmarks/${resourceId}`);
    } catch {
      setBookmarked((p) => ({ ...p, [resourceId]: was }));
    } finally {
      setBookmarkLoading((p) => ({ ...p, [resourceId]: false }));
    }
  };

  const switchTopic = (topic) => {
    setActiveTopicId(topic.topicId);
    setCurrentTopic(topic);
    setComments([]);
    setReplyingTo(null);
    setReplyText("");
    navigate(`/tracks/${trackId}/${roadmapId}/${topic.topicId}/comments`, {
      replace: true,
    });
  };

  //comment sec
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !loggedIn) return;
    setSubmitting(true);
    try {
      await api.post(`/api/Topic/${activeTopicId}/comments`, {
        content: newComment.trim(),
      });
      setNewComment("");
      loadComments(activeTopicId);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyText.trim() || !loggedIn) return;
    setSubmitting(true);
    try {
      await api.post(`/api/comments/${commentId}/reply`, {
        content: replyText.trim(),
      });
      setReplyText("");
      setReplyingTo(null);
      loadComments(activeTopicId);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/api/comments/${commentId}`);
      loadComments(activeTopicId);
    } catch {
      alert("Could not delete comment.");
    }
  };

  //derived values
  const totalTopics = levels.reduce(
    (n, l) => n + (l.topicResponses?.length || 0),
    0,
  );
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  //formatdate
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <div className="bg-[#030712]">
        <Navbar isLoggedIn={loggedIn} user={user} />
      </div>

      {/* the top */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 text-sm">
          <Link
            to={`/tracks/${trackId}/${roadmapId}`}
            className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition font-medium"
          >
            <ChevronLeft size={15} />
            Back
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">{roadmap?.roadmapName}</span>
          <span className="text-gray-300">›</span>
          <span className="text-primary font-semibold truncate max-w-xs">
            {currentTopic?.topicName || "Discussion"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
            {completedCount}/{totalTopics} topics
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 bg-gray-50">
        {/* left */}
        <aside className="w-96 flex-shrink-0 px-3 py-4 bg-gray-50">
          <div className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden sticky top-4 overflow-y-auto">
            {/* sidebar header */}
            <div className="px-5 py-5 border-b border-gray-100 bg-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                {track?.trackName}
              </p>
              <h3 className="text-gray-800 font-bold text-sm leading-snug">
                {roadmap?.roadmapName}
              </h3>
              {loggedIn && totalTopics > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>
                      {completedCount}/{totalTopics} done
                    </span>
                    <span className="font-bold text-primary">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* levels + topics */}
            <div className="py-2">
              {levels.map((level, lIndex) => (
                <div key={lIndex} className="mb-2">
                  <p className="px-4 pt-3 pb-1 text-sm font-bold tracking-widest mb-3">
                    {level.levelName}
                  </p>

                  {(level.topicResponses || []).map((topic) => {
                    const tid = topic.topicId;
                    const isActive = activeTopicId === tid;
                    const isOpen = !!openTopics[tid];
                    const done = !!completed[tid];
                    const isCompleting = completingTopic === tid;
                    const resources = Array.isArray(topic.resources)
                      ? topic.resources
                      : [];

                    return (
                      <div key={tid} className="mb-3">
                        <div
                          className={`bg-gray-100 rounded-xl shadow-sm hover:shadow-md transition mx-3 ${
                            isActive ? "ring-2 ring-primary/50" : ""
                          }`}
                        >
                          <div
                            className="flex justify-between items-center cursor-pointer px-3 py-2.5"
                            onClick={() => switchTopic(topic)}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {/* complete checkbox */}
                              {loggedIn && (
                                <button
                                  onClick={(e) => toggleTopicDone(tid, e)}
                                  disabled={isCompleting}
                                  className="flex-shrink-0"
                                  title={
                                    done ? "Mark incomplete" : "Mark complete"
                                  }
                                >
                                  {isCompleting ? (
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                  ) : done ? (
                                    <SquareCheck
                                      size={16}
                                      className="fill-primary text-white"
                                    />
                                  ) : (
                                    <Square
                                      size={16}
                                      className="text-gray-400 hover:text-primary transition"
                                    />
                                  )}
                                </button>
                              )}
                              {/* topic name */}
                              <span
                                className={`text-xs leading-snug font-semibold truncate ${
                                  isActive
                                    ? "text-primary"
                                    : done
                                      ? "text-gray-400 line-through"
                                      : "text-gray-800"
                                }`}
                              >
                                {topic.topicName}
                              </span>
                            </div>

                            <div className="flex gap-2 items-center flex-shrink-0 ml-1">
                              {/* discussion icon — highlights when active */}
                              <MessageCircle
                                size={13}
                                className={
                                  isActive
                                    ? "text-primary"
                                    : "text-gray-400 hover:text-primary transition"
                                }
                              />
                              {/* expand chevron — only shown if has resources */}
                              {resources.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTopic(tid);
                                  }}
                                >
                                  {isOpen ? (
                                    <ChevronUp
                                      size={13}
                                      className="text-gray-400"
                                    />
                                  ) : (
                                    <ChevronDown
                                      size={13}
                                      className="text-gray-400"
                                    />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* resources — same structure as RoadmapPage */}
                          <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              isOpen
                                ? "max-h-[500px] opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                              {resources.length === 0 ? (
                                <p className="text-gray-400 text-xs py-1">
                                  No resources yet.
                                </p>
                              ) : (
                                resources.map((res) => {
                                  const resId = res.resourceId ?? res.resId;
                                  const isBookmarked = !!bookmarked[resId];
                                  const bLoading = !!bookmarkLoading[resId];
                                  return (
                                    <div
                                      key={resId}
                                      className="flex justify-between items-center mb-2 mt-1"
                                    >
                                      <a
                                        href={
                                          res.rsourceUrl?.startsWith("http")
                                            ? res.rsourceUrl
                                            : `https://${res.rsourceUrl}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-xs flex items-center gap-1.5 flex-1 min-w-0 truncate"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {res.resourceType && (
                                          <span className="text-[9px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded uppercase flex-shrink-0">
                                            {res.resourceType}
                                          </span>
                                        )}
                                        <span className="truncate">
                                          {res.resourceName}
                                        </span>
                                        {res.paid && (
                                          <span className="text-[9px] bg-yellow-100 text-yellow-600 px-1 py-0.5 rounded flex-shrink-0">
                                            Pro
                                          </span>
                                        )}
                                      </a>
                                      {loggedIn && (
                                        <button
                                          onClick={(e) =>
                                            toggleBookmark(resId, e)
                                          }
                                          disabled={bLoading}
                                          className="ml-2 flex-shrink-0"
                                        >
                                          {bLoading ? (
                                            <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                                          ) : (
                                            <Bookmark
                                              size={13}
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
          </div>
        </aside>

        {/* right side */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-2xl mx-auto px-6 py-8">
            {/* heading */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle size={18} className="text-primary" />
                <h1 className="text-gray-900 font-bold text-xl">Discussion</h1>
              </div>
              <p className="text-gray-500 text-sm">
                {currentTopic?.topicName
                  ? currentTopic.topicName
                  : "Select a topic from the sidebar"}
              </p>
            </div>

            {/* not logged in notice */}
            {!loggedIn && (
              <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-sm text-primary">
                <Link to="/signin" className="underline font-semibold">
                  Sign in
                </Link>{" "}
                to join the discussion. You must be enrolled in this track to
                comment.
              </div>
            )}

            {/* new comment box */}
            {loggedIn && (
              <Card className="mb-6 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold uppercase">
                      {user?.name?.[0] || "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ask a question about this topic…"
                      rows={3}
                      className="w-full text-gray-800 placeholder-gray-400 text-sm resize-none outline-none border-b border-gray-100 focus:border-primary/40 pb-3 transition"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <button
                        onClick={handleSubmitComment}
                        disabled={submitting || !newComment.trim()}
                        className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-40 transition"
                      >
                        <Send size={12} />
                        {submitting ? "Posting…" : "Post Comment"}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* comments list */}
            {commentsLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100" />
                      <div className="flex-1">
                        <div className="h-3 bg-gray-100 rounded w-24 mb-3" />
                        <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
                <MessageCircle
                  size={36}
                  className="text-gray-200 mx-auto mb-3"
                />
                <p className="text-gray-500 font-medium text-sm">
                  No comments yet
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Be the first to start the discussion!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {comments.map((comment) => (
                  <CommentCard
                    key={comment.comId}
                    comment={comment}
                    user={user}
                    loggedIn={loggedIn}
                    replyingTo={replyingTo}
                    replyText={replyText}
                    submitting={submitting}
                    setReplyingTo={setReplyingTo}
                    setReplyText={setReplyText}
                    onReply={handleSubmitReply}
                    onDelete={handleDeleteComment}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

//Comment Card
function CommentCard({
  comment,
  user,
  loggedIn,
  replyingTo,
  replyText,
  submitting,
  setReplyingTo,
  setReplyText,
  onReply,
  onDelete,
  formatDate,
  isReply = false,
}) {
  const displayName = comment.username || `User #${comment.userId}`;

  const isOwn = user && String(comment.userId) === String(user?.id);

  return (
    <Card className={`${isReply ? "ml-6 p-4" : "p-4"}`}>
      <div className="flex items-start gap-3">
        {/* avatar */}
        <div
          className={`rounded-full flex items-center justify-center flex-shrink-0 font-bold uppercase bg-primary/10 text-primary ${
            isReply ? "w-7 h-7 text-[10px]" : "w-8 h-8 text-xs"
          }`}
        >
          {comment.username?.[0] || "U"}
        </div>

        <div className="flex-1 min-w-0">
          {/* header */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-gray-900 text-sm font-semibold">
                {displayName}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {loggedIn && !isReply && (
                <button
                  onClick={() =>
                    setReplyingTo(
                      replyingTo?.commentId === comment.comId
                        ? null
                        : {
                            commentId: comment.comId,
                            username: comment.username,
                          },
                    )
                  }
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition"
                >
                  <Reply size={13} />
                  Reply
                </button>
              )}
              {isOwn && (
                <button
                  onClick={() => onDelete(comment.comId)}
                  className="text-gray-300 hover:text-red-400 transition"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          {/* body */}
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          {/* reply input */}
          {replyingTo?.commentId === comment.comId && (
            <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-2">
                Replying to{" "}
                <span className="text-primary font-semibold">
                  {replyingTo.username}
                </span>
              </p>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply…"
                rows={2}
                className="w-full bg-transparent text-gray-700 placeholder-gray-400 text-xs resize-none outline-none border-b border-gray-200 focus:border-primary/40 pb-2 transition"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText("");
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition px-3 py-1.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onReply(comment.comId)}
                  disabled={submitting || !replyText.trim()}
                  className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-40 transition"
                >
                  <Send size={11} />
                  {submitting ? "Posting…" : "Reply"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* nested replies */}
      {(comment.replies || []).length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.comId}
              comment={reply}
              user={user}
              loggedIn={loggedIn}
              replyingTo={replyingTo}
              replyText={replyText}
              submitting={submitting}
              setReplyingTo={setReplyingTo}
              setReplyText={setReplyText}
              onReply={onReply}
              onDelete={onDelete}
              formatDate={formatDate}
              isReply
            />
          ))}
        </div>
      )}
    </Card>
  );
}
