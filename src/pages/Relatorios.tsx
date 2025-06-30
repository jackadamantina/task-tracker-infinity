import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, Briefcase, Filter, Download } from "lucide-react";
import { 
  mockProjects, 
  mockCards, 
  getProjectTimeline, 
  getCardsByProject,
  getOverdueCards,
  type Card as KanbanCard
} from "@/utils/kanbanUtils";

const mockTeamMembers = [
  "João Silva", "Maria Santos", "Pedro Costa", "Ana Costa", "Carlos Lima"
];

const mockTeams = [
  "Frontend", "Backend", "DevOps", "QA", "Design"
];

export default function Relatorios() {
  const [filterType, setFilterType] = useState<"project" | "person" | "team">("project");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [dateRange, setDateRange] = useState("30");

  const getFilteredData = () => {
    let filteredCards: KanbanCard[] = [];
    
    if (filterType === "project" && selectedFilter) {
      filteredCards = getCardsByProject(mockCards, selectedFilter);
    } else if (filterType === "person" && selectedFilter) {
      filteredCards = mockCards.filter(card => card.assignee.name === selectedFilter);
    } else if (filterType === "team" && selectedFilter) {
      filteredCards = mockCards.filter(card => card.tags?.includes(selectedFilter));
    } else {
      filteredCards = mockCards;
    }

    // Filtrar por período
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    return filteredCards.filter(card => {
      if (card.startTime) {
        return card.startTime >= cutoffDate;
      }
      return true;
    });
  };

  const filteredCards = getFilteredData();
  const completedCards = filteredCards.filter(card => card.column === 'done');
  const overdueCards = getOverdueCards(filteredCards);
  const totalTimeSpent = filteredCards.reduce((sum, card) => sum + card.timeSpent, 0);
  const averageTimePerCard = filteredCards.length > 0 ? totalTimeSpent / filteredCards.length : 0;

  const getTimelineData = () => {
    if (filterType === "project" && selectedFilter) {
      return getProjectTimeline(selectedFilter, mockCards);
    }
    
    return filteredCards.map(card => ({
      id: card.id,
      title: card.title,
      startDate: card.startTime || new Date(),
      estimatedEndDate: card.estimatedCompletionDate || new Date(),
      actualEndDate: card.completedTime,
      progress: card.column === 'done' ? 100 : 
                card.column === 'review' ? 75 : 
                card.column === 'in-progress' ? 50 : 0,
      status: card.column,
      assignee: card.assignee.name,
      isOverdue: card.estimatedCompletionDate ? new Date() > card.estimatedCompletionDate && card.column !== 'done' : false,
      timeSpent: card.timeSpent,
      executionTime: card.executionTime || 0
    })).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  };

  const timelineData = getTimelineData();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  };

  const formatHours = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'done': return 'Concluído';
      case 'review': return 'Em Revisão';
      case 'in-progress': return 'Em Andamento';
      case 'todo': return 'A Fazer';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Relatórios Kanban
          </h1>
          <p className="text-gray-600 mt-1">Análise detalhada de desempenho e timeline</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Filtro</label>
              <Select value={filterType} onValueChange={(value: "project" | "person" | "team") => {
                setFilterType(value);
                setSelectedFilter("");
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Por Projeto
                    </div>
                  </SelectItem>
                  <SelectItem value="person">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Por Pessoa
                    </div>
                  </SelectItem>
                  <SelectItem value="team">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Por Time
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {filterType === "project" ? "Projeto" : 
                 filterType === "person" ? "Pessoa" : "Time"}
              </label>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={`Selecione ${
                    filterType === "project" ? "um projeto" : 
                    filterType === "person" ? "uma pessoa" : "um time"
                  }`} />
                </SelectTrigger>
                <SelectContent>
                  {filterType === "project" && mockProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                  {filterType === "person" && mockTeamMembers.map(member => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                  {filterType === "team" && mockTeams.map(team => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={() => setSelectedFilter("")} variant="outline" className="w-full">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Cards</p>
                <p className="text-2xl font-bold">{filteredCards.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{completedCards.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atrasados</p>
                <p className="text-2xl font-bold text-red-600">{overdueCards.length}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tempo Total</p>
                <p className="text-2xl font-bold">{formatHours(totalTimeSpent)}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Gantt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline do Projeto - Gantt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineData.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{item.title}</h4>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                    {item.isOverdue && (
                      <Badge className="bg-red-100 text-red-800">
                        Atrasado
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Responsável: {item.assignee}</span>
                    <span>Tempo: {formatHours(item.timeSpent)}</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Início: {formatDate(item.startDate)}</span>
                    <span>Previsão: {formatDate(item.estimatedEndDate)}</span>
                    {item.actualEndDate && (
                      <span>Concluído: {formatDate(item.actualEndDate)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={item.progress} className="flex-1 h-2" />
                    <span className="text-xs font-medium w-12">{item.progress}%</span>
                  </div>
                </div>

                {/* Timeline visual */}
                <div className="mt-3 h-6 bg-gray-100 rounded relative overflow-hidden">
                  <div 
                    className={`h-full ${item.isOverdue ? 'bg-red-400' : 'bg-blue-400'} rounded transition-all duration-300`}
                    style={{ width: `${item.progress}%` }}
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      {item.executionTime > 0 && `${formatHours(item.executionTime)} planejado`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo por Status */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['todo', 'in-progress', 'review', 'done'].map(status => {
              const statusCards = filteredCards.filter(card => card.column === status);
              const percentage = filteredCards.length > 0 ? (statusCards.length / filteredCards.length) * 100 : 0;
              
              return (
                <div key={status} className="text-center p-4 border rounded-lg">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)} mb-2`}>
                    {getStatusLabel(status)}
                  </div>
                  <div className="text-2xl font-bold">{statusCards.length}</div>
                  <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
