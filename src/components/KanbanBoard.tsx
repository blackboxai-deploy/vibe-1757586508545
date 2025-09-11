'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/lib/types';

export function KanbanBoard() {
  const { getTasksByStatus } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: getTasksByStatus('todo'),
      color: 'border-blue-200 dark:border-blue-800',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: getTasksByStatus('in-progress'),
      color: 'border-yellow-200 dark:border-yellow-800',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/50',
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: getTasksByStatus('completed'),
      color: 'border-green-200 dark:border-green-800',
      bgColor: 'bg-green-50 dark:bg-green-950/50',
    },
  ];

  const handleAddTask = (status: Task['status']) => {
    setNewTaskStatus(status);
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kanban Board</h2>
          <p className="text-muted-foreground">
            Organize and track your tasks with drag-and-drop functionality
          </p>
        </div>
        <Button onClick={() => handleAddTask('todo')}>
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Card key={column.id} className={`${column.color} ${column.bgColor}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {column.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="bg-background text-foreground text-sm px-2 py-1 rounded-full">
                    {column.tasks.length}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddTask(column.id as Task['status'])}
                    className="h-6 w-6 p-0"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {column.tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <svg className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm">No tasks yet</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleAddTask(column.id as Task['status'])}
                    className="mt-2"
                  >
                    Add your first task
                  </Button>
                </div>
              ) : (
                column.tasks.map((task) => (
                  <div key={task.id} className="transform transition-all hover:scale-[1.02]">
                    <TaskCard task={task} onEdit={handleEditTask} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <TaskForm
        isOpen={showTaskForm}
        onClose={handleCloseForm}
        task={editingTask}
        defaultStatus={newTaskStatus}
      />
    </div>
  );
}