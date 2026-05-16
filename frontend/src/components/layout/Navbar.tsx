import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthContext';
import { useAuthActions } from '@/features/auth/auth.hooks';
import { PATHS } from '@/routes/paths';
import { Button } from '@/components/ui/button';
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
  UserCircle,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/routes/navigation';
import { NotificationBell } from "@/features/notification/components/NotificationBell.tsx";

export const Navbar = () => {
  const { user } = useAuth();
  const { logoutUser, isLoggingOut } = useAuthActions();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const initials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`.toUpperCase();
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.roles && user && !item.roles.includes(user.role)) return false;
    if (item.children && item.children.length === 0) return false;
    return true;
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
              if (item.children) {
                const isChildActive = item.children.some(child => child.path && isActive(child.path));

                return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors outline-none cursor-pointer",
                        isChildActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                      <ChevronDown className="h-3 w-3 ml-0.5 opacity-50" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-56 p-1">
                      {item.children.map((child) => {
                        const childActive = child.path && location.pathname === child.path;
                        return (
                          <DropdownMenuItem key={child.label} asChild className="p-2 cursor-pointer rounded-md mb-0.5 last:mb-0">
                            <Link
                              to={child.path!}
                              className={cn(
                                "flex items-center gap-2.5 w-full transition-colors",
                                childActive
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                              )}
                            >
                              <child.icon className={cn("h-[18px] w-[18px]", childActive ? "text-blue-600" : "text-slate-500")} />
                              <span className="text-sm">{child.label}</span>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              const active = item.path && (
                item.path === PATHS.ROOT
                  ? location.pathname === PATHS.ROOT
                  : isActive(item.path)
              );

              return (
                <Link
                  key={item.label}
                  to={item.path!}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    !item.isCritical && (active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"),
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
          <NotificationBell />

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

            <DropdownMenuContent className="w-64 p-1" align="end" forceMount>
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
                <DropdownMenuItem asChild className="cursor-pointer p-2 rounded-md mb-0.5">
                  <Link to={PATHS.PROFILE} className="flex items-center gap-2.5 w-full">
                    <UserCircle className="h-[18px] w-[18px] text-slate-500" />
                    <span className="text-sm">Mój Profil</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={isLoggingOut}
                onClick={() => logoutUser()}
                className="cursor-pointer flex items-center gap-2.5 p-2 rounded-md text-slate-600 hover:text-slate-900"
              >
                <LogOut className={cn("h-[18px] w-[18px]", isLoggingOut && "animate-pulse")} />
                <span className="text-sm">{isLoggingOut ? 'Wylogowywanie...' : 'Wyloguj'}</span>
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};