
import { CheckSquare, Target, Zap } from "lucide-react";

interface TaskTrackerLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function TaskTrackerLogo({ size = "md", showText = true }: TaskTrackerLogoProps) {
  const sizes = {
    sm: { icon: "h-6 w-6", text: "text-xl", container: "gap-2 p-2" },
    md: { icon: "h-8 w-8", text: "text-2xl", container: "gap-3 p-3" },
    lg: { icon: "h-12 w-12", text: "text-4xl", container: "gap-4 p-4" },
    xl: { icon: "h-16 w-16", text: "text-6xl", container: "gap-6 p-6" }
  };

  return (
    <div className={`flex items-center ${sizes[size].container}`}>
      <div className="relative">
        <div className="gradient-primary p-3 rounded-2xl shadow-lg shadow-blue-500/20">
          <CheckSquare className={`${sizes[size].icon} text-white`} />
        </div>
        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1.5 shadow-sm">
          <Zap className="h-3 w-3 text-yellow-800" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizes[size].text} font-bold text-gray-800 leading-tight`}>Task</span>
          <span className={`text-lg font-bold text-blue-600 leading-tight tracking-wide`}>Tracker</span>
        </div>
      )}
    </div>
  );
}
