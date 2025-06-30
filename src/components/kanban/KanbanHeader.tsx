
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Settings, Filter, Users, Clock, CheckCircle } from "lucide-react";
import { Project } from "@/utils/kanbanUtils";

interface KanbanHeaderProps {
  selectedProject: string;
  setSelectedProject: (project: string) => void;
  projects: Project[];
  showColumnDialog: boolean;
  setShowColumnDialog: (show: boolean) => void;
  showProjectDialog: boolean;
  setShowProjectDialog: (show: boolean) => void;
  newColumnName: string;
  setNewColumnName: (name: string) => void;
  handleAddColumn: () => void;
  filterOverdue: boolean;
  setFilterOverdue: (filter: boolean) => void;
  filterPerson?: string;
  setFilterPerson?: (person: string) => void;
  filterTeam?: string;
  setFilterTeam?: (team: string) => void;
  filterStatus?: string;
  setFilterStatus?: (status: string) => void;
}

const mockTeamMembers = [
  "João Silva", "Maria Santos", "Pedro Costa", "Ana Costa", "Carlos Lima"
];

const mockTeams = [
  "Frontend", "Backend", "DevOps", "QA", "Design"
];

const statusOptions = [
  { value: "todo", label: "A Fazer" },
  { value: "in-progress", label: "Em Andamento" },
  { value: "review", label: "Em Revisão" },
  { value: "done", label: "Concluído" }
];

export function KanbanHeader({
  selectedProject,
  setSelectedProject,
  projects,
  showColumnDialog,
  setShowColumnDialog,
  showProjectDialog,
  setShowProjectDialog,
  newColumnName,
  setNewColumnName,
  handleAddColumn,
  filterOverdue,
  setFilterOverdue,
  filterPerson,
  setFilterPerson,
  filterTeam,
  setFilterTeam,
  filterStatus,
  setFilterStatus
}: KanbanHeaderProps) {
  const currentProject = projects.find(p => p.id === selectedProject);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    if (setFilterPerson) setFilterPerson("");
    if (setFilterTeam) setFilterTeam("");
    if (setFilterStatus) setFilterStatus("");
    setFilterOverdue(false);
  };

  const hasActiveFilters = filterOverdue || filterPerson || filterTeam || filterStatus;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
            Kanban Board
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-600 font-medium">Gerencie suas tarefas de forma visual e eficiente</p>
            {currentProject && (
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(currentProject.status)} text-xs`}>
                  {currentProject.status === 'in-progress' ? 'Em Andamento' :
                   currentProject.status === 'completed' ? 'Concluído' :
                   currentProject.status === 'planning' ? 'Planejamento' : 'Pausado'}
                </Badge>
                <span className="text-sm text-gray-500">
                  {currentProject.progress}% concluído
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-64 border-2 border-amber-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <SelectValue placeholder="Selecione um projeto" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-amber-200">
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id} className="hover:bg-amber-50">
                  <div className="flex items-center justify-between w-full">
                    <span>{project.name}</span>
                    <Badge className={`${getStatusColor(project.status)} text-xs ml-2`}>
                      {project.progress}%
                    </Badge>
                  </div>
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

      {/* Filtros */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filtros:</span>
        </div>

        <Select value={filterPerson || ""} onValueChange={setFilterPerson}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3" />
              <SelectValue placeholder="Pessoa" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as pessoas</SelectItem>
            {mockTeamMembers.map(member => (
              <SelectItem key={member} value={member}>{member}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterTeam || ""} onValueChange={setFilterTeam}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3" />
              <SelectValue placeholder="Time" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os times</SelectItem>
            {mockTeams.map(team => (
              <SelectItem key={team} value={team}>{team}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus || ""} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={filterOverdue ? "default" : "outline"}
          onClick={() => setFilterOverdue(!filterOverdue)}
          className={filterOverdue ? "bg-red-600 hover:bg-red-700" : "border-red-200 text-red-600 hover:bg-red-50"}
          size="sm"
        >
          <Clock className="h-3 w-3 mr-1" />
          Atrasados
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}
