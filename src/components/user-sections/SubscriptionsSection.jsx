import { Check, Star } from "lucide-react";
import Card from "./Card";

export default function SubscriptionsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Subscriptions</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your plan and billing
        </p>
      </div>

      {/* current plan */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Current Plan</h3>
        </div>
        <p className="text-gray-500 text-sm">
          You're on the free plan. Upgrade to Pro for full access.
        </p>
      </Card>
    </div>
  );
}
