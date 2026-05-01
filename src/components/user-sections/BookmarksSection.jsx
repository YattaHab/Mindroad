import { Bookmark, Trash2, ExternalLink } from "lucide-react";
import Card from "./Card";

export default function BookmarksSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bookmarks</h2>
        <p className="text-gray-500 text-sm mt-1">
          Resources you've saved for later
        </p>
      </div>

      <Card>
        <div className="text-center py-12">
          <Bookmark size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 font-medium">No bookmarks yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Save resources while browsing roadmaps
          </p>
        </div>
      </Card>
    </div>
  );
}
