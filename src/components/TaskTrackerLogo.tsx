
import { CheckSquare, Target } from "lucide-react";

interface TaskTrackerLogoProps {
  collapsed?: boolean;
}

export function TaskTrackerLogo({ collapsed = false }: TaskTrackerLogoProps) {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className="relative">
        <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-2 rounded-xl shadow-lg">
          <CheckSquare className="h-6 w-6 text-white" />
        </div>
        <Target className="h-3 w-3 text-yellow-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-800 leading-tight">Task</span>
          <span className="text-sm font-semibold text-yellow-600 leading-tight">Tracker</span>
        </div>
      )}
    </div>
  );
}
