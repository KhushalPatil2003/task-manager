import { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import taskService from '../services/taskService';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ priority: 'all', completed: 'all' });
  const [sort, setSort] = useState({ sortBy: 'createdAt', sortOrder: 'desc' });
  
  
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // 6 tasks per page
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalTasks: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  
  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskService.getTasks(
        filters,
        sort,
        { page, limit }
      );
      if (response.success) {
        setTasks(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks from server.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTasks();
  }, [filters, sort, page]);

  
  const triggerSuccessFlash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3500);
  };

  
  const handleToggleComplete = async (taskId, currentCompletedStatus) => {
    try {
      const response = await taskService.updateTask(taskId, { completed: currentCompletedStatus });
      if (response.success) {
      
        triggerSuccessFlash('Task status updated.');
        fetchTasks();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  const handleFormSubmit = async (taskData) => {
    try {
      let response;
      if (taskToEdit) {
        response = await taskService.updateTask(taskToEdit.id, taskData);
        triggerSuccessFlash('Task updated successfully.');
      } else {
        response = await taskService.createTask(taskData);
        triggerSuccessFlash('Task created successfully.');
      }

      if (response.success) {
        setIsFormOpen(false);
        setTaskToEdit(null);
        fetchTasks();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
    }
  };

  
  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  
  const handleDeleteClick = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await taskService.deleteTask(taskId);
        if (response.success) {
          triggerSuccessFlash('Task deleted successfully.');
          
          
          if (tasks.length === 1 && page > 1) {
            setPage(page - 1);
          } else {
            fetchTasks();
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task.');
      }
    }
  };

  
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); 
  };

  
  const handleSortChange = (sortByField) => {
    setSort(prev => {
      const isSameField = prev.sortBy === sortByField;
      const nextOrder = isSameField && prev.sortOrder === 'asc' ? 'desc' : 'asc';
      return { sortBy: sortByField, sortOrder: nextOrder };
    });
    setPage(1);
  };


  const filteredTasks = tasks.filter(task => {
    const query = searchQuery.toLowerCase();
    const titleMatch = task.title?.toLowerCase().includes(query);
    const descMatch = task.description?.toLowerCase().includes(query);
    return titleMatch || descMatch;
  });

  
  const stats = {
    total: pagination.totalTasks || 0,
    completed: tasks.filter(t => t.completed).length, 
    pending: tasks.filter(t => !t.completed).length
  };

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-content">
        {/* Banner notifications */}
        {success && <div className="alert alert-success toast">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Dashboard Header Panel */}
        <section className="dashboard-header-panel">
          <div className="welcome-banner">
            <h1>Workspace Dashboard</h1>
            <p>Welcome back! You have <strong>{pagination.totalTasks}</strong> tasks registered in your workspace.</p>
          </div>
          <button className="btn btn-primary btn-add-task" onClick={() => { setTaskToEdit(null); setIsFormOpen(true); }}>
            ➕ Create Task
          </button>
        </section>

        {/* Filters and Controls Area */}
        <section className="controls-panel-glass">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="filter-group">
            <div className="filter-item">
              <label>Status</label>
              <select
                value={filters.completed}
                onChange={(e) => handleFilterChange('completed', e.target.value)}
                className="form-control"
              >
                <option value="all">All</option>
                <option value="true">Completed</option>
                <option value="false">Active</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="form-control"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="sorting-group">
            <label className="sorting-label">Sort by:</label>
            <button
              onClick={() => handleSortChange('createdAt')}
              className={`btn btn-sm btn-sort ${sort.sortBy === 'createdAt' ? 'active' : ''}`}
            >
              Date Created {sort.sortBy === 'createdAt' && (sort.sortOrder === 'asc' ? '▲' : '▼')}
            </button>
            <button
              onClick={() => handleSortChange('dueDate')}
              className={`btn btn-sm btn-sort ${sort.sortBy === 'dueDate' ? 'active' : ''}`}
            >
              Due Date {sort.sortBy === 'dueDate' && (sort.sortOrder === 'asc' ? '▲' : '▼')}
            </button>
            <button
              onClick={() => handleSortChange('priority')}
              className={`btn btn-sm btn-sort ${sort.sortBy === 'priority' ? 'active' : ''}`}
            >
              Priority {sort.sortBy === 'priority' && (sort.sortOrder === 'asc' ? '▲' : '▼')}
            </button>
          </div>
        </section>

        {/* Tasks grid rendering section */}
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading tasks database...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state-glass">
            <div className="empty-icon">📁</div>
            <h2>No tasks found</h2>
            <p>{searchQuery ? 'No tasks match your search text.' : 'You have no tasks in this view. Create a new task to get started!'}</p>
            {!searchQuery && (
              <button 
                className="btn btn-primary" 
                onClick={() => { setTaskToEdit(null); setIsFormOpen(true); }}
                style={{ marginTop: '16px' }}
              >
                Create First Task
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>

            {/* Pagination Panel */}
            {pagination.totalPages > 1 && (
              <section className="pagination-bar">
                <button
                  className="btn btn-outline btn-sm btn-page"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage(page - 1)}
                >
                  ◀ Prev
                </button>
                <span className="page-indicator">
                  Page <strong>{pagination.page}</strong> of {pagination.totalPages}
                </span>
                <button
                  className="btn btn-outline btn-sm btn-page"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage(page + 1)}
                >
                  Next ▶
                </button>
              </section>
            )}
          </>
        )}

        {/* Form Modal overlay drawer */}
        {isFormOpen && (
          <TaskForm
            taskToEdit={taskToEdit}
            onSubmit={handleFormSubmit}
            onClose={() => { setIsFormOpen(false); setTaskToEdit(null); }}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
