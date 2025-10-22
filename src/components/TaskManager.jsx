import React, { useState, useEffect } from "react";
import Button from "./Button";

const useLocalStorageTasks = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    if (text.trim()) {
      setTasks([...tasks, { id: Date.now(), text, completed: false }]);
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return { tasks, addTask, toggleTask, deleteTask };
};

const TaskManager = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useLocalStorageTasks();
  const [newTaskText, setNewTaskText] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(newTaskText);
    setNewTaskText("");
  };

  return (
    <div className="card shadow my-4">
      <div className="card-body">
        <h2 className="card-title mb-4">Task Manager</h2>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mb-3 d-flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="form-control"
          />
          <Button type="submit" variant="primary">
            Add Task
          </Button>
        </form>

        {/* Filter */}
        <div className="mb-3">
          {["all", "active", "completed"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "primary" : "secondary"}
              size="sm"
              className="me-2"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Task list */}
        {filteredTasks.length === 0 ? (
          <p className="text-center text-muted">No tasks found</p>
        ) : (
          <ul className="list-group">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    id={`task-${task.id}`}
                  />
                  <label
                    className={`form-check-label ${
                      task.completed
                        ? "text-decoration-line-through text-muted"
                        : ""
                    }`}
                    htmlFor={`task-${task.id}`}
                  >
                    {task.text}
                  </label>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}

        {/* Stats */}
        <p className="mt-3 text-muted">
          {tasks.filter((t) => !t.completed).length} tasks remaining
        </p>
      </div>
    </div>
  );
};

export default TaskManager;
