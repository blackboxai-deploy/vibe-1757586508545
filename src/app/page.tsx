'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { StatCards } from '@/components/StatCards';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskList } from '@/components/TaskList';
import { RecentActivity } from '@/components/RecentActivity';
import { useTasks } from '@/hooks/useTasks';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { tasks, getTasksByStatus, getTasksByProject, getProjectById, isLoading } = useTasks();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's an overview of your tasks and projects.
              </p>
            </div>
            
            <StatCards />
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <TaskList 
                  title="Recent Tasks" 
                  description="Your most recently updated tasks"
                  tasks={tasks.slice(0, 6)}
                  showFilters={false}
                />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </div>
        );
      
      case 'kanban':
        return <KanbanBoard />;
      
      case 'tasks':
        return <TaskList />;
      
      case 'todo':
        return (
          <TaskList
            title="Todo Tasks"
            description="Tasks that are waiting to be started"
            tasks={getTasksByStatus('todo')}
          />
        );
      
      case 'in-progress':
        return (
          <TaskList
            title="In Progress Tasks"
            description="Tasks that are currently being worked on"
            tasks={getTasksByStatus('in-progress')}
          />
        );
      
      case 'completed':
        return (
          <TaskList
            title="Completed Tasks"
            description="Tasks that have been finished"
            tasks={getTasksByStatus('completed')}
          />
        );
      
      default:
        // Handle project views
        const projectTasks = getTasksByProject(currentView);
        const project = getProjectById(currentView);
        
        if (project) {
          return (
            <TaskList
              title={`${project.name} Tasks`}
              description={project.description || `Tasks in the ${project.name} project`}
              tasks={projectTasks}
            />
          );
        }
        
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">View Not Found</h2>
            <p className="text-muted-foreground">
              The requested view could not be found.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
        />
        
        <main className="flex-1 p-6 overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}