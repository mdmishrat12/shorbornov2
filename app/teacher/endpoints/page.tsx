// app/test-api/page.tsx
'use client';

import { useState } from 'react';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async (endpoint: string) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setResult({ endpoint, status: response.status, data });
    } catch (error) {
      setResult({ endpoint, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const endpoints = [
    '/api/categories',
    '/api/categories/exam-types',
    '/api/categories/exam-series',
    '/api/categories/subjects',
    '/api/categories/topics',
    '/api/categories/standards',
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test API Routes</h1>
      
      <div className="space-y-2 mb-6">
        {endpoints.map((endpoint) => (
          <button
            key={endpoint}
            onClick={() => testApi(endpoint)}
            disabled={loading}
            className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Test {endpoint}
          </button>
        ))}
      </div>

      {loading && <div>Loading...</div>}
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Result for {result.endpoint}:</h2>
          <pre className="mt-2 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}