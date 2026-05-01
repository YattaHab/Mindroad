import { Bell } from "lucide-react";
import Card from "./Card";

export default function NotificationsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-500 text-sm mt-1">All caught up!</p>
        </div>
      </div>
      <Card>
        <div className="text-center py-12">
          <Bell size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 font-medium">No notifications</p>
        </div>
      </Card>
    </div>
  );
}
