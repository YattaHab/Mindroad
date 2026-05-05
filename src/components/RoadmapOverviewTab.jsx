import { Play, FileText, Code, Users, Award, Zap } from "lucide-react";

const projects = [
  { num: "P1", name: "Portfolio Website" },
  { num: "P2", name: "Full-Stack Blog" },
  { num: "P3", name: "E-Commerce Platform" },
  { num: "P4", name: "Real-time Chat App" },
  { num: "P5", name: "SaaS Dashboard" },
];

const includes = [
  { icon: Play, label: "5h on-demand video" },
  { icon: FileText, label: "Lesson notes & resources" },
  { icon: Code, label: "18 hands-on projects" },
  { icon: Users, label: "Community forum access" },
  { icon: Award, label: "Certificate of completion" },
  { icon: Zap, label: "Lifetime access" },
];

export default function RoadmapOverviewTab() {
  return (
    <div>
      {/* Projects you'll build */}
      <h2 className="text-2xl font-bold mb-5 mt-8">Projects you'll build</h2>
      <div className="grid grid-cols-2 gap-3">
        {projects.map((project) => (
          <div
            key={project.num}
            className="flex items-center gap-3 rounded-lg px-4 py-3 bg-gray-50 max-w-sm"
          >
            <span className="bg-[#423ef7] text-white py-1 px-2 rounded-lg">
              {project.num}
            </span>
            <span className="text-gray-600">{project.name}</span>
          </div>
        ))}
      </div>

      {/* This track includes */}
      <h2 className="text-2xl font-bold mb-5 mt-8">This track includes</h2>
      <div className="grid grid-cols-2 gap-3">
        {includes.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon size={16} className="text-[#3947f8]" />
            <p className="text-gray-600">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
