import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthContext';
import { UserRole } from '@/features/auth/auth.types';
import {
    Plus,
    LayoutGrid,
    List,
    Search,
    Activity,
    PieChart,
    Briefcase,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { ProjectCardView } from '@/features/dashboard/components/ProjectCard/ProjectCard.view';
import { useProjects } from '@/features/project/project.hooks';

export const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: projects = [], isLoading, isError } = useProjects();

    const stats = useMemo(() => {
        const total = projects.length;
        const active = projects.filter(p => p.isActive === true).length;
        const inactive = total - active;

        return { total, active, inactive };
    }, [projects]);

    return (
        <div className="p-6 md:p-8 max-w-400 mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="relative bg-linear-to-br from-slate-800 via-blue-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-8 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            Dzień dobry, {user?.firstName || 'Użytkowniku'}!
                        </h1>
                        <p className="text-slate-300 text-lg max-w-lg font-medium">
                            Masz{' '}
                            <span className="text-white font-semibold">{stats.active} aktywnych projektów</span>{' '}
                            w swoim portfelu.
                        </p>
                    </div>
                    {user?.role === UserRole.PROJECT_MANAGER && (
                        <Button variant="secondary" onClick={() => navigate(PATHS.CREATE_PROJECT)} className="gap-2 bg-white text-slate-800 hover:bg-slate-100 shadow-lg px-6 py-6 text-lg font-bold rounded-2xl transition-transform hover:scale-105 shrink-0">
                            <Plus size={22} /> Nowy projekt
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            Twoje Projekty
                            <span className="bg-gray-100 text-gray-600 text-sm py-1 px-3 rounded-full border">
                {stats.total}
              </span>
                        </h2>

                        <div className="flex items-center gap-2">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input placeholder="Szukaj..." className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 ring-blue-500 outline-none w-48 transition-all focus:w-64" />
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <Button variant="ghost" size="sm" className="bg-white shadow-sm rounded-lg px-2"><LayoutGrid size={16} /></Button>
                                <Button variant="ghost" size="sm" className="px-2 text-gray-400"><List size={16} /></Button>
                            </div>
                        </div>
                    </div>

                    {isError && (
                        <div className="flex flex-col items-center justify-center py-12 px-4 bg-red-50 border border-red-100 rounded-3xl text-red-600">
                            <AlertCircle size={40} className="mb-4 opacity-80" />
                            <h3 className="font-bold text-lg">Wystąpił błąd</h3>
                            <p>Nie udało się załadować projektów. Spróbuj odświeżyć stronę.</p>
                        </div>
                    )}

                    {isLoading && !isError && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-2xl" />)}
                        </div>
                    )}

                    {!isLoading && !isError && projects.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="text-slate-400" size={24} />
                            </div>
                            <p className="text-slate-500 mb-6 font-medium text-lg">Nie masz jeszcze żadnych projektów.</p>
                            {user?.role === UserRole.PROJECT_MANAGER && (
                                <Button onClick={() => navigate(PATHS.CREATE_PROJECT)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                                    Utwórz pierwszy projekt
                                </Button>
                            )}
                        </div>
                    )}

                    {!isLoading && !isError && projects.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    to={PATHS.PROJECT(project.id)}
                                    className="block transition-transform hover:-translate-y-1"
                                >
                                    <ProjectCardView project={project} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            <PieChart size={20} className="text-blue-600" />
                            Podsumowanie portfela
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="p-2 bg-slate-100 w-fit rounded-lg mb-3">
                                    <Briefcase size={20} className="text-slate-600" />
                                </div>
                                <p className="text-2xl font-black text-slate-900">{stats.total}</p>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wszystkie</p>
                            </div>

                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <div className="p-2 bg-emerald-100 w-fit rounded-lg mb-3">
                                    <TrendingUp size={20} className="text-emerald-600" />
                                </div>
                                <p className="text-2xl font-black text-emerald-900">{stats.active}</p>
                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Aktywne</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Ukończone / Wstrzymane</span>
                                <span className="font-bold text-gray-700">{stats.inactive}</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${(stats.active / (stats.total || 1)) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Twoja Rola</p>
                            <p className="text-xl font-bold">{user?.role === 'PROJECT_MANAGER' ? 'Project Manager' : user?.role || 'Użytkownik'}</p>
                            <Activity size={40} className="absolute top-0 right-0 text-white/10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};