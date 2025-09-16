import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { AppState, Screen, TimerState } from '../App';

interface TimerScreenProps {
  appState: AppState;
  onNavigate: (screen: Screen) => void;
  updateAppState: (newState: Partial<AppState>) => void;
}

export function TimerScreen({ appState, onNavigate, updateAppState }: TimerScreenProps) {
  const [pomodoroSettings, setPomodoroSettings] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    currentCycle: 'work' as 'work' | 'shortBreak' | 'longBreak',
    cycleCount: 0
  });
  
  const [countdownDuration, setCountdownDuration] = useState(10);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [linkedTaskId, setLinkedTaskId] = useState(appState.timer.linkedTaskId || 'none');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (appState.timer.isRunning) {
      interval = setInterval(() => {
        updateAppState({
          timer: {
            ...appState.timer,
            timeLeft: Math.max(0, appState.timer.timeLeft - 1)
          }
        });
        
        if (appState.timer.type === 'stopwatch') {
          setStopwatchTime(prev => prev + 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [appState.timer.isRunning, appState.timer.timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (type: TimerState['type'], duration?: number) => {
    let timeLeft = duration || appState.timer.timeLeft;
    
    if (type === 'pomodoro') {
      timeLeft = pomodoroSettings[pomodoroSettings.currentCycle] * 60;
    } else if (type === 'countdown') {
      timeLeft = countdownDuration * 60;
    } else if (type === 'stopwatch') {
      timeLeft = 0;
      setStopwatchTime(0);
    }

    updateAppState({
      timer: {
        type,
        isRunning: true,
        timeLeft,
        linkedTaskId: linkedTaskId === 'none' ? undefined : linkedTaskId
      }
    });
  };

  const pauseTimer = () => {
    updateAppState({
      timer: {
        ...appState.timer,
        isRunning: false
      }
    });
  };

  const stopTimer = () => {
    updateAppState({
      timer: {
        ...appState.timer,
        isRunning: false,
        timeLeft: appState.timer.type === 'stopwatch' ? 0 : appState.timer.timeLeft
      }
    });
    
    if (appState.timer.type === 'stopwatch') {
      setStopwatchTime(0);
    }
  };

  const resetTimer = () => {
    let timeLeft = 0;
    
    if (appState.timer.type === 'pomodoro') {
      timeLeft = pomodoroSettings[pomodoroSettings.currentCycle] * 60;
    } else if (appState.timer.type === 'countdown') {
      timeLeft = countdownDuration * 60;
    }

    updateAppState({
      timer: {
        ...appState.timer,
        isRunning: false,
        timeLeft
      }
    });
    
    if (appState.timer.type === 'stopwatch') {
      setStopwatchTime(0);
    }
  };

  const getProgress = () => {
    if (appState.timer.type === 'stopwatch') return 0;
    
    const totalTime = appState.timer.type === 'pomodoro' 
      ? pomodoroSettings[pomodoroSettings.currentCycle] * 60
      : countdownDuration * 60;
    
    return ((totalTime - appState.timer.timeLeft) / totalTime) * 100;
  };

  const displayTime = appState.timer.type === 'stopwatch' ? stopwatchTime : appState.timer.timeLeft;

  return (
    <div className="p-4 md:p-0">
      <div className="md:hidden mb-6">
        <h1>Timer</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="pomodoro" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:w-96 md:mx-auto">
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
            <TabsTrigger value="countdown">Countdown</TabsTrigger>
            <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
          </TabsList>

          {/* Pomodoro */}
          <TabsContent value="pomodoro">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Timer Display */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-center text-xl">
                    {pomodoroSettings.currentCycle === 'work' ? 'Work Time' : 
                     pomodoroSettings.currentCycle === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl md:text-8xl font-mono font-medium mb-4">
                      {formatTime(displayTime)}
                    </div>
                    <Progress value={getProgress()} className="mb-4 h-3" />
                    <div className="text-lg text-muted-foreground">
                      Cycle {pomodoroSettings.cycleCount + 1}
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-3 flex-wrap">
                    {!appState.timer.isRunning ? (
                      <Button onClick={() => startTimer('pomodoro')} size="lg">
                        <Play size={18} className="mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button onClick={pauseTimer} size="lg">
                        <Pause size={18} className="mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button variant="outline" onClick={resetTimer} size="lg">
                      <RotateCcw size={18} className="mr-2" />
                      Reset
                    </Button>
                    <Button variant="outline" onClick={stopTimer} size="lg">
                      <Square size={18} className="mr-2" />
                      Stop
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-medium">{pomodoroSettings.work}</div>
                      <div className="text-sm text-muted-foreground">Work (min)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-medium">{pomodoroSettings.shortBreak}</div>
                      <div className="text-sm text-muted-foreground">Short Break</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-medium">{pomodoroSettings.longBreak}</div>
                      <div className="text-sm text-muted-foreground">Long Break</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Link to Task */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Link to Task</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={linkedTaskId} onValueChange={setLinkedTaskId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a task (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No task</SelectItem>
                        {appState.tasks.filter(t => !t.completed).map(task => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Countdown */}
          <TabsContent value="countdown">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-xl">Countdown Timer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl md:text-8xl font-mono font-medium mb-4">
                      {formatTime(displayTime)}
                    </div>
                    <Progress value={getProgress()} className="mb-4 h-3" />
                  </div>

                  <div className="flex items-center gap-3 justify-center">
                    <Input
                      type="number"
                      value={countdownDuration}
                      onChange={(e) => setCountdownDuration(Number(e.target.value))}
                      min="1"
                      max="120"
                      className="w-24 text-center"
                      disabled={appState.timer.isRunning}
                    />
                    <span>minutes</span>
                  </div>
                  
                  <div className="flex justify-center gap-3 flex-wrap">
                    {!appState.timer.isRunning ? (
                      <Button onClick={() => startTimer('countdown')} size="lg">
                        <Play size={18} className="mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button onClick={pauseTimer} size="lg">
                        <Pause size={18} className="mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button variant="outline" onClick={resetTimer} size="lg">
                      <RotateCcw size={18} className="mr-2" />
                      Reset
                    </Button>
                    <Button variant="outline" onClick={stopTimer} size="lg">
                      <Square size={18} className="mr-2" />
                      Stop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stopwatch */}
          <TabsContent value="stopwatch">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-xl">Stopwatch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl md:text-8xl font-mono font-medium mb-4">
                      {formatTime(stopwatchTime)}
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-3 flex-wrap">
                    {!appState.timer.isRunning ? (
                      <Button onClick={() => startTimer('stopwatch')} size="lg">
                        <Play size={18} className="mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button onClick={pauseTimer} size="lg">
                        <Pause size={18} className="mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button variant="outline" onClick={resetTimer} size="lg">
                      <RotateCcw size={18} className="mr-2" />
                      Reset
                    </Button>
                    <Button variant="outline" onClick={stopTimer} size="lg">
                      <Square size={18} className="mr-2" />
                      Stop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}