import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Play,
  Star,
  Users,
  FileText,
  Code,
  Award,
  Zap,
  Bookmark,
  SquareCheck,
  Square,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

import { mockTracks, mockRoadmaps, mockRoadmapData } from "../data/mockTracks";
import Footer from "../components/Footer";

function RoadmapPage() {
  const [isLoggedIn, SetIsLoggedIn] = useState(false);
  const mockUser = {
    name: "Toka Moustafa",
    image: "https://via.placeholder.com/32",
  };

  const { trackId, roadmapId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const track = mockTracks.find((t) => t.track_id === parseInt(trackId));
  const roadmap = mockRoadmaps.find((r) => r.rid === parseInt(roadmapId));
  // const roadmaps = mockRoadmaps.filter((r) => r.track_id === parseInt(trackId));

  const [openTopics, setOpenTopics] = useState({});
  const [completed, setCompleted] = useState({});
  const [bookmarked, setBookmarked] = useState({});

  const isTopicCompleted = (topic, topicKey) => {
    return topic.resources.every((_, rIndex) => {
      const resKey = `${topicKey}-${rIndex}`;
      return completed[resKey];
    });
  };

  if (!track) return <p>Track not found</p>;

  return (
    <div>
      {/* the bg the track img -----------*/}
      <div
        className="relative"
        style={{
          backgroundImage: `url(${track.icon_url})`,
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-black/50 " />
        <div className="relative z-10">
          <Navbar isLoggedIn={isLoggedIn} user={mockUser} />
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
              <p>{track.name}</p>
              <p>{">"}</p>

              <p>{roadmap.name}</p>
            </div>
            {/* 2 */}
            <div className="flex items-center font-semibold">
              <Star size={16} className="fill-[#ffb900] mr-2 text-[#ffb900]" />
              <h2 className="text-[#ffb900] mr-1">4.9</h2>
              <p className="text-gray-300">(1,240 reviews)</p>
            </div>
            {/* 3 */}
            <h1 className="text-5xl text-white mt-8 font-bold">
              {roadmap.name}
            </h1>
            {/* 4 */}
            <p className="mt-8 text-gray-300 leading-relaxed w-1/2">
              {roadmap.description}
            </p>
            {/* 5 */}
            <div className="flex items-center gap-6 mt-8">
              <div className="text-gray-400 flex items-center gap-2">
                <Clock size={16} />
                <p>6 months</p>
              </div>
              <div className="text-gray-400 flex items-center gap-2">
                <BookOpen size={16} />
                <p>topics</p>
              </div>

              <div className="text-gray-400 flex items-center gap-2">
                <Users size={16} />
                <p>12,400 enrolled</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* content */}
      <section className="py-20 px-10 gap-10 flex ">
        {/* left */}
        <div className="flex-1 ">
          {/* 1 */}
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            <button
              className={`px-3 pb-3 text-sm font-medium transition duration-300 ${activeTab === "overview" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-3 pb-3 text-sm font-medium transition duration-300 ${activeTab === "resources" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => setActiveTab("resources")}
            >
              Resources
            </button>
          </div>
          {/* overview */}
          {activeTab === "overview" && (
            <div>
              {/* 1 */}
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
              {/* - */}
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
              {/* - */}
              <div>
                <h2 className="text-2xl font-bold mb-5 mt-8">
                  Projects you'll build
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {/* 5 */}
                  {[
                    { num: "P1", name: "Portfolio Website" },
                    { num: "P2", name: "Full-Stack Blog" },
                    { num: "P3", name: "E-Commerce Platform" },
                    { num: "P4", name: "Real-time Chat App" },
                    { num: "P5", name: "SaaS Dashboard" },
                  ].map((project) => (
                    <div
                      key={project.num}
                      className="flex items-center gap-3 bg-100 rounded-lg px-4 py-3 bg-gray-50 max-w-sm"
                    >
                      <span className="bg-[#423ef7] text-white py-1 px-2 rounded-lg">
                        {project.num}
                      </span>
                      <span className="text-gray-600">{project.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* d */}
              <div>
                <h2 className="text-2xl font-bold mb-5 mt-8">
                  This track includes
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Play size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">5h on-demand video</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">Lesson notes & resources</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">18 hands-on projects </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">Community forum access</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">Certificate of completio</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[#3947f8]" />
                    <p className="text-gray-600">Lifetime access</p>
                  </div>
                </div>
              </div>
              {/* d */}
            </div>
          )}

          {/* done */}
          {/* resources */}
          {activeTab === "resources" && (
            <div>
              {mockRoadmapData.map((level, lIndex) => (
                <div key={lIndex} className="mb-8">
                  {/* level */}
                  <h2 className="text-xl font-bold mb-4">{level.level}</h2>
                  {level.topics.map((topic, tIndex) => {
                    const topicKey = `${lIndex}-${tIndex}`;
                    const isOpen = openTopics[topicKey];

                    return (
                      <div key={tIndex} className="mb-3">
                        <div className="bg-gray-100 rounded-lg overflow-hidden px-4 py-4">
                          {/* topic */}
                          <div
                            className="flex justify-between items-center cursor-pointer mb-3 "
                            onClick={() =>
                              setOpenTopics({
                                ...openTopics,
                                [topicKey]: !isOpen,
                              })
                            }
                          >
                            <span className="font-semibold">{topic.title}</span>
                            <div className="flex gap-3 items-center">
                              {/* bookmark */}
                              <button
                                hidden={!isLoggedIn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBookmarked({
                                    ...bookmarked,
                                    [topicKey]: !bookmarked[topicKey],
                                  });
                                }}
                              >
                                {bookmarked[topicKey] ? (
                                  <Bookmark size={20} className="fill-black" />
                                ) : (
                                  <Bookmark size={20} />
                                )}
                              </button>
                              {/* complete */}
                              <button
                                hidden={!isLoggedIn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCompleted({
                                    ...completed,
                                    [topicKey]: !completed[topicKey],
                                  });
                                }}
                              >
                                {isTopicCompleted(topic, topicKey) ? (
                                  <SquareCheck
                                    size={20}
                                    className="fill-primary"
                                  />
                                ) : (
                                  <Square size={20} />
                                )}
                              </button>
                              {/* comment */}
                              <Link
                                to={`/tracks/${trackId}/${roadmapId}/${topicKey}/comments`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MessageCircle size={20} />
                              </Link>
                            </div>
                          </div>
                          {/* resources */}

                          <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
                          >
                            <div className="border-t border-gray-300 px-4 py-3">
                              {topic.resources.map((res, rIndex) => {
                                const resKey = `${topicKey}-${rIndex}`;
                                return (
                                  <div
                                    key={rIndex}
                                    className="flex justify-between items-center mb-2 mt-3"
                                  >
                                    {/* link */}
                                    <a
                                      href={res.link}
                                      target="_blank"
                                      onClick={() =>
                                        setCompleted({
                                          ...completed,
                                          [resKey]: true,
                                        })
                                      }
                                      className="text-primary hover:underline"
                                    >
                                      {res.title}
                                    </a>
                                    <div className="flex gap-3 items-center">
                                      {/* complete */}
                                      <button
                                        hidden={!isLoggedIn}
                                        onClick={() =>
                                          setCompleted({
                                            ...completed,
                                            [resKey]: !completed[resKey],
                                          })
                                        }
                                      >
                                        {completed[resKey] ? (
                                          <SquareCheck
                                            size={20}
                                            className="fill-primary"
                                          />
                                        ) : (
                                          <Square size={20} />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          {/* ................................. */}
        </div>
        {/* right */}
        <div className="w-1/4">
          <div className="rounded-2xl shadow-2xl overflow-hidden sticky top-6">
            <img
              src={track.icon_url}
              alt={track.name}
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
export default RoadmapPage;
