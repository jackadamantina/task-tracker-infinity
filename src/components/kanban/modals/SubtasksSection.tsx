
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface SubtasksSectionProps {
  subtasks: Subtask[];
  setSubtasks: (subtasks: Subtask[]) => void;
}

export function SubtasksSection({ subtasks, setSubtasks }: SubtasksSectionProps) {
  const [newSubtask, setNewSubtask] = useState("");

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false
      }]);
      setNewSubtask("");
    }
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-3">
      <FormLabel>Subtarefas</FormLabel>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {subtasks.map(subtask => (
          <div key={subtask.id} className="flex items-center gap-2 p-2 border rounded">
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={() => toggleSubtask(subtask.id)}
              className="rounded"
            />
            <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
              {subtask.title}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeSubtask(subtask.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder="Nova subtarefa"
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
        />
        <Button type="button" onClick={addSubtask} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
