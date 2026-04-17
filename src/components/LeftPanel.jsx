import backGround from "../assets/container.jpg";
import logo from "../assets/logo.png";
import profile from "../assets/profile.jpg";

export default function LeftPanel() {
  return (
    <div
      className="relative hidden lg:flex w-2/5 min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, rgba(49, 44, 133, 0.6) 0%, rgba(3, 7, 18, 0.8) 50%, #030712 100%)",
      }}
    >
      {/* bg img */}
      <img
        src={backGround}
        alt="backGround"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      {/* bg overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(49, 44, 133, 0.6) 0%, rgba(3, 7, 18, 0.8) 50%, #030712 100%)",
        }}
      ></div>

      {/* content */}
      <div className=" relative z-10 flex flex-col justify-between h-full p-10">
        {/* logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <div>
            <span className="text-white font-bold text-xl">Mind</span>
            <span className="text-secondary font-bold text-xl">Road</span>
          </div>
        </div>

        {/* main content */}
        <div className="mt-8 flex flex-col gap-6 mt-auto mb-auto">
          {/* badge */}

          <div
            className="flex items-center gap-2 w-fit px-3 py-1 rounded-full"
            style={{
              background: "#615FFF1A",
              border: "1px solid rgba(97, 95, 255, 0.3)",
            }}
          >
            <span className="text-secondary text-sm">
              ⚡50,000+ learners worldwide
            </span>
          </div>

          {/* heading */}
          <div>
            <h2 className="text-white text-3xl font-bold leading-snug">
              Welcome back to your
            </h2>
            <h2 className="text-secondary text-3xl font-bold leading-snug">
              learning journey
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "#7d808e" }}
            >
              Pick up right where you left off. Your progress, streaks, and
              projects are all waiting for you.
            </p>
          </div>

          {/* review card */}
          <div
            className="p-4 rounded-xl"
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
          >
            <p className="mb-2 text-xs">⭐️⭐️⭐️⭐️⭐️</p>

            <p className="text-sm leading-relaxed" style={{ color: "#7d808e" }}>
              "Code Journey kept me on track when nothing else would. I landed a
              job at a startup 7 months after signing up."
            </p>
            <div className="flex items-center gap-3 mt-3">
              <img
                src={profile}
                alt="Ahmed Hassan"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-white text-sm font-semibold">Ahmed Hassan</p>
                <p className="text-xs" style={{ color: "#7d808e" }}>
                  Frontend Engineer@gmail
                </p>
              </div>
            </div>
          </div>

          {/* stats */}
          <hr className="mt-3" style={{ borderColor: "#121627" }} />
          <div className="flex gap-6">
            <div>
              <p className="text-white font-bold text-lg">50K+</p>
              <p className="text-xs" style={{ color: "#7d808e" }}>
                Students
              </p>
            </div>
            <div>
              <p className="text-white font-bold text-lg">4.9⭐️</p>
              <p className="text-xs" style={{ color: "#7d808e" }}>
                Avg rating
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
