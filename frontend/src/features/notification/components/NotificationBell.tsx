import { useNavigate } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications } from '../notification.hooks';
import { getNotificationUrl } from '../notification.types';
import { cn } from '@/lib/utils';

export const NotificationBell = () => {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useNotifications();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (type: any, referenceId: string, id: string) => {
    // 1. TODO: Strzał do backendu, żeby oznaczyć jako przeczytane (mutacja)
    console.log('Oznaczam jako przeczytane:', id);

    const url = getNotificationUrl(type, referenceId);
    navigate(url);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900 cursor-pointer">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex justify-between items-center p-4 border-b bg-slate-50/50 rounded-t-md">
          <span className="font-semibold text-slate-900">Powiadomienia</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50">
              <Check className="h-3 w-3 mr-1" />
              Oznacz wszystkie
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto flex flex-col">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-slate-500">Ładowanie...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">Brak nowych powiadomień</div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification.type, notification.referenceId, notification.id)}
                className={cn(
                  "w-full text-left flex flex-col items-start p-4 transition-colors border-b last:border-b-0",
                  !notification.isRead
                    ? "bg-blue-50/40 hover:bg-blue-50/80"
                    : "bg-white hover:bg-slate-50 opacity-80"
                )}
              >
                <div className="flex justify-between w-full mb-1">
                  <span className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    !notification.isRead ? "text-blue-700" : "text-slate-500"
                  )}>
                    Nowa aktywność
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={cn(
                  "text-sm line-clamp-2 mt-1",
                  !notification.isRead ? "text-slate-900 font-medium" : "text-slate-600"
                )}>
                  {notification.message}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="p-2 border-t text-center bg-slate-50 rounded-b-md">
          <Button variant="link" size="sm" className="text-xs text-slate-500 hover:text-slate-900">
            Zobacz wszystkie powiadomienia
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};