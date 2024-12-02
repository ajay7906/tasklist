import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TaskForm from './TaskForm'
import TaskList from './TaskList';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');
    const { token, logout } = useAuth();

    const fetchTasks = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/tasks?page=${page}&status=${filter}&sort=${sort}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setTasks(response.data.tasks);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            if (error.response?.status === 401) {
                logout();
            }
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [page, filter, sort]);

    const handleAddTask = async (task) => {
        try {
            await axios.post('http://localhost:5000/api/tasks', task, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleUpdateTask = async (id, updates) => {
        try {
            await axios.patch(`http://localhost:5000/api/tasks/${id}`, updates, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                    <button
                        onClick={logout}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
                
                <div className="mb-6">
                    <TaskForm onSubmit={handleAddTask} />
                </div>

                <div className="mb-4 flex space-x-4">
                    <select
                            
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Tasks</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
    
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Sort by</option>
                            <option value="createdAt:desc">Newest</option>
                            <option value="createdAt:asc">Oldest</option>
                            <option value="dueDate:asc">Due Date</option>
                        </select>
                    </div>
    
                    <TaskList
                        tasks={tasks}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                    />
    
                    <div className="mt-4 flex justify-center space-x-2">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    export default Dashboard;