import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getAccessToken, refreshAccessToken } from './client';

interface SSEConnectionOptions {
  url: string;
  onOpen?: () => void;
  onMessage?: (event: { event: string; data: string }) => void;
  onError?: (error: unknown) => void;
}

export const connectSSE = ({ url, onOpen, onMessage, onError }: SSEConnectionOptions) => {
  let controller = new AbortController();

  const connect = async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      await fetchEventSource(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/event-stream, application/json',
        },
        signal: controller.signal,

        async onopen(response) {
          if (response.ok && onOpen) {
            onOpen();
          }

          if (response.status === 401) {
            try {
              await refreshAccessToken();
              controller.abort();
              controller = new AbortController();
              setTimeout(connect, 100);
              return;
            } catch (err) {
              throw new Error('Refresh failed - stop retrying');
            }
          }

          if (response.status >= 400 && response.status !== 401) {
            throw new Error('Server Error - Stop retrying');
          }
        },

        onmessage(ev) {
          if (onMessage) {
            onMessage(ev);
          }
        },

        onerror(err) {
          if (onError) onError(err);
          throw err;
        }
      });
    } catch (error) {
      console.error('SSE Connection failed', error);
    }
  };

  connect();

  return () => {
    controller.abort();
  };
};