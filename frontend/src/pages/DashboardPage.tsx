import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { useProjects } from '@/features/project/project.hooks';
import { DashboardProjectList } from '@/features/dashboard/components/DashboardProjectList/DashboardProjectList';

export const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: projects = [] } = useProjects();

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
                        <div className="flex gap-4">
                            <Button variant="secondary" onClick={() => navigate(PATHS.CREATE_PROJECT_GROUP)} className="gap-2 bg-white text-slate-800 hover:bg-slate-100 shadow-lg px-6 py-6 text-lg font-bold rounded-2xl transition-transform hover:scale-105 shrink-0">
                                <Briefcase size={22} /> Nowa grupa
                            </Button>
                            <Button variant="secondary" onClick={() => navigate(PATHS.CREATE_PROJECT)} className="gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-lg px-6 py-6 text-lg font-bold rounded-2xl transition-transform hover:scale-105 shrink-0">
                                <Plus size={22} /> Nowy projekt
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            Twoje Projekty i Grupy
                            <span className="bg-gray-100 text-gray-600 text-sm py-1 px-3 rounded-full border">
                                {stats.total} projektów
                            </span>
                        </h2>

                        <div className="flex items-center gap-2">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    placeholder="Szukaj..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 ring-blue-500 outline-none w-48 transition-all focus:w-64" 
                                />
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <Button variant="ghost" size="sm" className="bg-white shadow-sm rounded-lg px-2"><LayoutGrid size={16} /></Button>
                                <Button variant="ghost" size="sm" className="px-2 text-gray-400"><List size={16} /></Button>
                            </div>
                        </div>
                    </div>

                    <DashboardProjectList searchQuery={searchQuery} />

                </div>

                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            <PieChart size={20} className="text-blue-600" />
                            Podsumowanie struktury
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