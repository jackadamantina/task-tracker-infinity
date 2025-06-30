
import { CheckSquare, Target } from "lucide-react";

interface TaskTrackerLogoProps {
  collapsed?: boolean;
}

export function TaskTrackerLogo({ collapsed = false }: TaskTrackerLogoProps) {
  return (
    <div className="flex items-center gap-2 p-2">
      <div className="relative">
        <CheckSquare className="h-8 w-8 text-blue-600" />
        <Target className="h-4 w-4 text-green-500 absolute -top-1 -right-1" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900 leading-tight">Task</span>
          <span className="text-sm font-medium text-blue-600 leading-tight">Tracker</span>
        </div>
      )}
    </div>
  );
}
