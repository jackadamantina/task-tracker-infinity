
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slack, Mail, Clock, Users, Settings, Bell } from "lucide-react";

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

  const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira", 
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo"
  };

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
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configure perfis de usuários e suas integrações específicas.
              </p>
              <Button>Adicionar Usuário</Button>
            </CardContent>
          </Card>
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
