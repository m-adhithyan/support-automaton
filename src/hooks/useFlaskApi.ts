import { useState, useCallback } from 'react';

const FLASK_BASE_URL = 'http://localhost:3000';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const useFlaskApi = () => {
  const [loading, setLoading] = useState(false);

  const makeRequest = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    try {
      const response = await fetch(`${FLASK_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null, loading: false };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const testZendesk = useCallback(() => {
    return makeRequest('/test_zendesk');
  }, [makeRequest]);

  const runAiReply = useCallback(() => {
    return makeRequest('/run_ai_reply');
  }, [makeRequest]);

  const uploadDocument = useCallback((file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    
    return makeRequest('/upload_document', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    });
  }, [makeRequest]);

  return {
    loading,
    testZendesk,
    runAiReply,
    uploadDocument,
    makeRequest,
  };
};