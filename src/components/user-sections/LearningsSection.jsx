import { Link } from "react-router-dom";
import Card from "./Card";
import Progress from "../Progress";

export default function LearningsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Learnings</h2>
        <p className="text-gray-500 text-sm mt-1">
          Track your progress across all roadmaps
        </p>
      </div>
      <Card>
        <div className="mt-8">
          <Progress />
        </div>
      </Card>
    </div>
  );
}
