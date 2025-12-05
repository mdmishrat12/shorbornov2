'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function UpdateRole() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);

  const updateRole = async (newRole: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        // Update the session to reflect the new role
        await update();
        alert(`Role updated to ${newRole}`);
      } else {
        alert('Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error updating role');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to update your role</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Update Your Role</h1>
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Current Session Data:</strong>
          </p>
          <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(session.user, null, 2)}
          </pre>
        </div>
        
        <p className="mb-4">
          Current role: <strong className="capitalize">{session.user.role || 'not set'}</strong>
        </p>
        
        <div className="space-y-2">
          <button
            onClick={() => updateRole('student')}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Set as Student'}
          </button>
          <button
            onClick={() => updateRole('teacher')}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Set as Teacher'}
          </button>
          <button
            onClick={() => updateRole('admin')}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Set as Admin'}
          </button>
        </div>
      </div>
    </div>
  );
}