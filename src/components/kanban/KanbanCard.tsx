
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Paperclip, Clock, ArrowRight, AlertTriangle } from "lucide-react";

interface KanbanCardProps {
  card: {
    id: number;
    title: string;
    description: string;
    priority: string;
    assignee: { name: string; avatar: string };
    attachments: number;
    subtasks: { completed: number; total: number };
    dependencies: number[];
    blocked: boolean;
    timeSpent: number;
    tags?: string[];
  };
}

export function KanbanCard({ card }: KanbanCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-800 border border-red-200";
      case "Média": return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Baixa": return "bg-green-100 text-green-800 border border-green-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getSubtaskProgress = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  return (
    <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-2 border-gray-100 hover:border-amber-200">
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header do card */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                {card.title}
              </h4>
              {card.blocked && (
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-600 font-semibold">Bloqueado</span>
                </div>
              )}
            </div>
            <Badge className={`${getPriorityColor(card.priority)} text-xs font-bold`}>
              {card.priority}
            </Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {card.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-300">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Descrição */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {card.description}
          </p>

          {/* Progresso das subtarefas */}
          {card.subtasks.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600 font-semibold">
                <span>Subtarefas</span>
                <span>{card.subtasks.completed}/{card.subtasks.total}</span>
              </div>
              <Progress 
                value={getSubtaskProgress(card.subtasks.completed, card.subtasks.total)} 
                className="h-2 bg-gray-200"
              />
            </div>
          )}

          {/* Dependências */}
          {card.dependencies.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
              <ArrowRight className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-orange-700 font-semibold">
                Depende de {card.dependencies.length} task(s)
              </span>
            </div>
          )}

          {/* Footer do card */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar className="h-7 w-7 border-2 border-amber-200">
                <AvatarImage src={card.assignee.avatar} />
                <AvatarFallback className="text-xs font-bold bg-amber-100 text-amber-700">
                  {card.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {card.attachments > 0 && (
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                  <Paperclip className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600 font-semibold">{card.attachments}</span>
                </div>
              )}
            </div>

            {card.timeSpent > 0 && (
              <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                <Clock className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-700 font-semibold">{card.timeSpent}h</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
