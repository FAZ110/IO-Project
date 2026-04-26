import { useState } from 'react';
import { useProjectRolesStatus, useCreateAllocationRequest } from '../project.hooks';
import { useUsersQuery } from '@/features/user-management/user-management.hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ProjectRoleStatusResponse } from '../project.types';
import { Loader2, Search, User as UserIcon, Check } from 'lucide-react';

export const ProjectRolesStatus = ({ projectId }: { projectId: string }) => {
  const { data: roles, isLoading, isError } = useProjectRolesStatus(projectId);
  const createAllocationReq = useCreateAllocationRequest(projectId);
  
  const [selectedRole, setSelectedRole] = useState<ProjectRoleStatusResponse | null>(null);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [justification, setJustification] = useState('');

  const { data: usersData, isLoading: isUsersLoading } = useUsersQuery(0, 100, { search: searchQuery });

  const handleOpenAllocationDialog = (role: ProjectRoleStatusResponse) => {
    setSelectedRole(role);
    setIsAllocationDialogOpen(true);
    setSearchQuery('');
    setSelectedUserId('');
    setJustification('Wniosek o przydzielenie pracownika do roli w projekcie.');
  };

  const submitAllocationRequest = () => {
    if (!selectedRole || !selectedUserId || !justification) return;
    
    createAllocationReq.mutate({
      roleId: selectedRole.id,
      data: {
        requestedEmployeeId: selectedUserId,
        justification
      }
    }, {
      onSuccess: () => {
        setIsAllocationDialogOpen(false);
        setSelectedUserId('');
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <Badge className="bg-green-100 text-green-800 border-green-200">Otwarte</Badge>;
      case 'PENDING': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Oczekujący wniosek</Badge>;
      case 'FILLED': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Zajęte</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) return <div className="p-4 text-center text-muted-foreground"><Loader2 className="animate-spin inline mr-2" /> Ładowanie ról...</div>;
  if (isError) return <div className="p-4 text-red-500 text-center">Błąd podczas ładowania ról projektu.</div>;

  return (
    <div className="space-y-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold leading-none tracking-tight">Role w projekcie i obsada</h3>
      </div>

      <div className="space-y-4">
        {roles?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Brak zdefiniowanych ról w tym projekcie.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {roles?.map((role) => (
              <div key={role.id} className="flex flex-col p-4 border rounded-lg shadow-sm bg-background hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-base">{role.roleName || 'Brak nazwy roli'}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Status obsady stanowiska</p>
                  </div>
                  {getStatusBadge(role.status)}
                </div>
                
                <div className="mt-4 flex justify-end">
                  {role.status === 'OPEN' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenAllocationDialog(role)}
                    >
                      Wniosek o przydział
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Allocation Request Dialog */}
      <Dialog open={isAllocationDialogOpen} onOpenChange={setIsAllocationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Wybierz pracownika: {selectedRole?.roleName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Wpisz imię, nazwisko lub email..."
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto border rounded-md p-1 bg-muted/10">
              {isUsersLoading ? (
                <div className="p-4 flex items-center justify-center text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Ładowanie pracowników...
                </div>
              ) : (usersData?.items?.length ?? 0) === 0 ? (
                <div className="p-4 text-sm text-center text-muted-foreground">Brak wyników wyszukiwania.</div>
              ) : (
                usersData?.items?.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => setSelectedUserId(user.id)}
                    className={`flex items-center justify-between p-2 text-sm rounded cursor-pointer transition-colors ${selectedUserId === user.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 opacity-70" />
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name} {user.surname}</span>
                        <span className={`text-xs ${selectedUserId === user.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{user.email}</span>
                      </div>
                    </div>
                    {selectedUserId === user.id && <Check className="w-4 h-4" />}
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-medium">Uzasadnienie (opcjonalne)</label>
              <textarea 
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllocationDialogOpen(false)}>Anuluj</Button>
            <Button 
              onClick={submitAllocationRequest} 
              disabled={createAllocationReq.isPending || !selectedUserId}
            >
              {createAllocationReq.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Złóż wniosek
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
