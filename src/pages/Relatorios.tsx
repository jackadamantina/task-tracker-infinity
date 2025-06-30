
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Filter, TrendingUp, Clock, Users, CheckCircle, AlertCircle } from "lucide-react";
import { mockProjects, mockCards, getProjectTimeline, getProjectProgress, type Project } from "@/utils/kanbanUtils";

export default function Relatorios() {
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const projects = [
    { id: "all", name: "Todos os Projetos" },
    ...mockProjects.map(p => ({ id: p.id, name: p.name }))
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done": return "bg-green-100 text-green-800";
      case "review": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "todo": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressBarColor = (progress: number, isOverdue: boolean = false) => {
    if (isOverdue) return "bg-red-500";
    if (progress === 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-gray-300";
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const formatExecutionTime = (hours: number): string => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const getFilteredProjects = () => {
    if (selectedProject === "all") {
      return mockProjects;
    }
    return mockProjects.filter(p => p.id === selectedProject);
  };

  const getProjectsTimeline = () => {
    return getFilteredProjects().map(project => ({
      id: project.id,
      project: project.name,
      tasks: getProjectTimeline(project.id, mockCards)
    }));
  };

  const projectsTimeline = getProjectsTimeline();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">Acompanhe o progresso e desempenho dos projetos</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar Projeto" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockProjects.filter(p => p.status === 'in-progress').length} em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockCards.filter(card => {
                if (!card.estimatedCompletionDate) return false;
                return new Date() > card.estimatedCompletionDate && card.column !== 'done';
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((mockCards.filter(c => c.column === 'done').length / mockCards.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {mockCards.filter(c => c.column === 'done').length} de {mockCards.length} tarefas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockCards.reduce((acc, card) => acc + (card.executionTime || 0), 0) / mockCards.length)}h
            </div>
            <p className="text-xs text-muted-foreground">Por tarefa</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Gantt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline dos Projetos - Gráfico de Gantt
          </CardTitle>
          <CardDescription>
            Visualize o cronograma, tempo gasto e dependências dos seus projetos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {projectsTimeline.map((projectData) => (
              <div key={projectData.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900">{projectData.project}</h3>
                  <Badge className="bg-blue-100 text-blue-800">
                    {getProjectProgress(projectData.id, mockCards)}% concluído
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {projectData.tasks.map((task, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0">
                      {/* Nome da tarefa e informações */}
                      <div className="col-span-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">{task.title}</span>
                            <Badge className={`${getStatusColor(task.status)} text-xs`}>
                              {task.status === 'done' ? 'Concluído' :
                               task.status === 'review' ? 'Em Revisão' :
                               task.status === 'in-progress' ? 'Em Andamento' : 'A Fazer'}
                            </Badge>
                            {task.isOverdue && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                Atrasado
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Responsável: {task.assignee}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>Tempo gasto: {task.timeSpent}h</span>
                            {task.executionTime > 0 && (
                              <span>Duração: {formatExecutionTime(task.executionTime)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Timeline visual */}
                      <div className="col-span-6">
                        <div className="relative h-8 bg-gray-100 rounded-md overflow-hidden">
                          <div 
                            className={`h-full rounded-md ${getProgressBarColor(task.progress, task.isOverdue)} transition-all duration-300 flex items-center justify-center`}
                            style={{ width: `${task.progress}%` }}
                          >
                            <span className="text-xs font-medium text-white">
                              {task.progress}%
                            </span>
                          </div>
                          {task.isOverdue && (
                            <div className="absolute top-0 right-0 h-full w-2 bg-red-600"></div>
                          )}
                        </div>
                      </div>

                      {/* Datas */}
                      <div className="col-span-2 text-right">
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="font-medium">
                            {formatDate(task.startDate)} - {formatDate(task.estimatedEndDate)}
                          </div>
                          {task.actualEndDate && (
                            <div className="text-green-600">
                              Concluído: {formatDate(task.actualEndDate)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
            <CardDescription>Status atual das tarefas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { status: "Concluído", count: mockCards.filter(c => c.column === 'done').length, color: "bg-green-500" },
                { status: "Em Andamento", count: mockCards.filter(c => c.column === 'in-progress').length, color: "bg-blue-500" },
                { status: "Em Revisão", count: mockCards.filter(c => c.column === 'review').length, color: "bg-yellow-500" },
                { status: "A Fazer", count: mockCards.filter(c => c.column === 'todo').length, color: "bg-gray-400" }
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-700">{item.status}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo de Ciclo</CardTitle>
            <CardDescription>Tempo médio por fase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { phase: "Planejamento", time: "5 dias", color: "bg-purple-500" },
                { phase: "Desenvolvimento", time: "22 dias", color: "bg-blue-500" },
                { phase: "Revisão", time: "8 dias", color: "bg-yellow-500" },
                { phase: "Deploy", time: "3 dias", color: "bg-green-500" }
              ].map((item) => (
                <div key={item.phase} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-700">{item.phase}</span>
                  </div>
                  <span className="text-sm font-medium">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
