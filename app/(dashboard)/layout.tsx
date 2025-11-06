'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Extract the current section from pathname
  const currentSection = pathname.split('/')[1] || 'dashboard';
  
  const handleSectionChange = (section: string) => {
    router.push(`/${section}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        activeSection={currentSection} 
        onSectionChange={handleSectionChange} 
      />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
}

