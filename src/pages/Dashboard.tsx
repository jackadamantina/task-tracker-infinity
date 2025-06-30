
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, CheckCircle, AlertCircle } from "lucide-react";

export default function Dashboard() {
  console.log("Dashboard renderizando...");
  
  // Mock data - em produção viria de uma API
  const projects = [
    {
      id: 1,
      name: "Sistema E-commerce",
      progress: 75,
      status: "Em Andamento",
      assignedUsers: 5,
      daysRunning: 12,
      completedTasks: 18,
      totalTasks: 24,
      responsible: "João Silva"
    },
    {
      id: 2,
      name: "App Mobile",
      progress: 45,
      status: "Em Andamento",
      assignedUsers: 3,
      daysRunning: 8,
      completedTasks: 9,
      totalTasks: 20,
      responsible: "Maria Santos"
    },
    {
      id: 3,
      name: "Dashboard Analytics",
      progress: 90,
      status: "Quase Concluído",
      assignedUsers: 2,
      daysRunning: 20,
      completedTasks: 27,
      totalTasks: 30,
      responsible: "Pedro Costa"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral dos seus projetos</p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+2 desde o mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">+3 novos usuários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54</div>
            <p className="text-xs text-muted-foreground">+12 esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de projetos */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos Ativos</CardTitle>
          <CardDescription>Acompanhe o progresso dos seus projetos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <Badge variant={project.status === "Em Andamento" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project.assignedUsers} usuários</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{project.daysRunning} dias em andamento</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>{project.completedTasks}/{project.totalTasks} tasks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Progress value={project.progress} className="flex-1" />
                    <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
