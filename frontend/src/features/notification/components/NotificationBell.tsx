import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCircle2, Loader2, Filter } from 'lucide-react';
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
  useUnreadCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead
} from '../notification.hooks';
import { getNotificationUrl } from '../notification.utils';
import type { NotificationType } from '../notification.types';
import { cn } from '@/lib/utils';

export const NotificationBell = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(true);

  const { data: unreadCount = 0 } = useUnreadCount();

  const { data, isLoading } = useNotifications(unreadOnly, isOpen);

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();

  const notifications = data?.items || [];

  const handleNotificationClick = (type: NotificationType, referenceId: string, id: string, isRead: boolean) => {
    if (!isRead) markAsRead(id);
    setIsOpen(false);
    navigate(getNotificationUrl(type, referenceId));
  };

  const handleMarkAsReadOnly = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsRead(id);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                variant="ghost" size="sm"
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
              <div
                key={notification.id}
                className={cn(
                  "relative flex group transition-colors border-b last:border-b-0",
                  !notification.isRead ? "bg-blue-50/20 hover:bg-blue-50/60" : "bg-white hover:bg-slate-50 opacity-60 grayscale-[30%]"
                )}
              >
                <button
                  onClick={() => handleNotificationClick(notification.type, notification.referenceId, notification.id, notification.isRead)}
                  className="w-full text-left flex flex-col items-start p-4 pr-10"
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
                    !notification.isRead ? "text-slate-900 font-medium" : "text-slate-500"
                  )}>
                    {notification.message}
                  </p>
                </button>

                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleMarkAsReadOnly(e, notification.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Oznacz jako przeczytane"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-2 border-t text-center bg-slate-50 rounded-b-md">
          <Button variant="link" size="sm" onClick={() => { setIsOpen(false); navigate('/notifications'); }} className="text-xs text-slate-500 hover:text-slate-900">
            Zobacz wszystkie powiadomienia
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};