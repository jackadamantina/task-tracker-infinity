
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Filter, TrendingUp, Clock, Users, CheckCircle } from "lucide-react";

export default function Relatorios() {
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data - em produção viria de uma API
  const projects = [
    { id: "all", name: "Todos os Projetos" },
    { id: "1", name: "Sistema E-commerce" },
    { id: "2", name: "App Mobile" },
    { id: "3", name: "Dashboard Analytics" }
  ];

  const ganttData = [
    {
      id: 1,
      project: "Sistema E-commerce",
      tasks: [
        { name: "Planejamento", start: "2024-01-01", end: "2024-01-15", progress: 100, status: "Concluído" },
        { name: "Desenvolvimento", start: "2024-01-16", end: "2024-03-15", progress: 75, status: "Em Andamento" },
        { name: "Testes", start: "2024-03-01", end: "2024-03-30", progress: 25, status: "Aguardando" },
        { name: "Deploy", start: "2024-03-25", end: "2024-04-05", progress: 0, status: "Não Iniciado" }
      ]
    },
    {
      id: 2,
      project: "App Mobile",
      tasks: [
        { name: "Design UI/UX", start: "2024-01-15", end: "2024-02-15", progress: 90, status: "Quase Concluído" },
        { name: "Desenvolvimento", start: "2024-02-01", end: "2024-04-01", progress: 45, status: "Em Andamento" },
        { name: "Testes", start: "2024-03-15", end: "2024-04-15", progress: 0, status: "Não Iniciado" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído": return "bg-green-100 text-green-800";
      case "Em Andamento": return "bg-blue-100 text-blue-800";
      case "Quase Concluído": return "bg-yellow-100 text-yellow-800";
      case "Aguardando": return "bg-orange-100 text-orange-800";
      case "Não Iniciado": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-gray-300";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

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
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 novo projeto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45d</div>
            <p className="text-xs text-muted-foreground">Por projeto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipe Total</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">Membros ativos</p>
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
            Visualize o cronograma e dependências dos seus projetos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {ganttData.map((projectData) => (
              <div key={projectData.id} className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-900">{projectData.project}</h3>
                
                <div className="space-y-3">
                  {projectData.tasks.map((task, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center py-2">
                      {/* Nome da tarefa */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{task.name}</span>
                          <Badge className={`${getStatusColor(task.status)} text-xs`}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Timeline visual */}
                      <div className="col-span-7">
                        <div className="relative h-6 bg-gray-100 rounded-md overflow-hidden">
                          <div 
                            className={`h-full rounded-md ${getProgressBarColor(task.progress)} transition-all duration-300`}
                            style={{ width: `${task.progress}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700">
                              {task.progress}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Datas */}
                      <div className="col-span-2 text-right">
                        <div className="text-xs text-gray-600">
                          <div>{formatDate(task.start)}</div>
                          <div>{formatDate(task.end)}</div>
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
                { status: "Concluído", count: 12, color: "bg-green-500" },
                { status: "Em Andamento", count: 8, color: "bg-blue-500" },
                { status: "Aguardando", count: 4, color: "bg-orange-500" },
                { status: "Não Iniciado", count: 6, color: "bg-gray-400" }
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
                { phase: "Testes", time: "8 dias", color: "bg-yellow-500" },
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
