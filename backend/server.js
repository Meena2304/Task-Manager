const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ==========================
   DATABASE CONNECTION
========================== */
mongoose
  .connect("mongodb://127.0.0.1:27017/tasknest")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

/* ==========================
   TASK MODEL
========================== */

const Task = mongoose.model("Task", {
  title: String,

  description: String,

  priority: {
    type: String,
    default: "Medium",
  },

  tag: String,

  dueDate: Date,

  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed"],
    default: "To Do",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  completedAt: {
    type: Date,
    default: null,
  },

  pomodoro: {
    remaining: {
      type: Number,
      default: 1500,
    },

    sessionsCompleted: {
      type: Number,
      default: 0,
    },
  },

  focusTime: {
    type: Number,
    default: 0,
  },
});

/* ==========================
   FOCUS SESSION MODEL
========================== */

const FocusSession = mongoose.model("FocusSession", {
  start: Date,
  end: Date,
  duration: Number,
});

/* ==========================
   CREATE TASK
========================== */

app.post("/api/tasks", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create task",
    });
  }
});

/* ==========================
   GET TASKS
========================== */

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch tasks",
    });
  }
});

/* ==========================
   DASHBOARD API
========================== */

app.get("/api/dashboard", async (req, res) => {
  try {
    const tasks = await Task.find();

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const pendingTasks = tasks.filter(
      (task) => task.status !== "Completed"
    ).length;

    const productivity =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      productivity,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
});

/* ==========================
   REAL STREAK API
========================== */

app.get("/api/streak", async (req, res) => {
  try {
    const completedTasks = await Task.find({
      status: "Completed",
      completedAt: { $ne: null },
    }).sort({ completedAt: -1 });

    if (completedTasks.length === 0) {
      return res.json({
        streak: 0,
      });
    }

    const completedDays = [
      ...new Set(
        completedTasks.map((task) =>
          task.completedAt
            .toISOString()
            .split("T")[0]
        )
      ),
    ];

    let streak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < completedDays.length; i++) {
      const expectedDate = new Date(today);

      expectedDate.setDate(
        today.getDate() - i
      );

      const expected =
        expectedDate
          .toISOString()
          .split("T")[0];

      if (
        completedDays.includes(expected)
      ) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ streak });
  } catch (err) {
    res.status(500).json({
      error: "Failed to calculate streak",
    });
  }
});

/* ==========================
   START TASK
========================== */

app.put("/api/tasks/:id/start", async (req, res) => {
  try {
    const task =
      await Task.findByIdAndUpdate(
        req.params.id,
        {
          status: "In Progress",
          "pomodoro.remaining": 10,
        },
        {
          new: true,
        }
      );

    res.json(task);
  } catch (err) {
    res.status(500).json({
      error: "Failed to start task",
    });
  }
});

/* ==========================
   RESUME POMODORO
========================== */

app.put("/api/tasks/:id/resume", async (req, res) => {
  try {
    const task =
      await Task.findByIdAndUpdate(
        req.params.id,
        {
          "pomodoro.remaining": 10,
        },
        {
          new: true,
        }
      );

    res.json(task);
  } catch (err) {
    res.status(500).json({
      error: "Failed to resume session",
    });
  }
});

/* ==========================
   COMPLETE TASK
========================== */

app.put("/api/tasks/:id/complete", async (req, res) => {
  try {
    const task =
      await Task.findByIdAndUpdate(
        req.params.id,
        {
          status: "Completed",
          completedAt: new Date(),
        },
        {
          new: true,
        }
      );

    res.json(task);
  } catch (err) {
    res.status(500).json({
      error: "Failed to complete task",
    });
  }
});

/* ==========================
   SAVE FOCUS SESSION
========================== */

app.post("/api/session", async (req, res) => {
  try {
    const session =
      new FocusSession(req.body);

    await session.save();

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({
      error: "Failed to save session",
    });
  }
});

/* ==========================
   FOCUS ANALYTICS
========================== */

app.get("/api/focus-stats", async (req, res) => {
  try {
    const tasks = await Task.find();

    const totalFocusTime =
      tasks.reduce(
        (sum, task) =>
          sum + task.focusTime,
        0
      );

    const sessionsCompleted =
      tasks.reduce(
        (sum, task) =>
          sum +
          task.pomodoro.sessionsCompleted,
        0
      );

    res.json({
      totalFocusTime,
      sessionsCompleted,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to load analytics",
    });
  }
});

/* ==========================
   POMODORO ENGINE
========================== */

setInterval(async () => {
  const tasks = await Task.find({
    status: "In Progress",
    "pomodoro.remaining": {
      $gt: 0,
    },
  });

  for (const task of tasks) {
    const remaining =
      task.pomodoro.remaining - 1;

    if (remaining <= 0) {
      await Task.findByIdAndUpdate(
        task._id,
        {
          "pomodoro.remaining": 0,

          $inc: {
            "pomodoro.sessionsCompleted": 1,
          },
        }
      );

      continue;
    }

    await Task.findByIdAndUpdate(
      task._id,
      {
        "pomodoro.remaining":
          remaining,

        $inc: {
          focusTime: 1,
        },
      }
    );
  }
}, 1000);

/* ==========================
   SERVER
========================== */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});