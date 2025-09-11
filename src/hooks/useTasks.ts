'use client';

import { useState, useEffect } from 'react';
import { Task, Project, ActivityItem } from '@/lib/types';
import { 
  getTasks, 
  saveTask, 
  deleteTask, 
  getProjects, 
  getActivities,
  initializeStorage 
} from '@/lib/storage';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage
  useEffect(() => {
    const loadData = () => {
      try {
        initializeStorage();
        setTasks(getTasks());
        setProjects(getProjects());
        setActivities(getActivities());
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Create new task
  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveTask(newTask);
    setTasks(getTasks());
    setActivities(getActivities());
  };

  // Update existing task
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const existingTasks = getTasks();
    const taskToUpdate = existingTasks.find(t => t.id === taskId);
    
    if (taskToUpdate) {
      const updatedTask = { 
        ...taskToUpdate, 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      saveTask(updatedTask);
      setTasks(getTasks());
      setActivities(getActivities());
    }
  };

  // Delete task
  const removeTask = (taskId: string) => {
    deleteTask(taskId);
    setTasks(getTasks());
    setActivities(getActivities());
  };

  // Move task to different status
  const moveTask = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
  };

  // Get tasks by status
  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  // Get tasks by project
  const getTasksByProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  // Get project by id
  const getProjectById = (projectId: string) => {
    return projects.find(project => project.id === projectId);
  };

  // Get task statistics
  const getStatistics = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    
    const overdue = tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < new Date() && 
      t.status !== 'completed'
    ).length;

    const highPriority = tasks.filter(t => 
      (t.priority === 'high' || t.priority === 'urgent') && 
      t.status !== 'completed'
    ).length;

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      highPriority,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  return {
    tasks,
    projects,
    activities,
    isLoading,
    createTask,
    updateTask,
    removeTask,
    moveTask,
    getTasksByStatus,
    getTasksByProject,
    getProjectById,
    getStatistics,
  };
};