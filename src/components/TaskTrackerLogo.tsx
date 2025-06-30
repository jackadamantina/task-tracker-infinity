
import { CheckSquare, Target } from "lucide-react";

interface TaskTrackerLogoProps {
  collapsed?: boolean;
}

export function TaskTrackerLogo({ collapsed = false }: TaskTrackerLogoProps) {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className="relative">
        <div className="gradient-primary p-2.5 rounded-xl shadow-lg shadow-golden">
          <CheckSquare className="h-6 w-6 text-white" />
        </div>
        <Target className="h-3 w-3 text-amber-700 absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-800 leading-tight">Task</span>
          <span className="text-sm font-bold text-amber-700 leading-tight tracking-wide">Tracker</span>
        </div>
      )}
    </div>
  );
}
