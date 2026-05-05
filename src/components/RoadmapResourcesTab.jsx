import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  SquareCheck,
  Square,
  MessageCircle,
  Bookmark,
} from "lucide-react";

export default function RoadmapResourcesTab({
  levels,
  trackId,
  roadmapId,
  loggedIn,
  openTopics,
  completed,
  completingTopic,
  bookmarked,
  bookmarkLoading,
  onToggleTopic,
  onToggleTopicDone,
  onToggleBookmark,
}) {
  return (
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
            const done = !!completed[topicId];
            const isCompleting = completingTopic === topicId;

            return (
              <div key={topicId} className="mb-3">
                <div className="bg-gray-100 rounded-xl overflow-hidden">
                  {/* Topic header */}
                  <div
                    className="flex justify-between items-center cursor-pointer px-4 py-4"
                    onClick={() => onToggleTopic(topicId)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Complete checkbox */}
                      {loggedIn && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTopicDone(topicId);
                          }}
                          disabled={isCompleting}
                          title={done ? "Mark incomplete" : "Mark as complete"}
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
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Resources list */}
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
                          const isBookmarkLoading = !!bookmarkLoading[resId];

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

                              {/* Bookmark button */}
                              {loggedIn && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleBookmark(resId);
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
  );
}
