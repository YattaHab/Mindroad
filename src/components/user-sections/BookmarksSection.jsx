import { useState, useEffect } from "react";
import { Bookmark, Trash2, ExternalLink } from "lucide-react";
import Card from "./Card";
import api from "../../services/api";

export default function BookmarksSection() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/bookmarks")
      .then((res) => setBookmarks(res.data?.items || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const removeBookmark = async (resId) => {
    try {
      await api.delete(`/api/bookmarks/${resId}`);
      setBookmarks((prev) => prev.filter((b) => b.resId !== resId));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bookmarks</h2>
        <p className="text-gray-500 text-sm mt-1">
          Resources you've saved for later
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookmarks.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Bookmark size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No bookmarks yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Save resources while browsing roadmaps
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <Card
              key={b.resId}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bookmark size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {b.name || b.resName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400 capitalize">
                      {b.type}
                    </span>
                    {b.paid && (
                      <span className="text-xs bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded font-medium">
                        Pro
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {b.resUrl && (
                  <a
                    href={b.resUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-primary transition"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={() => removeBookmark(b.resId)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
