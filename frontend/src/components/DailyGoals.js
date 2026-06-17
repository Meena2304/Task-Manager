import React, { useEffect, useState } from "react";
import axios from "axios";

function DailyGoals() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/tasks"
      );

      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const total = tasks.length;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">

      <h2 className="text-xl font-bold mb-4">
        🎯 Daily Goals
      </h2>

      <p>
        {completed} of {total} tasks completed
      </p>

      <div className="w-full bg-gray-200 h-4 rounded-full mt-4">

        <div
          className="bg-orange-500 h-4 rounded-full"
          style={{
            width: `${progress}%`
          }}
        />

      </div>

      <p className="mt-3 font-semibold text-orange-600">
        {progress}%
      </p>

    </div>
  );
}

export default DailyGoals;