import DailyGoals from "../components/DailyGoals";
import StreakTracker from "../components/StreakTracker";
import Badges from "../components/Badges";
import WeeklyReport from "../components/WeeklyReport";
import HeatmapCalendar from "../components/HeatmapCalendar";
import NotificationBell from "../components/NotificationBell";
import Analytics from "./Analytics";

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-orange-50 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold text-[#7C2D12]">
            Welcome Back 
          </h1>

          <p className="text-gray-600 mt-2">
            Track your productivity and stay focused.
          </p>
        </div>

        <NotificationBell />
      </div>

      {/* Hero Card */}
      <div className="
bg-orange-500
text-white
rounded-3xl
p-8
shadow-xl
mb-8
">

        <h2 className="text-3xl font-bold">
          Today's Productivity
        </h2>

        <p className="mt-3 text-lg">
          You're doing amazing. Keep going.
        </p>

        <div className="grid grid-cols-3 gap-6 mt-6">

          <div>
            <h3 className="text-4xl font-bold">12</h3>
            <p>Tasks Done</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">5</h3>
            <p>Day Streak</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">87%</h3>
            <p>Productivity</p>
          </div>

        </div>

      </div>

      {/* Widgets */}
      <div className="grid lg:grid-cols-3 gap-6">

        <DailyGoals />
        <StreakTracker />
        <Badges />

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">

        <WeeklyReport />
        <HeatmapCalendar />

      </div>

      <div className="mt-6">
        <Analytics />
      </div>

    </div>
  );
}