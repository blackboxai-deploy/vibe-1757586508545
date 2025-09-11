import { Task, Project, ActivityItem } from './types';

const STORAGE_KEYS = {
  TASKS: 'taskmanager_tasks',
  PROJECTS: 'taskmanager_projects',
  ACTIVITIES: 'taskmanager_activities',
};

// Task storage functions
export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  try {
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks) : [];
  } catch {
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

export const saveTask = (task: Task): void => {
  const tasks = getTasks();
  const existingIndex = tasks.findIndex(t => t.id === task.id);
  
  if (existingIndex >= 0) {
    tasks[existingIndex] = { ...task, updatedAt: new Date().toISOString() };
  } else {
    tasks.push(task);
  }
  
  saveTasks(tasks);
  addActivity({
    id: `activity_${Date.now()}`,
    type: existingIndex >= 0 ? 'task_updated' : 'task_created',
    message: existingIndex >= 0 
      ? `Updated task: ${task.title}`
      : `Created task: ${task.title}`,
    timestamp: new Date().toISOString(),
    taskId: task.id,
  });
};

export const deleteTask = (taskId: string): void => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    saveTasks(filteredTasks);
    addActivity({
      id: `activity_${Date.now()}`,
      type: 'task_updated',
      message: `Deleted task: ${task.title}`,
      timestamp: new Date().toISOString(),
      taskId: task.id,
    });
  }
};

// Project storage functions
export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') return [];
  try {
    const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return projects ? JSON.parse(projects) : getDefaultProjects();
  } catch {
    return getDefaultProjects();
  }
};

export const saveProjects = (projects: Project[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
  }
};

// Activity storage functions
export const getActivities = (): ActivityItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const activities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return activities ? JSON.parse(activities) : [];
  } catch {
    return [];
  }
};

export const addActivity = (activity: ActivityItem): void => {
  if (typeof window === 'undefined') return;
  try {
    const activities = getActivities();
    activities.unshift(activity);
    // Keep only last 50 activities
    const trimmedActivities = activities.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(trimmedActivities));
  } catch (error) {
    console.error('Failed to save activity:', error);
  }
};

// Initialize default data
const getDefaultProjects = (): Project[] => [
  {
    id: 'project_1',
    name: 'Personal',
    description: 'Personal tasks and goals',
    color: 'blue',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'project_2',
    name: 'Work',
    description: 'Work-related tasks and projects',
    color: 'green',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'project_3',
    name: 'Learning',
    description: 'Educational and skill development',
    color: 'purple',
    createdAt: new Date().toISOString(),
  },
];

// Initialize storage with sample data if empty
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  const tasks = getTasks();
  if (tasks.length === 0) {
    const sampleTasks: Task[] = [
      {
        id: 'task_1',
        title: 'Complete project proposal',
        description: 'Prepare comprehensive proposal for Q1 project including timeline and budget',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: 'project_2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task_2',
        title: 'Review team performance',
        description: 'Conduct quarterly performance reviews for all team members',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: 'project_2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task_3',
        title: 'Learn TypeScript advanced patterns',
        description: 'Study advanced TypeScript patterns including conditional types and mapped types',
        status: 'in-progress',
        priority: 'low',
        projectId: 'project_3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task_4',
        title: 'Plan weekend trip',
        description: 'Research and book accommodation for the upcoming weekend getaway',
        status: 'completed',
        priority: 'low',
        projectId: 'project_1',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task_5',
        title: 'Update portfolio website',
        description: 'Add recent projects and update the design with latest work samples',
        status: 'todo',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: 'project_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    saveTasks(sampleTasks);
  }
  
  // Initialize projects
  getProjects();
};