
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Settings, Filter } from "lucide-react";
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
}

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
  setFilterOverdue
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

  return (
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

        <Button
          variant={filterOverdue ? "default" : "outline"}
          onClick={() => setFilterOverdue(!filterOverdue)}
          className={filterOverdue ? "bg-red-600 hover:bg-red-700" : "border-red-200 text-red-600 hover:bg-red-50"}
        >
          <Filter className="h-4 w-4 mr-2" />
          Atrasados
        </Button>

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
  );
}
