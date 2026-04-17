import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsBar from "../components/StatsBar";
import FeaturesSection from "../components/FeaturesSection";
import FeaturedTracks from "../components/FeaturedTracks";
import profile from "../assets/profile.jpg";
import HowItWorks from "../components/HowItWorks";
import ReviewsSec from "../components/ReviewsSec";
import PricingSec from "../components/PricingSec";
import Footer from "../components/Footer";

function HomePage() {
  const isLoggedIn = false;
  return (
    <div>
      <div
        className="bg-[#030712]"
        style={{
          background:
            "radial-gradient(circle at center, #1a1060 0%, #030712 80%)",
        }}
      >
        <Navbar
          isLoggedIn={isLoggedIn}
          user={{ name: "Toka Moustafa", image: profile }}
        />
        <HeroSection isLoggedIn={isLoggedIn} user={{ streak: 14 }} />
        <StatsBar />
      </div>
      <FeaturesSection />
      <FeaturedTracks />
      <HowItWorks />
      <ReviewsSec />
      <PricingSec isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
}
export default HomePage;
