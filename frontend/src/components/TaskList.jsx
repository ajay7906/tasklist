import React, { useState } from 'react';

function TaskList({ tasks, onUpdate, onDelete }) {
    const [editingTask, setEditingTask] = useState(null);

    const handleStatusUpdate = (task) => {
        const formData = new FormData();
        formData.append('status', task.status === 'pending' ? 'completed' : 'pending');
        onUpdate(task._id, formData);
    };

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <div
                    key={task._id}
                    className="bg-white shadow rounded-lg p-4"
                >
                    {editingTask === task._id ? (
                        <TaskForm
                            initialData={task}
                            onSubmit={(formData) => {
                                onUpdate(task._id, formData);
                                setEditingTask(null);
                            }}
                        />
                    ) : (
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium">
                                        {task.title}
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        {task.description}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleStatusUpdate(task)}
                                        className={`px-3 py-1 rounded-md text-sm ${
                                            task.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {task.status}
                                    </button>
                                    <button
                                        onClick={() => setEditingTask(task._id)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                       
                                    </button>
                                    <button
                                        onClick={() => onDelete(task._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            {task.attachment && (
                                <div className="mt-2">
                                    <a
                                        href={`http://localhost:5000/${task.attachment}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        View Attachment
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
            {tasks.length === 0 && (
                <div className="text-center text-gray-500">
                    No tasks found
                </div>
            )}
        </div>
    );
}

export default TaskList;