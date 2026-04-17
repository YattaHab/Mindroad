import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaTwitter, FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <section className="px-10 py-20 bg-[#030712]">
      <div className="flex  justify-between margin-auto">
        {/* 1 */}
        <div className="w-2/6">
          {/* logo */}
          <Link to="/" className="flex items-center gap-1">
            <img src={logo} alt="logo" className="w-8 h-8" />
            <div>
              <span className="text-white font-bold text-xl">Mind</span>
              <span className="text-secondary font-bold text-xl">Road</span>
            </div>
          </Link>
          <p className="text-gray-300 mt-5">
            Master computer science through <br /> expert-designed roadmaps,
            real projects, <br /> and a thriving community.
          </p>
          <div className="flex gap-2 mt-6">
            <div className="bg-white/10 p-3 rounded-lg">
              <FaTwitter size={16} className="text-gray-400" />
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <FaGithub size={16} className="text-gray-400" />
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <FaLinkedin size={16} className="text-gray-400" />
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <FaYoutube size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
        {/* 2 */}
        <div className="w-1/6">
          <h1 className="text-white font-semibold">Platform</h1>
          {["Tracks", "Projects", "Roadmaps", "community"].map((item) => (
            <div key={item} className="text-gray-300 mt-5 text-sm">
              {item}
            </div>
          ))}
        </div>
        {/* 3 */}
        <div className="w-1/6">
          <h1 className="text-white font-semibold">Company</h1>
          {["About", "Blog", "Careers"].map((item) => (
            <div key={item} className="text-gray-300 mt-5 text-sm">
              {item}
            </div>
          ))}
        </div>
        {/* 4 */}
        <div className="w-1/6">
          <h1 className="text-white font-semibold">Support</h1>
          {["Help Center", "Contact Us"].map((item) => (
            <div key={item} className="text-gray-300 mt-5 text-sm">
              {item}
            </div>
          ))}
        </div>
        {/* 5 */}
        <div className="w-1/6">
          {" "}
          <h1 className="text-white font-semibold">Legal</h1>
          {["Terms os Service", "Privacy Policy", "Cookie Policy"].map(
            (item) => (
              <div key={item} className="text-gray-300 mt-5 text-sm">
                {item}
              </div>
            ),
          )}
        </div>
      </div>
      <hr className="border-white/10 mt-20 mx-1 " />
      <p className="text-gray-300 mt-5">
        © 2026 CodeJourney, Inc. All rights reserved.
      </p>
    </section>
  );
}
