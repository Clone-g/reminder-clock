import React from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { AppState, Screen } from '../App';

interface SettingsScreenProps {
  appState: AppState;
  onNavigate: (screen: Screen) => void;
  updateAppState: (newState: Partial<AppState>) => void;
}

export function SettingsScreen({ appState, onNavigate, updateAppState }: SettingsScreenProps) {
  const updateSetting = (key: keyof AppState['settings'], value: any) => {
    updateAppState({
      settings: {
        ...appState.settings,
        [key]: value
      }
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'productivity-app-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <h1 className="mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label>Time Format</label>
                <div className="text-sm text-muted-foreground">Choose 12-hour or 24-hour format</div>
              </div>
              <Select 
                value={appState.settings.timeFormat} 
                onValueChange={(value: '12h' | '24h') => updateSetting('timeFormat', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12h</SelectItem>
                  <SelectItem value="24h">24h</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <label>Theme</label>
                <div className="text-sm text-muted-foreground">Choose your preferred theme</div>
              </div>
              <Select 
                value={appState.settings.theme} 
                onValueChange={(value: 'light' | 'dark') => updateSetting('theme', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label>Notification Sound</label>
                <div className="text-sm text-muted-foreground">Default sound for alarms and timers</div>
              </div>
              <Select 
                value={appState.settings.notificationSound} 
                onValueChange={(value) => updateSetting('notificationSound', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="gentle">Gentle</SelectItem>
                  <SelectItem value="loud">Loud</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alarm Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Alarms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label>Default Alarm Behavior</label>
                <div className="text-sm text-muted-foreground">What happens when an alarm goes off</div>
              </div>
              <Select 
                value={appState.settings.defaultAlarmBehavior} 
                onValueChange={(value) => updateSetting('defaultAlarmBehavior', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="snooze">Snooze</SelectItem>
                  <SelectItem value="dismiss">Dismiss</SelectItem>
                  <SelectItem value="require-action">Require Action</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={exportData} variant="outline" className="w-full">
              Export All Data
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <div>Total Alarms: {appState.alarms.length}</div>
              <div>Total Tasks: {appState.tasks.length}</div>
              <div>Completed Tasks: {appState.tasks.filter(t => t.completed).length}</div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>Productivity App v1.0.0</div>
            <div>A comprehensive task and time management application</div>
            <div>Built with React and Tailwind CSS</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}