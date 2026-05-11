// features/notification/components/NotificationBell.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead
} from '../notification.hooks';
import { getNotificationUrl } from '../notification.types';
import type { NotificationType } from '../notification.types';
import { cn } from '@/lib/utils';
import { PATHS } from '@/routes/paths';

export const NotificationBell = () => {
  const navigate = useNavigate();
  const [unreadOnly, setUnreadOnly] = useState(true);

  const { data, isLoading } = useNotifications(unreadOnly);

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();

  const notifications = data?.items || [];

  const unreadCount = unreadOnly
    ? (data?.totalCount || 0)
    : notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (type: NotificationType, referenceId: string, id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(id);
    }
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
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex flex-col border-b bg-slate-50/50 rounded-t-md">
          <div className="flex justify-between items-center p-4 pb-2">
            <span className="font-semibold text-slate-900">Powiadomienia</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead()}
                disabled={isMarkingAll}
                className="h-auto p-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                {isMarkingAll ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
                Oznacz wszystkie
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="flex items-center space-x-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <Label htmlFor="unread-filter" className="text-xs text-slate-600 cursor-pointer">
                Tylko nieprzeczytane
              </Label>
            </div>
            <Switch
              id="unread-filter"
              checked={unreadOnly}
              onCheckedChange={setUnreadOnly}
              className="scale-75 cursor-pointer"
            />
          </div>
        </div>

        <div className="max-h-[350px] overflow-y-auto flex flex-col">
          {isLoading ? (
            <div className="p-8 flex justify-center text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Brak {unreadOnly ? 'nieprzeczytanych' : 'nowych'} powiadomień
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification.type, notification.referenceId, notification.id, notification.isRead)}
                className={cn(
                  "w-full text-left flex flex-col items-start p-4 transition-colors border-b last:border-b-0",
                  !notification.isRead
                    ? "bg-blue-50/40 hover:bg-blue-50/80"
                    : "bg-white hover:bg-slate-50 opacity-70"
                )}
              >
                <div className="flex justify-between w-full mb-1">
                  <span className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    !notification.isRead ? "text-blue-700" : "text-slate-500"
                  )}>
                    Aktywność
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
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate('/notifications')}
            className="text-xs text-slate-500 hover:text-slate-900"
          >
            Zobacz wszystkie powiadomienia
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};