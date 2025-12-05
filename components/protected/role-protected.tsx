'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { useState } from 'react';
import LoginDialog from '../logindialog';

interface RoleProtectedProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export default function RoleProtected({ children, allowedRoles, fallback }: RoleProtectedProps) {
  const { data: session, status } = useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
 console.log(session)
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-4">You need to be signed in to access this content.</p>
          <button
            onClick={() => setShowLoginDialog(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
        <LoginDialog 
          isOpen={showLoginDialog} 
          onClose={() => setShowLoginDialog(false)} 
        />
      </>
    );
  }

  if (!allowedRoles.includes(session.user.role)) {
    return (
      <div className="p-6 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Access Denied</h3>
          <p className="text-yellow-700">
            This page is only accessible to {allowedRoles.join(' or ')}.
            Your current role is <strong>{session.user.role}</strong>.
          </p>
          {fallback || (
            <button
              onClick={() => window.history.back()}
              className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}