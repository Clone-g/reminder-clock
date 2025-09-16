import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { AppState, Screen, Alarm } from "../App";

interface AlarmEditorScreenProps {
  appState: AppState;
  editingAlarmId: string | null;
  onNavigate: (screen: Screen) => void;
  updateAppState: (newState: Partial<AppState>) => void;
}

export function AlarmEditorScreen({
  appState,
  editingAlarmId,
  onNavigate,
  updateAppState,
}: AlarmEditorScreenProps) {
  const editingAlarm = editingAlarmId
    ? appState.alarms.find((a) => a.id === editingAlarmId)
    : null;
  const isEditing = !!editingAlarm;

  const [time, setTime] = useState(
    editingAlarm?.time || "07:00",
  );
  const [label, setLabel] = useState(editingAlarm?.label || "");
  const [repeat, setRepeat] = useState<
    "never" | "daily" | "custom"
  >(editingAlarm?.repeat || "never");
  const [sound, setSound] = useState(
    editingAlarm?.sound || "default",
  );
  const [linkedTaskId, setLinkedTaskId] = useState(
    editingAlarm?.linkedTaskId || "none",
  );

  const saveAlarm = () => {
    const alarmData: Alarm = {
      id: editingAlarmId || Date.now().toString(),
      time,
      label: label || "Alarm",
      active: true,
      repeat,
      sound,
      linkedTaskId:
        linkedTaskId === "none" ? undefined : linkedTaskId,
    };

    let updatedAlarms;
    if (isEditing) {
      updatedAlarms = appState.alarms.map((alarm) =>
        alarm.id === editingAlarmId ? alarmData : alarm,
      );
    } else {
      updatedAlarms = [...appState.alarms, alarmData];
    }

    updateAppState({ alarms: updatedAlarms });
    onNavigate("alarms");
  };

  const formatTime = (time: string) => {
    if (appState.settings.timeFormat === "12h") {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour =
        hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    return time;
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("alarms")}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1>{isEditing ? "Edit Alarm" : "Add Alarm"}</h1>
      </div>

      <div className="space-y-6">
        {/* Time Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-2xl text-center w-auto"
              />
            </div>
            <div className="text-center text-muted-foreground">
              {formatTime(time)}
            </div>
          </CardContent>
        </Card>

        {/* Label */}
        <Card>
          <CardHeader>
            <CardTitle>Label</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Alarm label"
            />
          </CardContent>
        </Card>

        {/* Repeat */}
        <Card>
          <CardHeader>
            <CardTitle>Repeat</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={repeat}
              onValueChange={(
                value: "never" | "daily" | "custom",
              ) => setRepeat(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Sound */}
        <Card>
          <CardHeader>
            <CardTitle>Sound</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={sound} onValueChange={setSound}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="gentle">Gentle</SelectItem>
                <SelectItem value="loud">Loud</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Link to Task */}
        <Card>
          <CardHeader>
            <CardTitle>Link to Task</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={linkedTaskId}
              onValueChange={setLinkedTaskId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a task (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No task</SelectItem>
                {appState.tasks
                  .filter((t) => !t.completed)
                  .map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={saveAlarm} className="w-full">
          <Save size={16} className="mr-2" />
          {isEditing ? "Update Alarm" : "Save Alarm"}
        </Button>
      </div>
    </div>
  );
}