import { useEffect } from 'react';
import {useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { connectSSE } from '@/api/sseClient';
import { notificationService } from './notification.service';
import { queryKeys } from '@/api';
import { ENDPOINTS } from '@/api/endpoints';
import { API_BASE_URL } from '@/api/client';
import type { NotificationResponse } from './notification.types';
import type { PagedResponse } from '@/api/api.types';

export const useUnreadCount = () => {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount().queryKey,
    queryFn: notificationService.getUnreadCount,
    staleTime: Infinity,
  });
};

export const useNotifications = (unreadOnly: boolean, isOpen: boolean) => {
  return useQuery({
    queryKey: queryKeys.notifications.feed(unreadOnly, 0).queryKey,
    queryFn: () => notificationService.getNotifications(unreadOnly, 0, 10),
    enabled: isOpen,
    staleTime: Infinity,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onMutate: async (notificationId) => {
      queryClient.setQueryData<number>(queryKeys.notifications.unreadCount().queryKey, (old) => Math.max(0, (old || 0) - 1));

      const allFeedKey = queryKeys.notifications.feed(false, 0).queryKey;
      queryClient.setQueryData<PagedResponse<NotificationResponse>>(allFeedKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        };
      });

      const unreadFeedKey = queryKeys.notifications.feed(true, 0).queryKey;
      queryClient.setQueryData<PagedResponse<NotificationResponse>>(unreadFeedKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter(n => n.id !== notificationId),
          totalCount: Math.max(0, old.totalCount - 1)
        };
      });

      const infiniteAllKey = queryKeys.notifications.infinite(false).queryKey;
      queryClient.setQueryData<InfiniteData<PagedResponse<NotificationResponse>>>(infiniteAllKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            items: page.items.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
          }))
        };
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.infinite(true).queryKey });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onMutate: async () => {
      queryClient.setQueryData(queryKeys.notifications.unreadCount().queryKey, 0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications._def });
    }
  });
};

export const useInfiniteNotifications = (unreadOnly: boolean) => {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications.infinite(unreadOnly).queryKey,
    queryFn: ({ pageParam = 0 }) => notificationService.getNotifications(unreadOnly, pageParam, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.pageNumber < lastPage.totalPages - 1) {
        return lastPage.pageNumber + 1;
      }
      return undefined;
    },
  });
};

export const useNotificationStream = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const url = `${API_BASE_URL}${ENDPOINTS.NOTIFICATIONS.STREAM}`;

    const disconnect = connectSSE({
      url,
      onOpen: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount().queryKey });
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.feed(true, 0).queryKey });
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.feed(false, 0).queryKey });
      },
      onMessage: (ev) => {
        if (ev.event === 'NOTIFICATION') {
          const newNotification: NotificationResponse = JSON.parse(ev.data);

          queryClient.setQueryData<number>(queryKeys.notifications.unreadCount().queryKey, (old) => (old || 0) + 1);

          [true, false].forEach(unreadOnly => {
            const feedKey = queryKeys.notifications.feed(unreadOnly, 0).queryKey;
            queryClient.setQueryData<PagedResponse<NotificationResponse>>(feedKey, (oldData) => {
              if (!oldData) {
                queryClient.invalidateQueries({ queryKey: feedKey });
                return oldData;
              }

              return {
                ...oldData,
                items: [newNotification, ...oldData.items].slice(0, 10),
                totalCount: oldData.totalCount + 1,
              };
            });
          });
        }
      }
    });

    return () => disconnect();
  }, [queryClient]);
};