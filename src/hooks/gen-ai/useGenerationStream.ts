import { useRef, useState } from "react";
import { apiClient } from "@/api/axios";
import { apiEndpoints } from "@/utils/endpoints";

const BASE_URL = import.meta.env.VITE_API_URL;

type StreamResult = {
  messages: string[];
  isStreaming: boolean;
  error: string | null;
  isLoading: boolean;
  isLoadingInit: boolean;
  cancel: () => void;
};

export const useGenerationStream = (): [
  (
    text: string,
    onMessage?: (data: string, event: MessageEvent) => void,
    onEnd?: (event: MessageEvent) => void
  ) => void,
  StreamResult
] => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInit, setIsLoadingInit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startStream = async (
    text: string,
    onMessage?: (data: string, event: MessageEvent) => void,
    onEnd?: (event: MessageEvent) => void
  ) => {
    if (isStreaming) return;

    setMessages([]);
    setIsStreaming(true);
    setIsLoading(true);
    setError(null);

    try {
      setIsLoadingInit(true);
      const response = await apiClient.post(apiEndpoints.ai.initStream, {
        text,
      });
      const { streamId } = response.data;

      const streamUrl = `${BASE_URL}${apiEndpoints.ai.stream}?streamId=${streamId}`;
      const eventSource = new EventSource(streamUrl);
      eventSourceRef.current = eventSource;
      setIsLoadingInit(false);

      eventSource.onmessage = (event) => {
        if (onMessage) {
          onMessage(event.data as string, event);
        }
        setMessages((prev) => [...prev, event.data as string]);
      };

      eventSource.addEventListener("end", (e) => {
        eventSource.close();
        onEnd(e);
        setIsLoading(false);
        setIsStreaming(false);
      });

      eventSource.onerror = (err) => {
        setError("Stream error");
        setIsStreaming(false);
        setIsLoading(false);
        eventSource.close();
      };
    } catch (err) {
      console.error("Stream initiation error:", err);
      setError("Failed to start stream");
      setIsStreaming(false);
      setIsLoading(false);
      setIsLoadingInit(false);
    }
  };

  const cancel = () => {
    eventSourceRef.current?.close();
    setIsStreaming(false);
    setIsLoading(false);
  };

  return [
    startStream,
    { messages, isStreaming, error, isLoading, isLoadingInit, cancel },
  ];
};
