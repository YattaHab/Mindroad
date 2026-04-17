import icon1 from "../assets/icon1.png";
import icon2 from "../assets/icon2.png";
import icon3 from "../assets/icon3.png";
import icon4 from "../assets/icon4.png";

export default function FeaturesSection() {
  return (
    <section className=" px-5 py-10">
      {/* headings */}
      <div className="text-center">
        <p className="text-primary font-semibold mb-5">WHY CODE JOURNEY</p>
        <h1 className="text-3xl font-semibold mb-3">
          Everything you need to go from
        </h1>
        <h1 className="text-primary text-3xl font-semibold mb-5">
          zero to engineer
        </h1>
        <p className="text-gray-500 mb-20">
          We've combined the best of structured learning, hands-on practice, and{" "}
          <br />
          community support into one platform
        </p>
      </div>

      {/* features */}
      <div className="flex justify-around gap-10 px-10 mb-20">
        {/* 1 */}
        <div className="border rounded-xl py-5 px-7 border-gray-200 flex-1">
          <img src={icon1} alt="icon1" className="w-16 h-16 mb-3" />
          <p className="font-semibold mb-3">Expert Roadmaps</p>
          <p className="text-sm text-gray-500 mb-3">
            Industry-vetted learning paths built by senior engineers and CS
            professors. Know exactly what to learn and why
          </p>
        </div>
        {/* 2 */}
        <div className="border rounded-xl py-5 px-7 border-gray-200 flex-1">
          <img src={icon2} alt="icon2" className="w-16 h-16 mb-3" />
          <p className="font-semibold mb-3">Project-Based Learning</p>
          <p className="text-sm text-gray-500 mb-3">
            Don't just watch tutorials — build real products. Every module ends
            with a hands-on project you can showcase.
          </p>
        </div>
        {/* 3 */}
        <div className="border rounded-xl py-5 px-7 border-gray-200 flex-1">
          <img src={icon3} alt="icon3" className="w-16 h-16 mb-3" />
          <p className="font-semibold mb-3">Gamified Progress</p>
          <p className="text-sm text-gray-500 mb-3">
            Earn XP, unlock badges, maintain streaks, and climb the leaderboard
            as you master new skills
          </p>
        </div>
        {/* 4 */}
        <div className="border rounded-xl py-5 px-7 border-gray-200 flex-1">
          <img src={icon4} alt="icon4" className="w-16 h-16 mb-3" />
          <p className="font-semibold mb-3">Comments and reviews</p>
          <p className="text-sm text-gray-500 mb-3">
            Join thousands of learners, ask questions, get code reviews, and
            learn faster together.
          </p>
        </div>
      </div>
    </section>
  );
}
