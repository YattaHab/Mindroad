import { Link } from "react-router-dom";
import Container from "../assets/Container.png";
import { Play, Code, Award, Zap } from "lucide-react";

export default function TrackSidebar({ track }) {
  return (
    <div className="w-1/4">
      <div className="rounded-2xl shadow-2xl overflow-hidden sticky top-6">
        <img
          src={Container}
          alt={track.trackName}
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-3">
            Free{" "}
            <span className="text-sm font-normal text-gray-500">to start</span>
          </h1>
          <p className="text-gray-400 mb-8">Pro features from E£49/mo</p>

          <div className="flex justify-center mb-6">
            <Link
              to="/pricing"
              className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl text-center hover:opacity-90 transition duration-300"
            >
              View Pricing {">"}
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Play size={16} className="text-gray-400" />
              <p>5h of video lessons</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Code size={16} className="text-gray-400" />
              <p>18 real projects</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award size={16} className="text-gray-400" />
              <p>Certificate of completion</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap size={16} className="text-gray-400" />
              <p>Lifetime access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
