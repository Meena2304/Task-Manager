import { useEffect, useState } from "react";
import axios from "axios";

export default function StatsCards() {

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    productivity: 0
  });

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/dashboard")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));

  }, []);

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <div className="bg-white p-6 rounded-3xl shadow">

        <h3>Total Tasks</h3>

        <p className="text-4xl font-bold text-orange-600">
          {stats.totalTasks}
        </p>

      </div>

      <div className="bg-white p-6 rounded-3xl shadow">

        <h3>Completed</h3>

        <p className="text-4xl font-bold text-green-600">
          {stats.completedTasks}
        </p>

      </div>

      <div className="bg-white p-6 rounded-3xl shadow">

        <h3>Pending</h3>

        <p className="text-4xl font-bold text-red-500">
          {stats.pendingTasks}
        </p>

      </div>

      <div className="bg-white p-6 rounded-3xl shadow">

        <h3>Productivity</h3>

        <p className="text-4xl font-bold text-[#7C2D12]">
          {stats.productivity}%
        </p>

      </div>

    </div>

  );
}