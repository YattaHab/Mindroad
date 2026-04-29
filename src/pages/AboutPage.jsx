import { Link } from "react-router-dom";
import {
  Users,
  Globe,
  BookOpen,
  Trophy,
  Target,
  Heart,
  Lightbulb,
  Globe2,
  Code2,
  Server,
  Cpu,
  Bug,
  Database,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatsBar from "../components/StatsBar";
import about from "../assets/about.png";
import { FaGithub } from "react-icons/fa";

const values = [
  {
    icon: <Target size={24} className="text-primary" />,
    bg: "bg-primary/10",
    title: "Structured, Not Random",
    desc: "We believe in clear paths. Every track is carefully sequenced so you always know what to learn and why it matters.",
  },
  {
    icon: <Heart size={24} className="text-pink-500" />,
    bg: "bg-pink-50",
    title: "Learner-First",
    desc: "Every feature, every decision is made with the learner in mind. We track what works and relentlessly improve the experience.",
  },
  {
    icon: <Lightbulb size={24} className="text-yellow-500" />,
    bg: "bg-yellow-50",
    title: "Learning by Doing",
    desc: "Concepts stick when you apply them. That's why every module ends with a real project, not just a quiz.",
  },
  {
    icon: <Globe2 size={24} className="text-green-500" />,
    bg: "bg-green-50",
    title: "Globally Inclusive",
    desc: "Great education shouldn't be a privilege. We offer a meaningful free tier so anyone, anywhere, can start their journey.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <div
        className="bg-[#030712]"
        style={{
          background:
            "radial-gradient(circle at center, #0c0828 0%, #030712 80%)",
        }}
      >
        <Navbar />

        {/* Hero */}
        <section className="text-center px-6 py-32">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
            Our Story
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 mt-8 mx-auto">
            We're on a mission to make <br />
            <span className="text-primary">CS education</span> accessible to
            everyone
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Code Journey was born in 2023 out of a simple frustration: too many
            people knew how to code, but didn't know what to learn, in what
            order, or how to prove their skills to employers. We set out to
            change that.
          </p>
        </section>
      </div>

      {/* Stats */}
      <StatsBar textColor="text-black" />
      <hr className="border-gray-200 mx-10" />

      {/* Problem */}
      <section className="px-10 py-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-gray-50 mt-20 rounded-2xl">
        <div>
          <p className="text-primary text-sm font-semibold uppercase mb-3">
            The Problem We Solve
          </p>

          <h2 className="text-3xl font-bold mb-8">
            The internet has <br /> infinite content. It <br /> doesn't have{" "}
            <span className="text-primary">direction</span>
            <span>.</span>
          </h2>

          <p className="text-gray-500 mb-5">
            Aspiring developers are drowning in options — YouTube channels,
            Udemy courses, blog posts, bootcamps — but no clear answer to the
            question: "What should I actually learn, and in what order?"
          </p>

          <p className="text-gray-500 mb-5">
            We built Code Journey to answer that question definitively. Every
            track is designed by senior engineers and educators who've been on
            both sides of the hiring table. They know what skills matter, what
            sequence makes sense, and what projects prove you're ready.
          </p>
          <p className="text-gray-500">
            Add in a gamified progress system, peer community, and mentor
            feedback, and you get the closest thing to a structured CS degree —
            without the debt or the four-year commitment.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10  h-72 flex items-center justify-center">
          <img src={about} alt="about" className="rounded-2xl" />
        </div>
      </section>

      {/* Values */}
      {/* heading */}
      <div className="mt-20">
        <p className="text-primary text-sm font-semibold uppercase mb-3 flex justify-center">
          our values
        </p>

        <h2 className="text-3xl font-bold mb-8 justify-center flex">
          What we believe in
        </h2>
      </div>

      <section className="px-6 max-w-6xl mx-auto mt-20">
        <div className="grid md:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div
                className={`w-10 h-10 ${v.bg} rounded-xl flex items-center justify-center mb-3`}
              >
                {v.icon}
              </div>

              <h3 className="font-semibold mb-2">{v.title}</h3>

              <p className="text-gray-400 text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="px-32 py-20 mx-auto bg-gray-50 mt-20 rounded-2xl">
        <div className="mb-20">
          <p className="text-primary text-sm font-semibold uppercase mb-3 flex justify-center">
            our team
          </p>

          <h2 className="text-3xl font-bold mb-8 justify-center flex">
            Built by engineers who've been there
          </h2>
          <p className="text-gray-500 flex justify-center items-center">
            Our team combines decades of industry experience with a deep passion{" "}
            for education.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Member 1 */}
          <div className="py-10 bg-white border border-gray-300 rounded-2xl p-6 text-center hover:-translate-y-1 transition">
            <div className="flex items-center justify-center mb-8 gap-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Bug size={24} className="text-purple-500" />
              </div>
              <h3 className="font-bold text-lg">Aya Nassar</h3>
            </div>
            <p className="text-primary text-sm mb-3">Web development testing</p>
            <a
              href="https://github.com/AyaNassar05"
              target="_blank"
              className="text-gray-400 text-sm flex items-center justify-center mt-6"
            >
              <FaGithub size={18} className="mr-1" />
              @AyaNassar05
            </a>
          </div>

          {/* Member 2 */}
          <div className="py-10 bg-white border border-gray-300 rounded-2xl p-6 text-center hover:-translate-y-1 transition">
            <div className="flex items-center justify-center mb-8 gap-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Database size={24} className="text-green-500" />
              </div>
              <h3 className="font-bold text-lg">Habiba Ayman</h3>
            </div>
            <p className="text-primary text-sm mb-3">
              Database Design & Implementation
            </p>
            <a
              href="https://github.com/YattaHab"
              target="_blank"
              className="text-gray-400 text-sm flex items-center justify-center mt-6"
            >
              <FaGithub size={18} className="mr-1" />
              @YattaHab
            </a>
          </div>

          {/* Member 3 */}
          <div className="py-10 bg-white border border-gray-300 rounded-2xl p-6 text-center hover:-translate-y-1 transition">
            <div className="flex items-center justify-center mb-8 gap-2">
              <div className="bg-red-100 p-2 rounded-lg">
                <Code2 className="text-red-500" />
              </div>
              <h3 className="font-bold text-lg">Toka Moustafa</h3>
            </div>
            <p className="text-primary text-sm mb-3">Frontend Development</p>
            <a
              href="https://github.com/Tokaa44"
              target="_blank"
              className="text-gray-400 text-sm flex items-center justify-center mt-6"
            >
              <FaGithub size={18} className="mr-1" />
              @Tokaa44
            </a>
          </div>
        </div>

        {/* ROW 2 (centered) */}
        <div className="flex justify-center gap-6">
          {/* Member 4 */}
          <div className=" py-10 w-full max-w-sm bg-white border border-gray-300 rounded-2xl p-6 text-center hover:-translate-y-1 transition">
            <div className="flex items-center justify-center mb-8 gap-2">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Server className="text-yellow-500" />
              </div>
              <h3 className="font-bold text-lg">Eyad Eldiasty</h3>
            </div>
            <p className="text-primary text-sm mb-3">Backend Development</p>
            <a
              href="https://github.com/Eyad072"
              target="_blank"
              className="text-gray-400 text-sm flex items-center justify-center mt-6"
            >
              <FaGithub size={18} className="mr-1" />
              @Eyad072
            </a>
          </div>

          {/* Member 5 */}
          <div className=" py-10 w-full max-w-sm bg-white border border-gray-300 rounded-2xl p-6 text-center hover:-translate-y-1 transition">
            <div className="flex items-center justify-center mb-8 gap-2">
              <div className="bg-cyan-100 p-2 rounded-lg">
                <Cpu className="text-cyan-500" />
              </div>
              <h3 className="font-bold text-lg">Baher Rabea</h3>
            </div>
            <p className="text-primary text-sm mb-3">Backend Development</p>
            <a
              href="https://github.com/BaherRabea3"
              target="_blank"
              className="text-gray-400 text-sm flex items-center justify-center mt-6"
            >
              <FaGithub size={18} className="mr-1" />
              @BaherRabea3
            </a>
          </div>
        </div>
      </section>

      {/* . */}
      <section className="px-6 max-w-3xl mx-auto mb-20 mt-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to start your journey?
          </h2>

          <p className="text-gray-400 mb-8">
            Join 50,000+ students already learning with Code Journey. It's free
            to get started.{" "}
          </p>

          <div className="flex justify-center gap-4">
            <Link className="text-white font-medium bg-primary px-6 py-3 rounded-xl shadow-lg shadow-gray-400 hover:bg-primary/80 duration-300">
              Browse Tracks {"->"}
            </Link>

            <Link className="border border-white/20 px-6 py-3 rounded-xl bg-gray-200 shadow-lg shadow-gray-400">
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
export default AboutPage;
