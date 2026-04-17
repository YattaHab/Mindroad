import howItWorksSec from "../assets/howItWorksSec.jpg";

const steps = [
  {
    number: "01",
    title: "Choose your track",
    description:
      "Pick from 12 expert-designed learning paths aligned with in-demand CS careers.",
    color: "bg-primary",
  },
  {
    number: "02",
    title: "Follow the roadmap",
    description:
      "Progress through structured levels, modules, and tasks — always knowing what's next.",
    color: "bg-purple-500",
  },
  {
    number: "03",
    title: "Build real projects",
    description:
      "Apply every concept with hands-on projects reviewed by experienced mentors.",
    color: "bg-orange-500",
  },
  {
    number: "04",
    title: "Earn & showcase",
    description:
      "Collect badges, earn certificates, and add verified projects to your portfolio.",
    color: "bg-green-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-10 py-20 flex items-center ">
      {/* left side     */}
      <div className="flex flex-col gap-7 w-1/2">
        <p className="text-primary text-sm font-semibold">HOW IT WORKS</p>
        <div className="flex">
          <h2 className="font-bold text-4xl">
            A clear path from start to{" "}
            <span className="text-primary">hired</span>
          </h2>
        </div>
        <p className="text-gray-500 leading-relaxed">
          No more tutorial hell. Our structured system guides you <br /> from
          your first line of code to landing your dream job.
        </p>

        {/* steps */}
        <div className="flex flex-col gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex iems-start gap-4">
              {/* num */}
              <div className="flex flex-col items-center">
                <div
                  className={`${step.color} text-white font-bold px-3 py-2 rounded-xl min-w-fit`}
                >
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-10 bg-gray-200 my-1" />
                )}
              </div>
              {/* text */}
              <div className="max-w-sm">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* right side */}
      <div className="relative w-1/2">
        {/* img */}
        <img
          src={howItWorksSec}
          alt="how it works"
          className="w-full rounded-xl object-cover"
        />
        {/* progress block */}
        <div className="absolute -bottom-8 -left-8 bg-white rounded-xl p-4 shadow-xl w-60">
          <h4 className="font-semibold mb-2">Today's progress</h4>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              <p className="text-gray-400 line-through">Array problems</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              <p className="text-gray-400 line-through">Binary Search</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <p className="">Tree traversal</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-[#10b981] h-1.5 rounded-full w-2/3" />
          </div>
          <p className="text-gray-400">2/3 tasks done</p>
        </div>
      </div>
    </section>
  );
}
