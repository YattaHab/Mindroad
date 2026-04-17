import backGround from "../assets/container.jpg";
import logo from "../assets/logo.png";

export default function SignUpLP() {
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
          {/* wave */}
          <p className="text-5xl">👋</p>

          {/* heading */}
          <div>
            <h2 className="text-white text-3xl font-bold leading-snug">
              Start your journey today
            </h2>

            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "#7d808e" }}
            >
              Join 50,000+ learners mastering computer science through real
              projects and expert roadmaps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
