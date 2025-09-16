import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Save, X } from 'lucide-react';
import { AppState, Screen, Task } from '../App';

interface TaskEditorScreenProps {
  appState: AppState;
  editingTaskId: string | null;
  onNavigate: (screen: Screen) => void;
  updateAppState: (newState: Partial<AppState>) => void;
}

export function TaskEditorScreen({ appState, editingTaskId, onNavigate, updateAppState }: TaskEditorScreenProps) {
  const editingTask = editingTaskId ? appState.tasks.find(t => t.id === editingTaskId) : null;
  const isEditing = !!editingTask;

  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const [dueTime, setDueTime] = useState(editingTask?.dueTime || '');
  const [hasAlarm, setHasAlarm] = useState(editingTask?.hasAlarm || false);
  const [tags, setTags] = useState<string[]>(editingTask?.tags || []);
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const saveTask = () => {
    if (!title.trim()) return;

    const taskData: Task = {
      id: editingTaskId || Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      completed: editingTask?.completed || false,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      hasAlarm,
      tags,
      linkedAlarmId: editingTask?.linkedAlarmId,
    };

    let updatedTasks;
    if (isEditing) {
      updatedTasks = appState.tasks.map(task =>
        task.id === editingTaskId ? taskData : task
      );
    } else {
      updatedTasks = [...appState.tasks, taskData];
    }

    updateAppState({ tasks: updatedTasks });
    onNavigate('tasks');
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('tasks')}>
          <ArrowLeft size={16} />
        </Button>
        <h1>{isEditing ? 'Edit Task' : 'Add Task'}</h1>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description (optional)"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Due Date and Time */}
        <Card>
          <CardHeader>
            <CardTitle>Due Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              disabled={!dueDate}
            />
          </CardContent>
        </Card>

        {/* Link Alarm */}
        <Card>
          <CardHeader>
            <CardTitle>Alarm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Set alarm for this task</span>
              <Switch
                checked={hasAlarm}
                onCheckedChange={setHasAlarm}
                disabled={!dueDate || !dueTime}
              />
            </div>
            {(!dueDate || !dueTime) && (
              <p className="text-xs text-muted-foreground mt-2">
                Set due date and time to enable alarm
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} size="sm">Add</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={saveTask} 
          className="w-full"
          disabled={!title.trim()}
        >
          <Save size={16} className="mr-2" />
          {isEditing ? 'Update Task' : 'Save Task'}
        </Button>
      </div>
    </div>
  );
}