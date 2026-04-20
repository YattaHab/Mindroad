import { Link } from "react-router-dom";
import cover from "../assets/cover.png";
import { Zap } from "lucide-react";

export default function HeroSection({ isLoggedIn = false, user = null }) {
  return (
    <section className="flex items-center justify-between px-10 py-20 min-h-screen ">
      {/* left side */}
      <div className="flex flex-col gap-6 max-w-lg">
        {/* heading */}
        <div>
          <h1 className="text-white text-6xl font-bold ">
            Master <span className="text-secondary">Computer Science</span>,
          </h1>
          <h1 className="text-white text-6xl font-bold ">
            {" "}
            One Project at a time
          </h1>
        </div>
        {/* subtext */}
        <p className="text-gray-400 text-lg leading-relaxed">
          Expert-designed roadmaps, real-world projects, and a gamified progress
          system that keeps you moving, from absolute beginner to job-ready
          engineer.
        </p>
        {/* buttons */}
        <div className="mb-4">
          <Link
            to={isLoggedIn ? "/tracks" : "/signup"}
            className="text-white font-medium bg-primary px-4 py-2 rounded-xl hover:opacity-80 transition duration-300 shadow-lg shadow-primary/50"
          >
            Start for free {">"}
          </Link>
        </div>

        {/* rating */}
        <div className="flex gap-4">
          <div>
            <p className="text-yellow-400 text-sm font-bold">⭐⭐⭐⭐⭐ 4.9</p>
            <p className="text-gray-600 text-sm">from 12,000+ students</p>
          </div>
          <div className="text-gray-600 text-3xl font-thin">|</div>
          <div>
            <p className="text-white text-sm font-bold">Free forever</p>
            <p className="text-gray-600 text-sm">no credit card needed</p>
          </div>
        </div>
      </div>

      {/* right side */}
      {/* img */}
      <div className="relative">
        <img src={cover} alt="cover" className="w-[600px]" />
        {/* streak */}
        <div className="absolute top-1 right-4 bg-[#fe9a00] px-5 py-4 rounded-2xl flex items-center gap-2">
          <Zap size={16} className="text-[#7b3306] fill-[#7b3306]" />
          <div>
            <p className="font-bold text-sm text-[#7b3306]">
              {isLoggedIn ? `${user?.streak}-day streak🔥` : "Your streak here"}
            </p>
            <p className="text-xs text-[#7b3306]">
              {isLoggedIn ? "keep it going!" : "sign in to start"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
