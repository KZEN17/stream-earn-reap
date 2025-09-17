import React, { useState } from 'react';
import { CustomSidebar } from '@/components/ui/CustomSidebar';

export const SidebarDemo = () => {
  const [currentPath, setCurrentPath] = useState('/');

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    console.log('Navigate to:', path);
  };

  return (
    <div className="flex h-screen">
      <CustomSidebar 
        currentPath={currentPath} 
        onNavigate={handleNavigate} 
      />
      <div className="flex-1 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold">Current Path: {currentPath}</h1>
        <p className="text-gray-600 mt-2">Click items in the sidebar to see navigation in action</p>
      </div>
    </div>
  );
};