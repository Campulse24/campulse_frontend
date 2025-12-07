import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { Calendar, Plus, Edit2, Trash2, Check, X, Filter } from 'lucide-react';
import Button from '../components/Button';
import './Planner.css';

const Planner = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        task_type: 'assignment',
        priority: 'medium',
        due_date: '',
    });

    // Fetch tasks on mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // Filter tasks when filter changes
    useEffect(() => {
        if (filter === 'all') {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(tasks.filter(task => task.task_type === filter));
        }
    }, [filter, tasks]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await tasksAPI.getAllTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                // Update existing task
                await tasksAPI.updateTask(editingTask.id, formData);
            } else {
                // Create new task
                await tasksAPI.createTask(formData);
            }
            fetchTasks();
            closeModal();
        } catch (error) {
            console.error('Failed to save task:', error);
            alert('Failed to save task. Please try again.');
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            await tasksAPI.updateTask(task.id, { is_done: !task.is_done });
            fetchTasks();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await tasksAPI.deleteTask(id);
            fetchTasks();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            task_type: task.task_type,
            priority: task.priority,
            due_date: task.due_date || '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTask(null);
        setFormData({
            title: '',
            description: '',
            task_type: 'assignment',
            priority: 'medium',
            due_date: '',
        });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f97316';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="planner-page">
            {/* Header */}
            <div className="planner-header">
                <div>
                    <h1>📚 Academic Planner</h1>
                    <p>Stay on top of your assignments, tests, and classes</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus size={20} />}
                    onClick={() => setShowModal(true)}
                >
                    Add Task
                </Button>
            </div>

            {/* Filters */}
            <div className="planner-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Tasks
                </button>
                <button
                    className={`filter-btn ${filter === 'assignment' ? 'active' : ''}`}
                    onClick={() => setFilter('assignment')}
                >
                    Assignments
                </button>
                <button
                    className={`filter-btn ${filter === 'test' ? 'active' : ''}`}
                    onClick={() => setFilter('test')}
                >
                    Tests
                </button>
                <button
                    className={`filter-btn ${filter === 'class' ? 'active' : ''}`}
                    onClick={() => setFilter('class')}
                >
                    Classes
                </button>
            </div>

            {/* Task List */}
            <div className="tasks-container">
                {loading ? (
                    <div className="loading-state">Loading tasks...</div>
                ) : filteredTasks.length === 0 ? (
                    <div className="empty-state">
                        <Calendar size={64} color="var(--color-secondary)" />
                        <h3>No tasks yet</h3>
                        <p>Create your first task to get started!</p>
                    </div>
                ) : (
                    <div className="tasks-grid">
                        {filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`task-card ${task.is_done ? 'task-done' : ''}`}
                            >
                                <div className="task-header">
                                    <button
                                        className="task-checkbox"
                                        onClick={() => handleToggleComplete(task)}
                                    >
                                        {task.is_done ? <Check size={18} /> : null}
                                    </button>
                                    <span className={`task-type-badge task-type-${task.task_type}`}>
                                        {task.task_type}
                                    </span>
                                    <div
                                        className="task-priority"
                                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                                        title={`${task.priority} priority`}
                                    />
                                </div>

                                <h3 className="task-title">{task.title}</h3>
                                {task.description && (
                                    <p className="task-description">{task.description}</p>
                                )}

                                <div className="task-footer">
                                    <span className="task-date">
                                        <Calendar size={16} />
                                        {formatDate(task.due_date)}
                                    </span>
                                    <div className="task-actions">
                                        <button
                                            className="task-action-btn"
                                            onClick={() => openEditModal(task)}
                                            title="Edit task"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="task-action-btn delete"
                                            onClick={() => handleDeleteTask(task.id)}
                                            title="Delete task"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTask} className="task-form">
                            <div className="form-group">
                                <label>Task Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Complete Math Assignment"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Add more details..."
                                    rows={4}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Task Type *</label>
                                    <select
                                        value={formData.task_type}
                                        onChange={(e) => setFormData({ ...formData, task_type: e.target.value })}
                                        required
                                    >
                                        <option value="assignment">Assignment</option>
                                        <option value="test">Test</option>
                                        <option value="class">Class</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Priority *</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        required
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                />
                            </div>

                            <div className="modal-actions">
                                <Button type="button" variant="ghost" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    {editingTask ? 'Update Task' : 'Create Task'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planner;
