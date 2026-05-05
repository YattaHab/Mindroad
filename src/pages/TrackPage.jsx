import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser, isLoggedIn } from "../services/authService";
import api from "../services/api";

import TrackHero from "../components/TrackHero";
import TrackOverviewTab from "../components/TrackOverviewTab";
import TrackRoadmapsTab from "../components/TrackRoadmapsTab";
import TrackSidebar from "../components/TrackSidebar";

function TrackPage() {
  const navigate = useNavigate();
  const { trackId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [roadmaps, setRoadmaps] = useState([]);
  const [track, setTrack] = useState(null);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState(null);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  const loggedIn = isLoggedIn();
  const user = getCurrentUser();

  // Fetch track info
  useEffect(() => {
    fetch(`https://mindroad.runasp.net/api/Track`)
      .then((res) => res.json())
      .then((data) => {
        const foundTrack = data.items.find(
          (t) => t.trackId === parseInt(trackId),
        );
        setTrack(foundTrack);
      });
  }, [trackId]);

  // Fetch roadmaps in track
  useEffect(() => {
    fetch(`https://mindroad.runasp.net/api/Track/${trackId}`)
      .then((res) => res.json())
      .then((data) => {
        setRoadmaps(data.items);
      });
  }, [trackId]);

  // Check enrollment status
  useEffect(() => {
    if (!loggedIn) return;
    setCheckingEnrollment(true);
    api
      .get(`/api/Track/${trackId}/enrollment-status`)
      .then((res) => {
        setIsEnrolled(res.data?.isEnrolled ?? res.data === true);
      })
      .catch(() => setIsEnrolled(false))
      .finally(() => setCheckingEnrollment(false));
  }, [loggedIn, trackId]);

  const handleEnroll = async () => {
    if (!loggedIn) {
      navigate("/signin");
      return;
    }
    setEnrollLoading(true);
    setEnrollError(null);
    try {
      await api.post(`/api/Track/${trackId}/enroll`);
      setIsEnrolled(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setIsEnrolled(true);
      } else {
        setEnrollError(err.response?.data?.message || "Failed to enroll");
      }
    } finally {
      setEnrollLoading(false);
    }
  };

  if (!track) return <p>Track not found</p>;

  return (
    <div>
      <div className="bg-[#030712]">
        <Navbar isLoggedIn={loggedIn} user={user} />
      </div>
      <TrackHero
        track={track}
        trackId={trackId}
        filteredRoadmaps={roadmaps}
        loggedIn={loggedIn}
        isEnrolled={isEnrolled}
      />

      {/* Content */}
      <section className="py-20 px-10 gap-10 flex">
        {/* Left */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            {["overview", "roadmaps"].map((tab) => (
              <button
                key={tab}
                className={`px-3 pb-3 text-sm font-medium capitalize transition duration-300 ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "overview" && <TrackOverviewTab />}

          {activeTab === "roadmaps" && (
            <TrackRoadmapsTab
              track={track}
              trackId={trackId}
              roadmaps={roadmaps}
              loggedIn={loggedIn}
              isEnrolled={isEnrolled}
              checkingEnrollment={checkingEnrollment}
              enrollLoading={enrollLoading}
              enrollError={enrollError}
              onEnroll={handleEnroll}
            />
          )}
        </div>

        <TrackSidebar track={track} />
      </section>

      <Footer />
    </div>
  );
}

export default TrackPage;
