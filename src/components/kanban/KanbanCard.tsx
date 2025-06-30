
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Paperclip, Clock, ArrowRight, AlertTriangle, Timer, Calendar, AlertCircle } from "lucide-react";
import { isCardOverdue } from "@/utils/kanbanUtils";

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
    executionTime?: number;
    estimatedCompletionDate?: Date;
    projectId: string;
  };
  onDoubleClick?: () => void;
}

export function KanbanCard({ card, onDoubleClick }: KanbanCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-50 text-red-700 border-red-200";
      case "Média": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Baixa": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getSubtaskProgress = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const formatExecutionTime = (hours: number): string => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  };

  const isOverdue = isCardOverdue(card);

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all duration-200 bg-white border ${
        isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
      } hover:border-gray-300`}
      onDoubleClick={onDoubleClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header do card */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1">
                {card.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                {card.blocked && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600 font-medium">Bloqueado</span>
                  </div>
                )}
                {isOverdue && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600 font-medium">Atrasado</span>
                  </div>
                )}
              </div>
            </div>
            <Badge className={`${getPriorityColor(card.priority)} text-xs font-medium border`}>
              {card.priority}
            </Badge>
          </div>

          {/* Data de conclusão estimada */}
          {card.estimatedCompletionDate && (
            <div className={`flex items-center gap-2 p-2 rounded-md border ${
              isOverdue ? 'bg-red-100 border-red-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <Calendar className={`h-3 w-3 ${isOverdue ? 'text-red-600' : 'text-blue-600'}`} />
              <span className={`text-xs font-medium ${
                isOverdue ? 'text-red-700' : 'text-blue-700'
              }`}>
                Previsão: {formatDate(card.estimatedCompletionDate)}
              </span>
            </div>
          )}

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Descrição */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {card.description}
          </p>

          {/* Progresso das subtarefas */}
          {card.subtasks.total > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Subtarefas</span>
                <span className="font-medium">{card.subtasks.completed}/{card.subtasks.total}</span>
              </div>
              <Progress 
                value={getSubtaskProgress(card.subtasks.completed, card.subtasks.total)} 
                className="h-1.5 bg-gray-200"
              />
            </div>
          )}

          {/* Tempo de execução */}
          {card.executionTime && card.executionTime > 0 && (
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-md border border-purple-200">
              <Timer className="h-3 w-3 text-purple-600" />
              <span className="text-xs text-purple-700 font-medium">
                Tempo de execução: {formatExecutionTime(card.executionTime)}
              </span>
            </div>
          )}

          {/* Dependências */}
          {card.dependencies.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-md border border-orange-200">
              <ArrowRight className="h-3 w-3 text-orange-600" />
              <span className="text-xs text-orange-700 font-medium">
                Depende de {card.dependencies.length} task(s)
              </span>
            </div>
          )}

          {/* Footer do card */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 border border-gray-200">
                <AvatarImage src={card.assignee.avatar} />
                <AvatarFallback className="text-xs font-medium bg-gray-100 text-gray-600">
                  {card.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {card.attachments > 0 && (
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                  <Paperclip className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">{card.attachments}</span>
                </div>
              )}
            </div>

            {card.timeSpent > 0 && (
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                <Clock className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">{card.timeSpent}h</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
