import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Clock, Timer, CheckSquare, TrendingUp } from 'lucide-react';
import { AppState, Screen } from '../App';

interface HomeScreenProps {
  appState: AppState;
  onNavigate: (screen: Screen) => void;
}

export function HomeScreen({ appState, onNavigate }: HomeScreenProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = appState.tasks.filter(task => task.dueDate === today && !task.completed);
  const nextAlarm = appState.alarms
    .filter(alarm => alarm.active)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

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

  const formatTimerTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening!';
  };

  const completedTasksToday = appState.tasks.filter(
    task => task.dueDate === today && task.completed
  ).length;

  return (
    <div className="p-4 md:p-0 space-y-6">
      {/* Welcome Section */}
      <div className="md:mb-8">
        <h1 className="mb-2 md:hidden">{getGreeting()}</h1>
        <div className="hidden md:block">
          <h2 className="text-3xl font-semibold mb-2">{getGreeting()}</h2>
          <p className="text-lg text-muted-foreground">Here's your overview for today</p>
        </div>
        <p className="text-muted-foreground md:hidden">Today's overview</p>
      </div>

      {/* Desktop Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats - Desktop Only */}
        <div className="hidden md:block lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={18} />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Alarms</span>
                <span className="text-xl font-semibold">{appState.alarms.filter(a => a.active).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Tasks</span>
                <span className="text-xl font-semibold">{appState.tasks.filter(t => !t.completed).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completed Today</span>
                <span className="text-xl font-semibold text-green-600">{completedTasksToday}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Alarm */}
        {nextAlarm && (
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock size={18} />
                Next Alarm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-medium">{formatTime(nextAlarm.time)}</div>
                  <div className="text-sm text-muted-foreground">{nextAlarm.label}</div>
                </div>
                <Badge variant="secondary">{nextAlarm.repeat}</Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => onNavigate('alarms')}
              >
                Manage Alarms
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Ongoing Timer */}
        {appState.timer.isRunning && (
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Timer size={18} />
                Timer Running
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-medium">{formatTimerTime(appState.timer.timeLeft)}</div>
                  <div className="text-sm text-muted-foreground capitalize">{appState.timer.type}</div>
                </div>
                <Button onClick={() => onNavigate('timer')}>View</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks Due Today */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckSquare size={18} />
              Tasks Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm mb-4">No tasks due today</p>
                <Button onClick={() => onNavigate('task-editor')}>
                  <Plus size={16} className="mr-1" />
                  Add Task
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{task.title}</div>
                      {task.dueTime && (
                        <div className="text-xs text-muted-foreground">
                          Due at {formatTime(task.dueTime)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {task.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                {todayTasks.length > 5 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onNavigate('tasks')}
                    className="w-full"
                  >
                    View {todayTasks.length - 5} more tasks
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => onNavigate('tasks')}
                  className="w-full mt-4"
                >
                  View All Tasks
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => onNavigate('task-editor')} 
              className="w-full flex items-center gap-2"
            >
              <Plus size={18} />
              Add Task
            </Button>
            <Button 
              onClick={() => onNavigate('alarm-editor')} 
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Clock size={18} />
              Add Alarm
            </Button>
            <Button 
              onClick={() => onNavigate('timer')} 
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Timer size={18} />
              Start Timer
            </Button>
          </CardContent>
        </Card>

        {/* Mobile Quick Stats */}
        <div className="md:hidden grid grid-cols-2 gap-4 col-span-full">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-medium">{appState.alarms.filter(a => a.active).length}</div>
              <div className="text-sm text-muted-foreground">Active Alarms</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-medium">{appState.tasks.filter(t => !t.completed).length}</div>
              <div className="text-sm text-muted-foreground">Pending Tasks</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}