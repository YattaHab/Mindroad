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

// import DebugUser from "../components/DebugUser";

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
        <StatsBar />
      </div>

      <FeaturesSection />
      {loggedIn && <Progress />}

      <FeaturedTracks />
      <HowItWorks />
      <ReviewsSec />
      <PricingSec isLoggedIn={loggedIn} />
      <Footer />
    </div>
  );
}
export default HomePage;
