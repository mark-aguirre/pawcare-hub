'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClinic } from '@/contexts/ClinicContext';
import { ClinicSetup } from '@/components/auth/ClinicSetup';
import { ClinicSelector } from '@/components/auth/ClinicSelector';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const { user, isLoading } = useAuth();
  const { currentClinic } = useClinic();
  const [showSetup, setShowSetup] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show children (login page)
  if (!user) {
    return <>{children}</>;
  }

  // If user is logged in but needs clinic setup
  if (user.role === 'ADMINISTRATOR' && !currentClinic && !user.clinicCode && !showSetup) {
    return (
      <ClinicSelector
        onClinicSelected={() => {}}
        onCreateNew={() => setShowSetup(true)}
      />
    );
  }

  // Show clinic setup form
  if (showSetup) {
    return (
      <ClinicSetup
        onComplete={() => setShowSetup(false)}
      />
    );
  }

  // If user has clinic or is not admin, show main app
  return <>{children}</>;
}