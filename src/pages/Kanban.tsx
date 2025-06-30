
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, Paperclip, User, Clock, ArrowRight, AlertTriangle } from "lucide-react";

export default function Kanban() {
  const [selectedProject, setSelectedProject] = useState("Sistema E-commerce");

  // Mock data - em produção viria de uma API
  const projects = ["Sistema E-commerce", "App Mobile", "Dashboard Analytics"];
  
  const columns = [
    { id: "backlog", title: "Backlog", color: "bg-gray-100" },
    { id: "todo", title: "A Fazer", color: "bg-blue-100" },
    { id: "in-progress", title: "Em Andamento", color: "bg-yellow-100" },
    { id: "review", title: "Em Revisão", color: "bg-purple-100" },
    { id: "done", title: "Concluído", color: "bg-green-100" }
  ];

  const cards = [
    {
      id: 1,
      title: "Configurar autenticação",
      description: "Implementar sistema de login e registro",
      column: "backlog",
      priority: "Alta",
      assignee: { name: "João Silva", avatar: "/placeholder.svg" },
      attachments: 2,
      subtasks: { completed: 0, total: 3 },
      dependencies: [],
      blocked: false,
      timeSpent: 0
    },
    {
      id: 2,
      title: "Design da página inicial",
      description: "Criar mockups e protótipos",
      column: "in-progress",
      priority: "Média",
      assignee: { name: "Maria Santos", avatar: "/placeholder.svg" },
      attachments: 5,
      subtasks: { completed: 2, total: 4 },
      dependencies: [],
      blocked: false,
      timeSpent: 8
    },
    {
      id: 3,
      title: "API de produtos",
      description: "Desenvolver endpoints para produtos",
      column: "review",
      priority: "Alta",
      assignee: { name: "Pedro Costa", avatar: "/placeholder.svg" },
      attachments: 1,
      subtasks: { completed: 4, total: 5 },
      dependencies: [1],
      blocked: true,
      timeSpent: 16
    },
    {
      id: 4,
      title: "Testes unitários",
      description: "Escrever testes para componentes",
      column: "done",
      priority: "Baixa",
      assignee: { name: "João Silva", avatar: "/placeholder.svg" },
      attachments: 0,
      subtasks: { completed: 3, total: 3 },
      dependencies: [],
      blocked: false,
      timeSpent: 12
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-800";
      case "Média": return "bg-yellow-100 text-yellow-800";
      case "Baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCardsByColumn = (columnId: string) => {
    return cards.filter(card => card.column === columnId);
  };

  const getSubtaskProgress = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600 mt-1">Gerencie suas tarefas de forma visual</p>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={selectedProject} 
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-6 min-h-[600px]">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className={`${column.color} rounded-t-lg p-4 border-b border-gray-200`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {getCardsByColumn(column.id).length}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-50 rounded-b-lg p-3 space-y-3">
              {getCardsByColumn(column.id).map((card) => (
                <Card key={card.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header do card */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight">
                            {card.title}
                          </h4>
                          {card.blocked && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                              <span className="text-xs text-red-600">Bloqueado</span>
                            </div>
                          )}
                        </div>
                        <Badge className={`${getPriorityColor(card.priority)} text-xs`}>
                          {card.priority}
                        </Badge>
                      </div>

                      {/* Descrição */}
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {card.description}
                      </p>

                      {/* Progresso das subtarefas */}
                      {card.subtasks.total > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Subtarefas</span>
                            <span>{card.subtasks.completed}/{card.subtasks.total}</span>
                          </div>
                          <Progress 
                            value={getSubtaskProgress(card.subtasks.completed, card.subtasks.total)} 
                            className="h-1"
                          />
                        </div>
                      )}

                      {/* Dependências */}
                      {card.dependencies.length > 0 && (
                        <div className="flex items-center gap-1">
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            Depende de {card.dependencies.length} task(s)
                          </span>
                        </div>
                      )}

                      {/* Footer do card */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={card.assignee.avatar} />
                            <AvatarFallback className="text-xs">
                              {card.assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          {card.attachments > 0 && (
                            <div className="flex items-center gap-1">
                              <Paperclip className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{card.attachments}</span>
                            </div>
                          )}
                        </div>

                        {card.timeSpent > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{card.timeSpent}h</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Botão para adicionar novo card */}
              <Button 
                variant="dashed" 
                className="w-full h-10 border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Card
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
