
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Users, Shield, Settings2 } from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";
import { useGroups } from "@/hooks/useGroups";
import { useSystemUsers } from "@/hooks/useSystemUsers";

export default function Config() {
  const { profiles, loading: profilesLoading, createProfile } = useProfiles();
  const { groups, loading: groupsLoading, createGroup } = useGroups();
  const { users, loading: usersLoading, createUser } = useSystemUsers();

  // Estados para formulários
  const [newProfile, setNewProfile] = useState({ name: "", description: "" });
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [newUser, setNewUser] = useState({ 
    name: "", 
    email: "", 
    profile_id: "", 
    group_id: "" 
  });

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProfile(newProfile);
      setNewProfile({ name: "", description: "" });
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGroup(newGroup);
      setNewGroup({ name: "", description: "" });
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        ...newUser,
        profile_id: newUser.profile_id || undefined,
        group_id: newUser.group_id || undefined
      });
      setNewUser({ name: "", email: "", profile_id: "", group_id: "" });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">Gerencie usuários, perfis e configurações do sistema</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
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
            <Users className="h-4 w-4" />
            Grupos
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>Adicione e gerencie usuários do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userName">Nome</Label>
                    <Input
                      id="userName"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Nome do usuário"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userProfile">Perfil</Label>
                    <Select value={newUser.profile_id} onValueChange={(value) => setNewUser({ ...newUser, profile_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="userGroup">Grupo</Label>
                    <Select value={newUser.group_id} onValueChange={(value) => setNewUser({ ...newUser, group_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Usuário
                </Button>
              </form>

              <div className="space-y-3">
                {usersLoading ? (
                  <p>Carregando usuários...</p>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="flex gap-2 mt-1">
                          {user.profiles && (
                            <Badge variant="secondary">{user.profiles.name}</Badge>
                          )}
                          {user.groups && (
                            <Badge variant="outline">{user.groups.name}</Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Perfis</CardTitle>
              <CardDescription>Configure perfis de acesso e permissões</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProfile} className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="profileName">Nome do Perfil</Label>
                  <Input
                    id="profileName"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                    placeholder="Nome do perfil"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="profileDesc">Descrição</Label>
                  <Textarea
                    id="profileDesc"
                    value={newProfile.description}
                    onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                    placeholder="Descrição do perfil"
                  />
                </div>
                <Button type="submit" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Perfil
                </Button>
              </form>

              <div className="space-y-3">
                {profilesLoading ? (
                  <p>Carregando perfis...</p>
                ) : (
                  profiles.map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-sm text-gray-600">{profile.description}</div>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Grupos</CardTitle>
              <CardDescription>Organize usuários em grupos de trabalho</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGroup} className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="groupName">Nome do Grupo</Label>
                  <Input
                    id="groupName"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="Nome do grupo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="groupDesc">Descrição</Label>
                  <Textarea
                    id="groupDesc"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder="Descrição do grupo"
                  />
                </div>
                <Button type="submit" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Grupo
                </Button>
              </form>

              <div className="space-y-3">
                {groupsLoading ? (
                  <p>Carregando grupos...</p>
                ) : (
                  groups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{group.name}</div>
                        <div className="text-sm text-gray-600">{group.description}</div>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Configure as preferências gerais do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orgName">Nome da Organização</Label>
                  <Input id="orgName" placeholder="Nome da sua empresa" />
                </div>
                <div>
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/sao_paulo">America/São Paulo</SelectItem>
                      <SelectItem value="america/new_york">America/New York</SelectItem>
                      <SelectItem value="europe/london">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
