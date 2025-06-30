
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Paperclip, User, Clock, ArrowRight, AlertTriangle, Settings, Copy, Trash2 } from "lucide-react";

export default function Kanban() {
  const [selectedProject, setSelectedProject] = useState("Sistema E-commerce");
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  // Mock data - em produção viria de uma API
  const projects = ["Sistema E-commerce", "App Mobile", "Dashboard Analytics"];
  
  const [columns, setColumns] = useState([
    { id: "todo", title: "A Fazer", color: "bg-blue-50 border-blue-200", headerColor: "bg-blue-100" },
    { id: "in-progress", title: "Em Andamento", color: "bg-amber-50 border-amber-200", headerColor: "bg-amber-100" },
    { id: "review", title: "Em Revisão", color: "bg-purple-50 border-purple-200", headerColor: "bg-purple-100" },
    { id: "done", title: "Concluído", color: "bg-green-50 border-green-200", headerColor: "bg-green-100" }
  ]);

  const cards = [
    {
      id: 1,
      title: "Configurar autenticação",
      description: "Implementar sistema de login e registro com validação de políticas de senha",
      column: "todo",
      priority: "Alta",
      assignee: { name: "João Silva", avatar: "/placeholder.svg" },
      attachments: 2,
      subtasks: { completed: 0, total: 3 },
      dependencies: [],
      blocked: false,
      timeSpent: 0,
      tags: ["Backend", "Segurança"]
    },
    {
      id: 2,
      title: "Design da página inicial",
      description: "Criar mockups e protótipos responsivos para todas as telas",
      column: "in-progress",
      priority: "Média",
      assignee: { name: "Maria Santos", avatar: "/placeholder.svg" },
      attachments: 5,
      subtasks: { completed: 2, total: 4 },
      dependencies: [],
      blocked: false,
      timeSpent: 8,
      tags: ["Frontend", "Design"]
    },
    {
      id: 3,
      title: "API de produtos",
      description: "Desenvolver endpoints para CRUD de produtos com validações",
      column: "review",
      priority: "Alta",
      assignee: { name: "Pedro Costa", avatar: "/placeholder.svg" },
      attachments: 1,
      subtasks: { completed: 4, total: 5 },
      dependencies: [1],
      blocked: true,
      timeSpent: 16,
      tags: ["Backend", "API"]
    },
    {
      id: 4,
      title: "Testes unitários",
      description: "Escrever testes para todos os componentes críticos",
      column: "done",
      priority: "Baixa",
      assignee: { name: "João Silva", avatar: "/placeholder.svg" },
      attachments: 0,
      subtasks: { completed: 3, total: 3 },
      dependencies: [],
      blocked: false,
      timeSpent: 12,
      tags: ["QA", "Testes"]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-800 border border-red-200";
      case "Média": return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Baixa": return "bg-green-100 text-green-800 border border-green-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getCardsByColumn = (columnId: string) => {
    return cards.filter(card => card.column === columnId);
  };

  const getSubtaskProgress = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumn = {
        id: `col-${Date.now()}`,
        title: newColumnName,
        color: "bg-gray-50 border-gray-200",
        headerColor: "bg-gray-100"
      };
      setColumns([...columns, newColumn]);
      setNewColumnName("");
      setShowColumnDialog(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-amber-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
            Kanban Board
          </h1>
          <p className="text-gray-600 mt-1 font-medium">Gerencie suas tarefas de forma visual e eficiente</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-64 border-2 border-amber-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-amber-200">
              {projects.map(project => (
                <SelectItem key={project} value={project} className="hover:bg-amber-50">
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
            <DialogTrigger asChild>
              <Button className="gradient-primary hover:shadow-lg transition-all duration-300">
                <Copy className="h-4 w-4 mr-2" />
                Usar como Template
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-2 border-amber-200">
              <DialogHeader>
                <DialogTitle className="text-amber-800">Criar Projeto a partir de Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Nome do Novo Projeto</Label>
                  <Input 
                    id="projectName" 
                    placeholder="Digite o nome do projeto..."
                    className="border-2 border-amber-200 focus:border-amber-400"
                  />
                </div>
                <Button onClick={() => setShowProjectDialog(false)} className="gradient-primary w-full">
                  Criar Projeto
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50">
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar Colunas
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-2 border-amber-200">
              <DialogHeader>
                <DialogTitle className="text-amber-800">Adicionar Nova Coluna</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="columnName">Nome da Coluna</Label>
                  <Input 
                    id="columnName" 
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="Ex: Em Teste"
                    className="border-2 border-amber-200 focus:border-amber-400"
                  />
                </div>
                <Button onClick={handleAddColumn} className="gradient-primary w-full">
                  Adicionar Coluna
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Kanban Board */}
      <div className={`grid gap-6 min-h-[700px]`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(320px, 1fr))` }}>
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className={`${column.headerColor} rounded-t-xl p-5 border-b-2 border-amber-200 shadow-md`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg">{column.title}</h3>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm font-bold bg-white text-amber-700 border border-amber-300">
                    {getCardsByColumn(column.id).length}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white hover:text-amber-700 rounded-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className={`flex-1 ${column.color} rounded-b-xl p-4 space-y-4 border-2 ${column.color.includes('border') ? '' : 'border-gray-200'} shadow-lg`}>
              {getCardsByColumn(column.id).map((card) => (
                <Card key={card.id} className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-2 border-gray-100 hover:border-amber-200">
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
              ))}
              
              {/* Botão para adicionar novo card */}
              <Button 
                variant="dashed" 
                className="w-full h-12 border-2 border-dashed border-amber-300 hover:border-amber-400 text-amber-700 hover:bg-amber-50 transition-all duration-300 font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Card
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
