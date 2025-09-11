'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTasks } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onViewChange: (view: string) => void;
  currentView: string;
}

export function Sidebar({ onViewChange, currentView }: SidebarProps) {
  const { tasks, projects, getTasksByStatus, getTasksByProject } = useTasks();

  const views = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2H3zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2" />
        </svg>
      ),
    },
    {
      id: 'kanban',
      label: 'Kanban Board',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m0 0V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10" />
        </svg>
      ),
    },
    {
      id: 'tasks',
      label: 'All Tasks',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      count: tasks.length,
    },
  ];

  const statusViews = [
    {
      id: 'todo',
      label: 'To Do',
      count: getTasksByStatus('todo').length,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      count: getTasksByStatus('in-progress').length,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    },
    {
      id: 'completed',
      label: 'Completed',
      count: getTasksByStatus('completed').length,
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
  ];

  const projectColors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
  };

  return (
    <div className="w-64 border-r bg-background/50 backdrop-blur h-[calc(100vh-4rem)]">
      <ScrollArea className="h-full px-4 py-6">
        <div className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-2">
              Navigation
            </h2>
            <div className="space-y-1">
              {views.map((view) => (
                <Button
                  key={view.id}
                  variant={currentView === view.id ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start h-9',
                    currentView === view.id && 'bg-secondary/80'
                  )}
                  onClick={() => onViewChange(view.id)}
                >
                  {view.icon}
                  <span className="ml-2">{view.label}</span>
                  {view.count !== undefined && (
                    <Badge variant="outline" className="ml-auto">
                      {view.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-2">
              By Status
            </h2>
            <div className="space-y-1">
              {statusViews.map((status) => (
                <Button
                  key={status.id}
                  variant={currentView === status.id ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start h-9',
                    currentView === status.id && 'bg-secondary/80'
                  )}
                  onClick={() => onViewChange(status.id)}
                >
                  <div className={cn('h-2 w-2 rounded-full mr-3', status.color)} />
                  <span>{status.label}</span>
                  <Badge variant="outline" className="ml-auto">
                    {status.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-2">
              Projects
            </h2>
            <div className="space-y-1">
              {projects.map((project) => {
                const projectTasks = getTasksByProject(project.id);
                return (
                  <Button
                    key={project.id}
                    variant={currentView === project.id ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start h-9',
                      currentView === project.id && 'bg-secondary/80'
                    )}
                    onClick={() => onViewChange(project.id)}
                  >
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full mr-3',
                        projectColors[project.color as keyof typeof projectColors] || 'bg-gray-500'
                      )}
                    />
                    <span className="truncate">{project.name}</span>
                    <Badge variant="outline" className="ml-auto">
                      {projectTasks.length}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}