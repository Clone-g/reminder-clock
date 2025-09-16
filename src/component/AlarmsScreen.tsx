import React from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AppState, Screen, Alarm } from '../App';

interface AlarmsScreenProps {
  appState: AppState;
  onNavigate: (screen: Screen, itemId?: string) => void;
  updateAppState: (newState: Partial<AppState>) => void;
}

export function AlarmsScreen({ appState, onNavigate, updateAppState }: AlarmsScreenProps) {
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

  const toggleAlarm = (alarmId: string) => {
    const updatedAlarms = appState.alarms.map(alarm =>
      alarm.id === alarmId ? { ...alarm, active: !alarm.active } : alarm
    );
    updateAppState({ alarms: updatedAlarms });
  };

  const deleteAlarm = (alarmId: string) => {
    const updatedAlarms = appState.alarms.filter(alarm => alarm.id !== alarmId);
    updateAppState({ alarms: updatedAlarms });
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1>Alarms</h1>
        <Button onClick={() => onNavigate('alarm-editor')} size="sm">
          <Plus size={16} className="mr-1" />
          Add Alarm
        </Button>
      </div>

      {/* Alarms List */}
      <div className="space-y-3">
        {appState.alarms.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">No alarms set</p>
              <Button onClick={() => onNavigate('alarm-editor')}>
                <Plus size={16} className="mr-1" />
                Add Your First Alarm
              </Button>
            </CardContent>
          </Card>
        ) : (
          appState.alarms.map(alarm => (
            <Card key={alarm.id} className={`transition-opacity ${!alarm.active ? 'opacity-60' : ''}`}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-medium">{formatTime(alarm.time)}</div>
                      <Switch
                        checked={alarm.active}
                        onCheckedChange={() => toggleAlarm(alarm.id)}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{alarm.label}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {alarm.repeat}
                      </Badge>
                      {alarm.linkedTaskId && (
                        <Badge variant="outline" className="text-xs">
                          Linked to task
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onNavigate('alarm-editor', alarm.id)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteAlarm(alarm.id)}
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
        onClick={() => onNavigate('alarm-editor')}
        className="fixed bottom-20 right-4 rounded-full w-14 h-14 p-0 shadow-lg md:hidden"
      >
        <Plus size={24} />
      </Button>
    </div>
  );
}