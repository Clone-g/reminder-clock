import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { AlarmsScreen } from './components/AlarmsScreen';
import { AlarmEditorScreen } from './components/AlarmEditorScreen';
import { TasksScreen } from './components/TasksScreen';
import { TaskEditorScreen } from './components/TaskEditorScreen';
import { TimerScreen } from './components/TimerScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { Button } from './components/ui/button';
import { Home, Clock, CheckSquare, Timer, Settings, Menu, X } from 'lucide-react';

export type Screen = 'home' | 'alarms' | 'alarm-editor' | 'tasks' | 'task-editor' | 'timer' | 'settings';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  active: boolean;
  repeat: 'never' | 'daily' | 'custom';
  sound: string;
  linkedTaskId?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
  hasAlarm: boolean;
  linkedAlarmId?: string;
  tags: string[];
}

export interface TimerState {
  type: 'pomodoro' | 'countdown' | 'stopwatch';
  isRunning: boolean;
  timeLeft: number;
  linkedTaskId?: string;
}

export interface AppState {
  alarms: Alarm[];
  tasks: Task[];
  timer: TimerState;
  settings: {
    timeFormat: '12h' | '24h';
    notificationSound: string;
    defaultAlarmBehavior: string;
    theme: 'light' | 'dark';
  };
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [appState, setAppState] = useState<AppState>({
    alarms: [
      {
        id: '1',
        time: '07:00',
        label: 'Morning Alarm',
        active: true,
        repeat: 'daily',
        sound: 'default',
      },
      {
        id: '2',
        time: '22:00',
        label: 'Bedtime',
        active: false,
        repeat: 'daily',
        sound: 'default',
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Review project proposal',
        description: 'Go through the Q1 project proposal and provide feedback',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '10:00',
        hasAlarm: true,
        tags: ['work', 'urgent']
      },
      {
        id: '2',
        title: 'Grocery shopping',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        hasAlarm: false,
        tags: ['personal']
      },
      {
        id: '3',
        title: 'Call mom',
        completed: true,
        hasAlarm: false,
        tags: ['personal']
      }
    ],
    timer: {
      type: 'pomodoro',
      isRunning: false,
      timeLeft: 25 * 60, // 25 minutes in seconds
    },
    settings: {
      timeFormat: '24h',
      notificationSound: 'default',
      defaultAlarmBehavior: 'snooze',
      theme: 'light'
    }
  });

  const navigateToScreen = (screen: Screen, itemId?: string) => {
    if (screen === 'alarm-editor') {
      setEditingAlarmId(itemId || null);
    } else if (screen === 'task-editor') {
      setEditingTaskId(itemId || null);
    }
    setCurrentScreen(screen);
    // Close mobile sidebar after navigation
    setSidebarOpen(false);
  };

  const updateAppState = (newState: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...newState }));
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'alarms', label: 'Alarms', icon: Clock },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen appState={appState} onNavigate={navigateToScreen} />;
      case 'alarms':
        return <AlarmsScreen appState={appState} onNavigate={navigateToScreen} updateAppState={updateAppState} />;
      case 'alarm-editor':
        return <AlarmEditorScreen 
          appState={appState} 
          editingAlarmId={editingAlarmId}
          onNavigate={navigateToScreen} 
          updateAppState={updateAppState} 
        />;
      case 'tasks':
        return <TasksScreen appState={appState} onNavigate={navigateToScreen} updateAppState={updateAppState} />;
      case 'task-editor':
        return <TaskEditorScreen 
          appState={appState} 
          editingTaskId={editingTaskId}
          onNavigate={navigateToScreen} 
          updateAppState={updateAppState} 
        />;
      case 'timer':
        return <TimerScreen appState={appState} onNavigate={navigateToScreen} updateAppState={updateAppState} />;
      case 'settings':
        return <SettingsScreen appState={appState} onNavigate={navigateToScreen} updateAppState={updateAppState} />;
      default:
        return <HomeScreen appState={appState} onNavigate={navigateToScreen} />;
    }
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home': return 'Home';
      case 'alarms': return 'Alarms';
      case 'alarm-editor': return editingAlarmId ? 'Edit Alarm' : 'Add Alarm';
      case 'tasks': return 'Tasks';
      case 'task-editor': return editingTaskId ? 'Edit Task' : 'Add Task';
      case 'timer': return 'Timer';
      case 'settings': return 'Settings';
      default: return 'Productivity App';
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:border-r bg-card">
        <div className="p-6 border-b">
          <h2 className="font-semibold">Productivity App</h2>
          <p className="text-sm text-muted-foreground">Manage your time effectively</p>
        </div>
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => navigateToScreen(item.id as Screen)}
                >
                  <Icon size={18} className="mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>
        
        {/* Desktop Stats */}
        <div className="p-4 border-t">
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Active Alarms: {appState.alarms.filter(a => a.active).length}</div>
            <div>Pending Tasks: {appState.tasks.filter(t => !t.completed).length}</div>
            {appState.timer.isRunning && (
              <div className="text-primary">Timer Running</div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-card border-r flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Productivity App</h2>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X size={18} />
              </Button>
            </div>
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => navigateToScreen(item.id as Screen)}
                    >
                      <Icon size={18} className="mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </Button>
            <h1 className="font-semibold">{getScreenTitle()}</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block border-b bg-card p-6">
          <h1 className="text-2xl font-semibold">{getScreenTitle()}</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="md:p-6">
            {renderScreen()}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden border-t bg-card p-2">
          <div className="flex justify-around">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigateToScreen(item.id as Screen)}
                  className="flex flex-col items-center gap-1 h-auto py-2 px-3"
                >
                  <Icon size={18} />
                  <span className="text-xs">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}