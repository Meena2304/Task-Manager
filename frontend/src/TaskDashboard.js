import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function TaskDashboard() {

  const [tasks, setTasks] = useState([]);
  const [breakPopup, setBreakPopup] = useState(null);
  const [prevTasks, setPrevTasks] = useState([]);
  const hasInitialized = useRef(false);
  const prevTasksRef = useRef([]);
  const [showStretchPrompt, setShowStretchPrompt] = useState(false);
  const playAlarm = () => {
  const audio = new Audio("/alarm.wav");

  audio.play().catch(err => {
    console.log("Alarm blocked by browser:", err);
  });
};

  //  SINGLE refresh function
  const refreshTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch tasks on load
  useEffect(() => {
    refreshTasks();
  }, []);

  // auto refresh every 2 sec (for Pomodoro sync)
 useEffect(() => {
  const interval = setInterval(async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    const newTasks = res.data;

   const justCompleted = newTasks.filter(nt =>
  nt.pomodoro?.remaining === 0 &&
  prevTasksRef.current.find(
    pt =>
      pt._id === nt._id &&
      pt.pomodoro?.remaining > 0
  )
);
 if (
  hasInitialized.current &&
  justCompleted.length > 0
) {
  console.log("JUST COMPLETED:", justCompleted);

  playAlarm();
  setBreakPopup(justCompleted[0]);
}

prevTasksRef.current = newTasks;
setPrevTasks(newTasks);
setTasks(newTasks);

if (!hasInitialized.current) {
  hasInitialized.current = true;
}
   
  }, 2000);

  return () => clearInterval(interval);
}, []);
  // start pomodoro
  const startPomodoro = async (task) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}/start`);
      await refreshTasks();
    } catch (err) {
      console.error("Start failed:", err);
    }
  };
  const resumePomodoro = async (task) => {
  try {
    await axios.put(
      `http://localhost:5000/api/tasks/${task._id}/resume`
    );

    await refreshTasks();
  } catch (err) {
    console.error("Resume failed:", err);
  }
};

  const todoTasks = tasks.filter(t => t.status === "To Do");
  const inProgressTasks = tasks.filter(t => t.status === "In Progress");
  const completedTasks = tasks.filter(t => t.status === "Completed");

  
 return (
  <>
  {breakPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl shadow-xl text-center w-80">

      <h2 className="text-lg font-bold text-green-600">
        🎉 Pomodoro Completed!
      </h2>

      <p className="mt-2 text-sm">
        Take a 5-minute break?
      </p>

      <div className="flex gap-2 justify-center mt-4">

        <button
  className="bg-green-500 text-white px-3 py-1 rounded"
  onClick={() => {
    setBreakPopup(null);
    setShowStretchPrompt(true);
  }}
  
>
  Take Break 🧘
</button>

        <button
          className="bg-gray-400 text-white px-3 py-1 rounded"
          onClick={() => setBreakPopup(null)}
        >
          Skip ⏭
        </button>

      </div>

    </div>

  </div>
)}

{showStretchPrompt && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl shadow-xl text-center w-96">

      <h2 className="text-lg font-bold text-purple-600">
        🧘 Stretch During Your Break?
      </h2>

      <p className="mt-2 text-sm">
        Light stretching can reduce fatigue and improve focus.
      </p>

      <div className="flex justify-center gap-3 mt-5">

        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setShowStretchPrompt(false);
            window.location.href = "#wellness";
          }}
        >
          Yes, Guide Me
        </button>

        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={() => setShowStretchPrompt(false)}
        >
          No Thanks
        </button>

      </div>

    </div>

  </div>
)}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">

      {/* TO DO */}
      <div className="bg-purple-50 rounded-2xl shadow-md p-4 min-h-[150px]">
        <h2 className="font-bold text-purple-600 mb-4 text-lg">To Do ({todoTasks.length})</h2>

        {todoTasks.map(task => (
          <div key={task._id} className="p-3 mb-2 rounded shadow">
            <h3 className="font-bold">{task.title}</h3>
            <p className="text-sm">{task.description}</p>

            <button
              onClick={() => startPomodoro(task)}
              className="bg-blue-500 text-white px-2 py-1 text-xs mt-2 rounded"
            >
              Start Pomodoro
            </button>
          </div>
        ))}
      </div>

      {/* IN PROGRESS */}
      <div className="bg-amber-50 rounded-2xl shadow-md p-4 min-h-[150px]">
        <h2 className="font-bold text-amber-600 mb-4 text-lg">In Progress ({inProgressTasks.length})</h2>

        {inProgressTasks.map(task => (
          <div key={task._id} className="p-3 mb-2 rounded shadow">

            <h3 className="font-bold">{task.title}</h3>
            <p className="text-sm">{task.description}</p>

            <div className="text-xs text-purple-600 mt-1">
              ⏱ {task.pomodoro?.remaining !== undefined
                ? `${Math.floor(task.pomodoro.remaining / 60)}:${String(task.pomodoro.remaining % 60).padStart(2, '0')}`
                : "25:00"}
            </div>
            {task.pomodoro?.remaining === 0 && (
  <button
    onClick={() => resumePomodoro(task)}
    className="bg-purple-500 text-white px-2 py-1 text-xs mt-2 mr-2 rounded"
  >
    Resume Focus 🔄
  </button>
)}

            <button
              onClick={async () => {
                await axios.put(`http://localhost:5000/api/tasks/${task._id}/complete`);
                await refreshTasks();
              }}
              className="bg-green-500 text-white px-2 py-1 text-xs mt-2 rounded"
            >
              Complete
            </button>

          </div>
        ))}
      </div>

      {/* COMPLETED */}
      <div className="bg-emerald-50 rounded-2xl shadow-md p-4 min-h-[150px]">
        <h2 className="font-bold text-emerald-600 mb-4 text-lg">Completed ({completedTasks.length})</h2>

        {completedTasks.map(task => (
          <div key={task._id} className="p-3 mb-2 rounded shadow opacity-70">

            <h3 className="font-bold line-through">{task.title}</h3>
            <p className="text-sm">{task.description}</p>

            <div className="text-xs text-green-600 mt-1">
              ✔ Done
            </div>

          </div>
        ))}
      </div>

    </div>

    
  </>
);
}