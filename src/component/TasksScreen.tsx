import React, { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { AppState, Screen, Task } from '../App';

interface TasksScreenProps {
  appState: AppState;
  onNavigate: (screen: Screen, itemId?: string) => void;
  updateAppState: (newState: Partial<AppState>) => void;
}

export function TasksScreen({ appState, onNavigate, updateAppState }: TasksScreenProps) {
  const [activeFilter, setActiveFilter] = useState<'inbox' | 'today' | 'completed'>('inbox');

  const formatTime = (time: string) => {
    if (appState.settings.timeFormat === '12h') {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    return time;
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = appState.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    updateAppState({ tasks: updatedTasks });
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = appState.tasks.filter(task => task.id !== taskId);
    updateAppState({ tasks: updatedTasks });
  };

  const getFilteredTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (activeFilter) {
      case 'today':
        return appState.tasks.filter(task => task.dueDate === today);
      case 'completed':
        return appState.tasks.filter(task => task.completed);
      default:
        return appState.tasks.filter(task => !task.completed);
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1>Tasks</h1>
        <Button onClick={() => onNavigate('task-editor')} size="sm">
          <Plus size={16} className="mr-1" />
          Add Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inbox">
            Inbox ({appState.tasks.filter(t => !t.completed).length})
          </TabsTrigger>
          <TabsTrigger value="today">
            Today ({appState.tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({appState.tasks.filter(t => t.completed).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                {activeFilter === 'completed' 
                  ? 'No completed tasks' 
                  : activeFilter === 'today'
                  ? 'No tasks due today'
                  : 'No pending tasks'
                }
              </p>
              {activeFilter !== 'completed' && (
                <Button onClick={() => onNavigate('task-editor')}>
                  <Plus size={16} className="mr-1" />
                  Add Your First Task
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map(task => (
            <Card key={task.id} className={`transition-opacity ${task.completed ? 'opacity-60' : ''}`}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {task.dueDate === new Date().toISOString().split('T')[0] ? 'Today' : task.dueDate}
                          {task.dueTime && ` at ${formatTime(task.dueTime)}`}
                        </div>
                      )}
                      {task.hasAlarm && (
                        <Badge variant="outline" className="text-xs">
                          Alarm set
                        </Badge>
                      )}
                      {task.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onNavigate('task-editor', task.id)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* FAB for mobile */}
      <Button
        onClick={() => onNavigate('task-editor')}
        className="fixed bottom-20 right-4 rounded-full w-14 h-14 p-0 shadow-lg md:hidden"
      >
        <Plus size={24} />
      </Button>
    </div>
  );
}