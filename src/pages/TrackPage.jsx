import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Container from "../assets/Container.png";
import {
  BookOpen,
  Clock,
  Play,
  Star,
  Users,
  FileText,
  Code,
  Award,
  Bolt,
  Zap,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser, isLoggedIn } from "../services/authService";
import api from "../services/api";

function TrackPage() {
  const navigate = useNavigate();
  const { trackId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [roadmaps, setRoadmaps] = useState([]);
  const [track, setTrack] = useState(null);

  //enrollment state
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState(null);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  const loggedIn = isLoggedIn();
  const user = getCurrentUser();

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

  useEffect(() => {
    fetch(`https://mindroad.runasp.net/api/Track/${trackId}`)
      .then((res) => res.json())
      .then((data) => {
        setRoadmaps(data.items);
      });
  }, [trackId]);

  //Check if user already enrolled
  useEffect(() => {
    if (!loggedIn) return;
    setCheckingEnrollment(true);
    api
      .get(`/api/Track/${trackId}/enrollment-status`)
      .then((res) => {
        setIsEnrolled(res.data?.isEnrolled ?? res.data === true);
      })
      .catch(() => {
        setIsEnrolled(false);
      })
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
      const status = err.response?.status;
      //409->already enrolled, treat as success
      if (status === 409) {
        setIsEnrolled(true);
      } else {
        setEnrollError(err.response?.data?.message || "failed to enroll");
      }
    } finally {
      setEnrollLoading(false);
    }
  };

  if (!track) return <p>Track not found</p>;
  const filteredRoadmaps = roadmaps;

  return (
    <div>
      <div
        className="relative"
        style={{
          backgroundImage: `url(https://mindroad.runasp.net/${track.trackIcon})`,
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-black/80" />
        <div className="relative z-10">
          <Navbar isLoggedIn={loggedIn} user={user} />
          {/* hero */}
          <section className="py-20 px-10">
            {/* links */}
            <div className="flex items-center gap-2 text-gray-300 font-semibold mb-8">
              <Link to="/" className=" hover:text-white">
                Home
              </Link>
              <p>{">"}</p>
              <Link to="/tracks" className=" hover:text-white">
                Tracks
              </Link>
              <p>{">"}</p>
              <p>{track.trackName}</p>
            </div>
            {/* 2 */}
            <div className="flex items-center font-semibold">
              <Star size={16} className="fill-[#ffb900] mr-2 text-[#ffb900]" />
              <h2 className="text-[#ffb900] mr-1">4.9</h2>
              <p className="text-gray-300">(1,240 reviews)</p>
            </div>
            {/* 3 */}
            <h1 className="text-5xl text-white mt-8 font-bold">
              {track.trackName}
            </h1>
            {/* 4 */}
            <p className="mt-8 text-gray-300 leading-relaxed w-1/2">
              {track.trackDescription}
            </p>
            {/* 5 */}
            <div className="flex items-center gap-6 mt-8">
              <div className="text-gray-400 flex items-center gap-2">
                <Clock size={16} />
                <p>6 months</p>
              </div>
              <div className="text-gray-400 flex items-center gap-2">
                <BookOpen size={16} />
                <p>
                  {filteredRoadmaps.length} roadmap
                  {filteredRoadmaps.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="text-gray-400 flex items-center gap-2">
                <Users size={16} />
                <p>12,400 enrolled</p>
              </div>
            </div>

            {/* enrollment btn */}
            {loggedIn && isEnrolled && (
              <div className="mt-6 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl">
                <CheckCircle size={16} />
                <span className="font-semibold text-sm">
                  You're enrolled in this track
                </span>
              </div>
            )}
            {/* end of enrollment btn */}
          </section>
        </div>
      </div>
      {/* content */}
      <section className="py-20 px-10 gap-10 flex ">
        {/* left */}
        <div className="flex-1 ">
          {/* tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            <button
              className={`px-3 pb-3 text-sm font-medium transition duration-300 ${activeTab === "overview" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-3 pb-3 text-sm font-medium transition duration-300 ${activeTab === "roadmaps" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => setActiveTab("roadmaps")}
            >
              Roadmaps
            </button>
          </div>
          {/* overview */}
          {activeTab === "overview" && (
            <div>
              {/* what u will learn */}
              <h2 className="text-2xl font-bold mb-5">What you'll learn</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex gap-1 items-center text-gray-600 mb-3">
                  <div className="w-4 h-4 rounded-full bg-[#10b981]" />
                  <p>Build responsive UIs with HTML, CSS & Tailwind</p>
                </div>
                <div className="flex gap-1 items-center text-gray-600 mb-3">
                  <div className="w-4 h-4 rounded-full bg-[#10b981]" />
                  <p>Create interactive SPAs with React & hooks</p>
                </div>
                <div className="flex gap-1 items-center text-gray-600 mb-3">
                  <div className="w-4 h-4 rounded-full bg-[#10b981]" />
                  <p>Work with PostgreSQL databases and ORMs</p>
                </div>
                <div className="flex gap-1 items-center text-gray-600 mb-3">
                  <div className="w-4 h-4 rounded-full bg-[#10b981]" />
                  <p>Containerise apps with Docker</p>
                </div>
                <div className="flex gap-1 items-center text-gray-600 mb-3">
                  <div className="w-4 h-4 rounded-full bg-[#10b981]" />
                  <p>Master JavaScript ES6+ and async programming</p>
                </div>
                <div className="flex gap-1 items-center text-gray-600 mb-3">
                  <div className="w-4 h-4 rounded-full bg-[#10b981]" />
                  <p>Design and build REST APIs with Node.js & Express</p>
                </div>
                <div className="flex gap-1 items-center text-gray-600 mb-3">
                  <div className="w-4 h-4 rounded-full bg-[#10b981]" />
                  <p>Implement JWT authentication and OAuth</p>
                </div>
                <div className="flex gap-1 items-center text-gray-600 mb-3">
                  <div className="w-4 h-4 rounded-full bg-[#10b981]" />
                  <p>Deploy to AWS or Vercel with CI/CD pipelines</p>
                </div>
              </div>
              {/* skills covered */}
              <div>
                <h2 className="text-2xl font-bold mb-5 mt-8">Skills covered</h2>
                <div className="flex gap-3 flex-wrap">
                  {[
                    "HTML/CSS",
                    "JavaScript",
                    "React",
                    "Node.js",
                    "PostgreSQL",
                    "REST APIs",
                    "Docker",
                    "CL/CD",
                  ].map((skill) => (
                    <p
                      key={skill}
                      className="bg-gray-100 text-gray-600 py-2 px-3 rounded-2xl"
                    >
                      {skill}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* done */}
          {/* roadmap */}
          {activeTab === "roadmaps" && (
            <div>
              {/* enroll if not enrolled */}
              {loggedIn && !isEnrolled && !checkingEnrollment && (
                <div className="bg-primary/5 border border-blue-200 rounded-xl p-4 mb-6 flex item-center justify-between">
                  <p className="text-primary text-sm font-medium flex items-center">
                    Enroll in this track
                  </p>
                  <button
                    onClick={handleEnroll}
                    disabled={enrollLoading}
                    className="ml-4 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition flex-shrink-0"
                  >
                    Enroll now
                  </button>
                </div>
              )}
              {enrollError && (
                <p className="text-red-500 text-sm mt-2">{enrollError}</p>
              )}
              {/* end  */}
              {filteredRoadmaps.map((roadmap) => (
                <Link
                  key={roadmap.roadmapId}
                  to={`/tracks/${trackId}/${roadmap.roadmapId}`}
                  className="bg-gray-100 block mb-4 rounded-xl overflow-hidden"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={`https://mindroad.runasp.net/${track.trackIcon}`}
                      alt={roadmap.roadmapName}
                      className="w-44 h-28 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-xl">
                        {roadmap.roadmapName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-4">
                        {roadmap.roadmapDescription}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* right */}
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
                <span className="text-sm font-normal text-gray-500">
                  to start
                </span>
              </h1>
              <p className="text-gray-400 mb-8">Pro features from E£49/mo</p>
              <div className="flex justify-center mb-4">
                <Link
                  to={"/priecing"}
                  className=" w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl text-center hover:opacity-100 transition duration-300"
                >
                  Continue Learning {">"}
                </Link>
              </div>
              {/* . */}

              <div className="flex items-center gap-2">
                <Play size={16} className="text-gray-400" />
                <p>5h of video lessons</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Code size={16} className="text-gray-400" />
                <p>18 real projects</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Award size={16} className="text-gray-400" />
                <p>Certificate of completetion</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Zap size={16} className="text-gray-400" />
                <p>Lifetime access</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
export default TrackPage;
