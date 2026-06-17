import DailyGoals from "../components/DailyGoals";
import StreakTracker from "../components/StreakTracker";
import Badges from "../components/Badges";
import WeeklyReport from "../components/WeeklyReport";
import HeatmapCalendar from "../components/HeatmapCalendar";
import NotificationBell from "../components/NotificationBell";
import Analytics from "./Analytics";

import WellnessSection from "../WellnessSection";
import TaskForm from "../TaskForm";
import TaskDashboard from "../TaskDashboard";

export default function CombinedDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-pink-50">

      {/* Header */}
      <header className="bg-white shadow-md p-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-orange-600">
            TaskNest Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Productivity, Wellness & Task Management in one place.
          </p>
        </div>

        <NotificationBell />
      </header>

      <div className="p-6">

        {/* Productivity Hero */}
        <div className="bg-orange-500 text-white rounded-3xl p-8 shadow-xl mb-8">
          <h2 className="text-3xl font-bold">
            Today's Productivity
          </h2>

          <p className="mt-3 text-lg">
            You're doing amazing. Keep going.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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

        {/* Wellness Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Wellness Tracker
          </h2>

          <div className="flex justify-center">
            <WellnessSection />
          </div>
        </div>

        {/* Task Management */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">
            Task Management
          </h2>

          <div className="flex flex-col lg:flex-row gap-8 justify-center">
            <TaskForm />
            <TaskDashboard />
          </div>
        </div>

        {/* Productivity Widgets */}
        <div className="grid lg:grid-cols-3 gap-6">
          <DailyGoals />
          <StreakTracker />
          <Badges />
        </div>

        {/* Reports */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <WeeklyReport />
          <HeatmapCalendar />
        </div>

        {/* Analytics */}
        <div className="mt-6">
          <Analytics />
        </div>

      </div>
    </div>
  );
}