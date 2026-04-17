import profile from "../assets/profile.jpg";

export default function ReviewsSec() {
  return (
    <section className="bg-[#030712] px-10 py-16 text-center mx-8 mb-8">
      {/* headings */}
      <p className="text-primary">STUDENTS STORIES</p>
      <h2 className="text-white text-4xl mt-3 font-bold mb-10">
        Real Results from Real Learners
      </h2>
      {/* card */}
      <div className="bg-[#101828] border-white/10 rounded-2xl p-10 ">
        <div className="flex">
          <p className="text-primary text-7xl font-serif text-left"> ❝</p>
          <p className="text-gray-300 text-lg leading-relaxed mx-32 mb-8">
            "Code Journey's structured roadmap helped me go from zero
            programming knowledge to landing a frontend engineering role in just
            8 months. The project-based approach made all the difference."
          </p>
        </div>
        {/* profile */}

        <div className="flex items-center justify-center gap-3 mt-3">
          <img
            src={profile}
            alt="Ahmed Hassan"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="text-left">
            <p className="text-white text-sm font-semibold ">Ahmed Hassan</p>
            <p className="text-xs" style={{ color: "#7d808e" }}>
              Frontend Engineer@gmail
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
