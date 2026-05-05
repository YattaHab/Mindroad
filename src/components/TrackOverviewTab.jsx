export default function TrackOverviewTab() {
  const learnings = [
    "Build responsive UIs with HTML, CSS & Tailwind",
    "Create interactive SPAs with React & hooks",
    "Work with PostgreSQL databases and ORMs",
    "Containerise apps with Docker",
    "Master JavaScript ES6+ and async programming",
    "Design and build REST APIs with Node.js & Express",
    "Implement JWT authentication and OAuth",
    "Deploy to AWS or Vercel with CI/CD pipelines",
  ];

  const skills = [
    "HTML/CSS",
    "JavaScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "REST APIs",
    "Docker",
    "CI/CD",
  ];

  return (
    <div>
      {/* What you'll learn */}
      <h2 className="text-2xl font-bold mb-5">What you'll learn</h2>
      <div className="grid grid-cols-2 gap-3">
        {learnings.map((item) => (
          <div
            key={item}
            className="flex gap-1 items-center text-gray-600 mb-3"
          >
            <div className="w-4 h-4 rounded-full bg-[#10b981] flex-shrink-0" />
            <p>{item}</p>
          </div>
        ))}
      </div>

      {/* Skills covered */}
      <div>
        <h2 className="text-2xl font-bold mb-5 mt-8">Skills covered</h2>
        <div className="flex gap-3 flex-wrap">
          {skills.map((skill) => (
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
  );
}
