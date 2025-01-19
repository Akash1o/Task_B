import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

function Main() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          { id: 1, text: 'Task 1', status: 'To Do' },
          { id: 2, text: 'Task 2', status: 'Progress' },
          { id: 3, text: 'Task 3', status: 'Completed' },
        ];
  });
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (e, task) => {
    setDraggedTaskId(task.id);
  };

  const handleTouchStart = (task) => {
    setDraggedTaskId(task.id);
  };

  const handleDrop = (e, status) => {
    if (draggedTaskId) {
      const updatedTasks = tasks.map((task) =>
        task.id === draggedTaskId ? { ...task, status } : task
      );
      setTasks(updatedTasks);
      setDraggedTaskId(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (status) => {
    if (draggedTaskId) {
      const updatedTasks = tasks.map((task) =>
        task.id === draggedTaskId ? { ...task, status } : task
      );
      setTasks(updatedTasks);
      setDraggedTaskId(null);
    }
  };

  const handleAddTask = () => {
    if (task.trim() === '') return;
    const newTask = {
      id: tasks.length + 1,
      text: task,
      status: 'To Do',
    };
    setTasks([...tasks, newTask]);
    setTask('');
  };

  const handleEditTask = (taskId) => {
    const newTaskText = prompt('Edit task text:');
    if (newTaskText) {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, text: newTaskText } : task
      );
      setTasks(updatedTasks);
    }
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-5xl font-semibold text-fuchsia-600">
          My Kanban
        </h1>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-3">
        <input
          className="w-full sm:w-1/3 h-10 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your task"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['To Do', 'Progress', 'Completed'].map((status) => (
          <div
            key={status}
            className="h-[400px] border-2 border-gray-300 rounded-lg shadow-lg p-4 bg-white"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
            onTouchEnd={() => handleTouchEnd(status)}
          >
            <h2 className="font-bold text-2xl text-gray-700 mb-4">{status}</h2>
            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 bg-gradient-to-r ${
                      status === 'To Do'
                        ? 'from-green-400 via-teal-500 to-blue-500'
                        : status === 'Progress'
                        ? 'from-yellow-400 via-orange-500 to-red-500'
                        : 'from-purple-400 via-indigo-500 to-pink-500'
                    } text-white rounded-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-transform duration-300`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onTouchStart={() => handleTouchStart(task)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{task.text}</span>
                      <div className="flex space-x-2">
                        <FaEdit
                          className="text-gray-100 cursor-pointer hover:text-yellow-300"
                          onClick={() => handleEditTask(task.id)}
                          aria-label="Edit Task"
                        />
                        <FaTrash
                          className="text-gray-100 cursor-pointer hover:text-red-500"
                          onClick={() => handleDeleteTask(task.id)}
                          aria-label="Delete Task"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
