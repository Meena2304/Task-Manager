import React, { useEffect, useState } from "react";
import axios from "axios";

function StreakTracker() {

  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/streak"
      );

      setStreak(res.data.streak);

    } catch (error) {
      console.error("Failed to load streak", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow">

      <h2 className="text-2xl font-bold mb-4">
        🔥 Study Streak
      </h2>

      <div className="text-center">

        <p className="text-5xl font-bold text-orange-600">
          {streak}
        </p>

        <p className="text-gray-500">
          Day{streak !== 1 ? "s" : ""}
        </p>

      </div>

    </div>
  );
}

export default StreakTracker;