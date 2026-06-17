import { useEffect, useState } from "react";
import axios from "axios";

export default function Badges() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const dashboardRes = await axios.get(
        "http://localhost:5000/api/dashboard"
      );

      const streakRes = await axios.get(
        "http://localhost:5000/api/streak"
      );

      const {
        completedTasks,
        productivity
      } = dashboardRes.data;

      const { streak } = streakRes.data;

      let earnedBadges = [];

      if (completedTasks >= 1)
        earnedBadges.push({
          icon: "🎯",
          title: "First Task",
          description: "Completed your first task"
        });

      if (completedTasks >= 10)
        earnedBadges.push({
          icon: "🏆",
          title: "Goal Crusher",
          description: "Completed 10 tasks"
        });

      if (completedTasks >= 50)
        earnedBadges.push({
          icon: "👑",
          title: "Productivity Master",
          description: "Completed 50 tasks"
        });

      if (streak >= 3)
        earnedBadges.push({
          icon: "🔥",
          title: "Consistency Starter",
          description: "3 Day Streak"
        });

      if (streak >= 7)
        earnedBadges.push({
          icon: "⚡",
          title: "Productivity Hero",
          description: "7 Day Streak"
        });

      if (streak >= 30)
        earnedBadges.push({
          icon: "🚀",
          title: "Unstoppable",
          description: "30 Day Streak"
        });

      if (productivity >= 80)
        earnedBadges.push({
          icon: "📈",
          title: "High Performer",
          description: "80% Productivity"
        });

      setBadges(earnedBadges);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#7C2D12]">
          Achievements
        </h2>

        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
          {badges.length} Earned
        </span>
      </div>

      {badges.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-semibold text-gray-500">
            No Badges Yet
          </h3>

          <p className="text-gray-400 mt-2">
            Complete tasks to unlock achievements.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                gap-4
                bg-gradient-to-r
                from-orange-50
                to-orange-100
                border
                border-orange-200
                rounded-2xl
                p-4
                hover:scale-105
                transition
                duration-300
              "
            >
              <div className="text-4xl">
                {badge.icon}
              </div>

              <div>
                <h3 className="font-bold text-[#7C2D12]">
                  {badge.title}
                </h3>

                <p className="text-gray-600 text-sm">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}