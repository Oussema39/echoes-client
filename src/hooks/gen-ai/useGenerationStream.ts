import { useRef, useState } from "react";
import { apiClient } from "@/api/axios";
import { apiEndpoints } from "@/utils/endpoints";

type StreamResult = {
  message: string;
  isStreaming: boolean;
  error: string | null;
  isLoading: boolean;
  cancel: () => void;
};

export const useGenerationStream = (): [
  (text: string) => void,
  StreamResult
] => {
  const [message, setMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const startStream = async (text: string) => {
    if (isStreaming) return;

    setMessage("");
    setIsStreaming(true);
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await apiClient.post(
        apiEndpoints.ai.stream,
        { text },
        {
          responseType: "stream",
          signal: controller.signal,
        }
      );

      console.log({ response });

      const reader = response.data.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setMessage(result);
      }

      setIsLoading(false);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Stream error");
      }
      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  const cancel = () => {
    controllerRef.current?.abort();
    setIsStreaming(false);
    setIsLoading(false);
  };

  return [startStream, { message, isStreaming, error, isLoading, cancel }];
};
