import { CheckCircle } from "lucide-react";

import { Link } from "react-router-dom";

export default function PricingSec({ isLoggedIn = false }) {
  return (
    <section
      className="px-10 py-20 m-32 rounded-2xl p-16 text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #4F39F6 0%, #7008E7 100%)",
      }}
    >
      {/* 1 */}
      <div className="inline-flex bg-white/20 py-1 px-3 rounded-full shadow-lg border border-gray-500">
        <p className="text-white ">⚡Join 50,000+ learners today</p>
      </div>
      {/* 2 */}
      <p className="mt-8 text-white text-4xl font-bold">
        Your coding journey starts now
      </p>
      <p className="mt-8 text-gray-300 leading-relaxed mb-8">
        Create your free account in 30 seconds and start your first <br />{" "}
        learning track today. No credit card required
      </p>
      {/* btns */}
      <div className="flex items-center justify-center gap-5 mb-10">
        {!isLoggedIn ? (
          <Link
            to="/signup"
            className="bg-white text-primary py-3 px-5 rounded-xl shadow-lg font-semibold border border-gray-500"
          >
            Get Started Free {">"}
          </Link>
        ) : null}
        <Link
          to="/pricing"
          className="bg-white/20 text-white py-3 px-5 rounded-xl shadow-lg font-semibold border border-gray-500"
        >
          View Pricing
        </Link>
      </div>
      {/* text */}
      <div className="flex items-center justify-center gap-5">
        <p className="text-gray-300 flex items-center justify-center gap-1">
          <CheckCircle size={16} />
          Free plan available
        </p>
        <p className="text-gray-300 flex items-center justify-center gap-1">
          <CheckCircle size={16} />
          Cancel anytime
        </p>
        <p className="text-gray-300 flex items-center justify-center gap-1">
          <CheckCircle size={16} />
          SSL secured
        </p>
      </div>

      <div className="absolute -top-32 -right-32 bg-white/10 p-40 rounded-full " />
      <div className="absolute -bottom-40 -left-40 bg-white/10 p-40 rounded-full" />
    </section>
  );
}
