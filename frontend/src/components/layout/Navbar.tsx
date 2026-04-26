import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthContext';
import { useAuthActions } from '@/features/auth/auth.hooks';
import { PATHS } from '@/routes/paths';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LogOut,
  Briefcase,
  Bell,
  UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/routes/navigation';

export const Navbar = () => {
  const { user } = useAuth();
  const { logoutUser, isLoggingOut } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  // TODO: powiadomienia
  const unreadNotifications = 3;

  const initials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`.toUpperCase();

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-8">
          <Link to={PATHS.ROOT} className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors">
            <Briefcase className="h-6 w-6" />
            <span>ProjectManager</span>
          </Link>

          <div className="hidden md:flex gap-1">
            {visibleNavItems.map((item) => {
              const active = location.pathname === item.path && isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    !item.isCritical && (active 
                      ? "bg-slate-100 text-slate-900" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"),
                    item.isCritical && (active 
                      ? "bg-red-50 text-red-700" 
                      : "text-red-600 hover:bg-red-50 hover:text-red-700")
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
         </div>
        </div>

        <div className="flex items-center gap-2">

          <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900 cursor-pointer">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]">
                {unreadNotifications}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-slate-200 transition-all ml-2 cursor-pointer">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-blue-600 text-white font-semibold">
                    {initials || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-1.5">
                  <p className="text-sm font-medium leading-none text-slate-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-slate-500">
                    {user?.email}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 pt-1">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate(PATHS.PROFILE)} className="cursor-pointer flex items-center gap-2 py-2">
                  <UserCircle className="h-4 w-4 text-slate-500" />
                  <span>Mój Profil</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={isLoggingOut}
                onClick={() => logoutUser()}
                className="cursor-pointer flex items-center gap-2 py-2 text-slate-600 hover:text-slate-900"
              >
                <LogOut className={cn("h-4 w-4", isLoggingOut && "animate-pulse")} />
                <span>{isLoggingOut ? 'Wylogowywanie...' : 'Wyloguj'}</span>
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </nav>
  );
};