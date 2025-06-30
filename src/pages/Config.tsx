import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slack, Mail, Clock, Users, Settings, Bell, Plus, Edit, Trash2, Search, TrendingUp, BarChart3, Target, UserPlus, Shield, Group } from "lucide-react";

const Config = () => {
  const [workingDays, setWorkingDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });

  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "18:00"
  });

  const [integrations, setIntegrations] = useState([
    { id: 1, type: "slack", name: "Slack - Equipe João", webhook: "https://hooks.slack.com/...", active: true },
    { id: 2, type: "email", name: "Email - Cliente Marcos", address: "marcos@cliente.com", active: true }
  ]);

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSubTab, setUserSubTab] = useState("users");

  // Mock data de usuários para a aba de usuários
  const users = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@tasktracker.com",
      role: "Administrador",
      group: "Desenvolvimento",
      status: "Ativo",
      avatar: "/placeholder.svg",
      projects: ["Sistema E-commerce", "App Mobile"],
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@tasktracker.com",
      role: "Gerente",
      group: "Design",
      status: "Ativo",
      avatar: "/placeholder.svg",
      projects: ["App Mobile", "Dashboard Analytics"],
      createdAt: "2024-01-20"
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro@tasktracker.com",
      role: "Desenvolvedor",
      group: "Desenvolvimento",
      status: "Inativo",
      avatar: "/placeholder.svg",
      projects: ["Dashboard Analytics"],
      createdAt: "2024-02-01"
    }
  ];

  // Mock data para perfis e grupos
  const profiles = [
    { id: 1, name: "Administrador", permissions: ["Criar", "Editar", "Excluir", "Visualizar"], users: 5 },
    { id: 2, name: "Gerente", permissions: ["Criar", "Editar", "Visualizar"], users: 8 },
    { id: 3, name: "Desenvolvedor", permissions: ["Editar", "Visualizar"], users: 12 },
  ];

  const groups = [
    { id: 1, name: "Desenvolvimento", members: 8, projects: ["Sistema E-commerce", "App Mobile"] },
    { id: 2, name: "Design", members: 4, projects: ["App Mobile", "Dashboard Analytics"] },
    { id: 3, name: "Qualidade", members: 3, projects: ["Sistema E-commerce"] },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrador": return "bg-red-100 text-red-800";
      case "Gerente": return "bg-blue-100 text-blue-800";
      case "Desenvolvedor": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira", 
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo"
  };

  // Mock data para análise de campanhas
  const campaignData = [
    { name: "Campanha A", leads: 1250, conversions: 89, roi: "340%" },
    { name: "Campanha B", leads: 980, conversions: 76, roi: "275%" },
    { name: "Campanha C", leads: 1450, conversions: 112, roi: "420%" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie as configurações da plataforma</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horários
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Empresa
                  </label>
                  <Input defaultValue="Task Tracker" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Contato
                  </label>
                  <Input defaultValue="contato@tasktracker.com" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Cards concluídos
                  </label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Novos cards
                  </label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Cards atrasados
                  </label>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dias Úteis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(dayNames).map(([key, name]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">{name}</label>
                    <Switch
                      checked={workingDays[key as keyof typeof workingDays]}
                      onCheckedChange={(checked) =>
                        setWorkingDays(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horário de Trabalho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Início
                  </label>
                  <Input
                    type="time"
                    value={workingHours.start}
                    onChange={(e) => setWorkingHours(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fim
                  </label>
                  <Input
                    type="time"
                    value={workingHours.end}
                    onChange={(e) => setWorkingHours(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrações Ativas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {integration.type === 'slack' ? (
                      <Slack className="h-5 w-5 text-purple-600" />
                    ) : (
                      <Mail className="h-5 w-5 text-blue-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{integration.name}</p>
                      <p className="text-sm text-gray-500">
                        {integration.type === 'slack' ? 'Webhook configurado' : integration.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={integration.active ? "default" : "secondary"}>
                      {integration.active ? "Ativo" : "Inativo"}
                    </Badge>
                    <Switch
                      checked={integration.active}
                      onCheckedChange={(checked) =>
                        setIntegrations(prev =>
                          prev.map(int => int.id === integration.id ? { ...int, active: checked } : int)
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Slack className="h-4 w-4" />
                  Adicionar Slack
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Adicionar Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h2>
              <p className="text-gray-600 mt-1">Gerencie usuários, perfis, grupos e análise de campanhas</p>
            </div>
          </div>

          {/* Sub-abas dentro de Usuários */}
          <Tabs value={userSubTab} onValueChange={setUserSubTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="profiles" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Perfis
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Group className="h-4 w-4" />
                Grupos
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Análise de Campanhas
              </TabsTrigger>
            </TabsList>

            {/* Aba Usuários */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-end">
                <Dialog open={isCreateUserModalOpen} onOpenChange={setIsCreateUserModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Usuário</DialogTitle>
                      <DialogDescription>
                        Adicione um novo usuário ao sistema Task Tracker.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nome</Label>
                        <Input id="name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Perfil</Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione um perfil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="manager">Gerente</SelectItem>
                            <SelectItem value="developer">Desenvolvedor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="group" className="text-right">Grupo</Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione um grupo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dev">Desenvolvimento</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="qa">Qualidade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateUserModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Criar Usuário
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Barra de pesquisa */}
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Pesquisar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Lista de usuários */}
              <Card>
                <CardHeader>
                  <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex gap-2 mb-1">
                              <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                              <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">Grupo: {user.group}</p>
                            <p className="text-xs text-gray-500">{user.projects.length} projeto(s)</p>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Perfis */}
            <TabsContent value="profiles" className="space-y-6">
              <div className="flex justify-end">
                <Dialog open={isCreateProfileModalOpen} onOpenChange={setIsCreateProfileModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Perfil
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Perfil</DialogTitle>
                      <DialogDescription>
                        Defina as permissões para um novo perfil de usuário.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="profileName">Nome do Perfil</Label>
                        <Input id="profileName" placeholder="Ex: Supervisor" />
                      </div>
                      <div>
                        <Label>Permissões</Label>
                        <div className="space-y-2 mt-2">
                          {["Criar", "Editar", "Excluir", "Visualizar"].map(permission => (
                            <div key={permission} className="flex items-center space-x-2">
                              <input type="checkbox" id={permission} />
                              <Label htmlFor={permission}>{permission}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateProfileModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Criar Perfil
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {profiles.map((profile) => (
                  <Card key={profile.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{profile.name}</h3>
                          <p className="text-sm text-gray-600">{profile.users} usuário(s)</p>
                          <div className="flex gap-2 mt-2">
                            {profile.permissions.map(permission => (
                              <Badge key={permission} variant="outline">{permission}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Aba Grupos */}
            <TabsContent value="groups" className="space-y-6">
              <div className="flex justify-end">
                <Dialog open={isCreateGroupModalOpen} onOpenChange={setIsCreateGroupModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Grupo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Grupo</DialogTitle>
                      <DialogDescription>
                        Organize usuários em grupos de trabalho.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="groupName">Nome do Grupo</Label>
                        <Input id="groupName" placeholder="Ex: Marketing" />
                      </div>
                      <div>
                        <Label htmlFor="groupDescription">Descrição</Label>
                        <Input id="groupDescription" placeholder="Descrição do grupo" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateGroupModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Criar Grupo
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {groups.map((group) => (
                  <Card key={group.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{group.name}</h3>
                          <p className="text-sm text-gray-600">{group.members} membro(s)</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Projetos: {group.projects.join(", ")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Aba Análise de Campanhas */}
            <TabsContent value="campaigns" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3,680</div>
                    <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">277</div>
                    <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">345%</div>
                    <p className="text-xs text-muted-foreground">+22% em relação ao mês anterior</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance das Campanhas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaignData.map((campaign, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">{campaign.leads} leads gerados</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{campaign.conversions} conversões</p>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            ROI: {campaign.roi}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Configurações</Button>
      </div>
    </div>
  );
};

export default Config;
