import { Users, BookOpen, Trophy } from "lucide-react";

export default function StatsBar({ textColor = "text-white" }) {
  return (
    <section>
      {/* stats */}
      <div className="flex items-center justify-around px-5 py-10">
        <div className="text-center">
          <div className="flex gap-2 items-center mb-2 justify-center">
            <Users size={32} className="text-primary" />
            <p className={`text-4xl ${textColor} font-bold`}>50K+</p>
          </div>
          <p className="text-gray-500 ">Acitive Students</p>
        </div>
        <div className="text-center">
          <div className="flex gap-2 items-center mb-2 justify-center">
            <BookOpen size={32} className="text-primary" />

            <p className={`text-4xl ${textColor} font-bold`}>12</p>
          </div>
          <p className="text-gray-500">Learning Tracks</p>
        </div>
        <div className="text-center">
          <div className="flex gap-2 items-center mb-2 justify-center">
            <p className="text-primary text-xl font-bold scale-y-110">
              {"</>"}
            </p>
            <p className={`text-4xl ${textColor} font-bold`}>300+</p>
          </div>
          <p className="text-gray-500">Real Projects</p>
        </div>
        <div className="text-center">
          <div className="flex gap-2 items-center mb-2 justify-center">
            <Trophy size={32} className="text-primary" />

            <p className={`text-4xl ${textColor} font-bold`}>92%</p>
          </div>
          <p className="text-gray-500">Completion Rate</p>
        </div>
      </div>
    </section>
  );
}
