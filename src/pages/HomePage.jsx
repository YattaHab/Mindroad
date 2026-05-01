import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsBar from "../components/StatsBar";
import FeaturesSection from "../components/FeaturesSection";
import FeaturedTracks from "../components/FeaturedTracks";
import HowItWorks from "../components/HowItWorks";
import ReviewsSec from "../components/ReviewsSec";
import PricingSec from "../components/PricingSec";
import Footer from "../components/Footer";
import Progress from "../components/Progress";

import { getCurrentUser, isLoggedIn } from "../services/authService";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function HomePage() {
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();

  return (
    <div>
      <div
        className="bg-[#030712]"
        style={{
          background:
            "radial-gradient(circle at center, #1a1060 0%, #030712 80%)",
        }}
      >
        <Navbar isLoggedIn={loggedIn} user={user} />
        <HeroSection isLoggedIn={loggedIn} user={user} />
        <hr className="border-[#0d1031] mx-10" />

        <StatsBar />
      </div>

      <FeaturesSection />
      {loggedIn && (
        <div className="bg-gray-100 py-8">
          <p className="text-primary text-sm font-semibold mb-3 px-10">
            YOUR PROGRESS
          </p>
          <div className="flex justify-between mb-8 px-10">
            <h1 className="font-bold text-4xl">Continue Learning</h1>
            <Link
              to="/tracks"
              className="flex items-center gap-2 text-primary text-sm font-medium"
            >
              Browse all tracks
              <ArrowRight size={16} />
            </Link>
          </div>
          <Progress />
        </div>
      )}

      <FeaturedTracks />
      <HowItWorks />
      <ReviewsSec />
      <PricingSec isLoggedIn={loggedIn} />
      <Footer />
    </div>
  );
}
export default HomePage;
