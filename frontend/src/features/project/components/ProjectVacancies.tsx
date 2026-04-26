import { useState } from 'react';
import { useProjectVacancies, useCreateAllocationRequest, useCreateVacancy } from '../project.hooks';
import { useUsersQuery } from '@/features/user-management/user-management.hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { VacancyResponse } from '../project.types';
import { Loader2 } from 'lucide-react';

export const ProjectVacancies = ({ projectId }: { projectId: string }) => {
  const { data: vacancies, isLoading, isError } = useProjectVacancies(projectId);
  const createAllocationReq = useCreateAllocationRequest(projectId);
  const createVacancyReq = useCreateVacancy(projectId);
  
  const [selectedVacancy, setSelectedVacancy] = useState<VacancyResponse | null>(null);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  const [isVacancyDialogOpen, setIsVacancyDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [justification, setJustification] = useState('');
  
  const [newVacancyRoleId, setNewVacancyRoleId] = useState('');

  const { data: usersData, isLoading: isUsersLoading } = useUsersQuery(1, 10, { search: searchQuery });

  const handleOpenAllocationDialog = (vacancy: VacancyResponse) => {
    setSelectedVacancy(vacancy);
    setIsAllocationDialogOpen(true);
    setSearchQuery('');
    setSelectedUserId('');
    setJustification('');
  };

  const submitAllocationRequest = () => {
    if (!selectedVacancy || !selectedUserId || !justification) return;
    
    createAllocationReq.mutate({
      vacancyId: selectedVacancy.id,
      data: {
        requestedEmployeeId: selectedUserId,
        justification
      }
    }, {
      onSuccess: () => setIsAllocationDialogOpen(false)
    });
  };

  const submitCreateVacancy = () => {
    if (!newVacancyRoleId) return;
    
    createVacancyReq.mutate({
      roleId: newVacancyRoleId
    }, {
      onSuccess: () => {
        setIsVacancyDialogOpen(false);
        setNewVacancyRoleId('');
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <Badge className="bg-green-100 text-green-800 border-green-200">Otwarte</Badge>;
      case 'PENDING_REQUEST': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Oczekujący wniosek</Badge>;
      case 'FILLED': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Zajęte</Badge>;
      case 'CANCELLED': return <Badge className="bg-red-100 text-red-800 border-red-200">Anulowane</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) return <div className="p-4 text-center">Ładowanie wakatów...</div>;
  if (isError) return <div className="p-4 text-red-500 text-center">Błąd podczas ładowania wakatów.</div>;

  return (
    <div className="space-y-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold leading-none tracking-tight">Wakaty</h3>
        
        {/* Create Vacancy Dialog */}
        <Dialog open={isVacancyDialogOpen} onOpenChange={setIsVacancyDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Dodaj Wakat</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Utwórz nowy wakat</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Here we'd ideally load ProjectRoles. But for simplicity let's assume we fetch them or just show an input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">ID Roli w projekcie (z powodu braku endpointu ról wstaw ręcznie)</label>
                <input 
                  type="text" 
                  value={newVacancyRoleId}
                  onChange={(e) => setNewVacancyRoleId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                  placeholder="ID Roli..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsVacancyDialogOpen(false)}>Anuluj</Button>
              <Button onClick={submitCreateVacancy} disabled={createVacancyReq.isPending || !newVacancyRoleId}>
                {createVacancyReq.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Zapisz
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {vacancies?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Brak wakatów w tym projekcie.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {vacancies?.map((vacancy) => (
              <div key={vacancy.id} className="flex flex-col p-4 border rounded-lg shadow-sm bg-background">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-base">{vacancy.roleName || 'Brak nazwy roli'}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Wakat dla tego stanowiska</p>
                  </div>
                  {getStatusBadge(vacancy.status)}
                </div>
                
                <div className="mt-4 flex justify-end">
                  {vacancy.status === 'OPEN' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenAllocationDialog(vacancy)}
                    >
                      Wniosek o przypisanie pracownika
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wniosek o przydział zasobu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Złóż wniosek do przełożonego o przydzielenie konkretnego pracownika na wybrane stanowisko.
            </p>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Wyszukaj pracownika</label>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                placeholder="Wpisz imię, nazwisko lub email..."
              />
            </div>
            
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border rounded-md p-1">
              {isUsersLoading ? (
                <div className="p-2 text-sm text-center">Szukanie...</div>
              ) : usersData?.items?.length === 0 ? (
                <div className="p-2 text-sm text-center">Brak wyników</div>
              ) : (
                usersData?.items?.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => setSelectedUserId(user.id)}
                    className={`p-2 text-sm rounded cursor-pointer ${selectedUserId === user.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    {user.name} {user.surname} ({user.email})
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="text-sm font-medium">Uzasadnienie wniosku</label>
              <textarea 
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Uzasadnij dlaczego ten pracownik jest potrzebny w projekcie..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllocationDialogOpen(false)}>Anuluj</Button>
            <Button 
              onClick={submitAllocationRequest} 
              disabled={createAllocationReq.isPending || !selectedUserId || !justification}
            >
              {createAllocationReq.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Wyślij wniosek
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};