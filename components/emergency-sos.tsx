'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function EmergencySOS() {
  const [isActive, setIsActive] = useState(false);

  const handleEmergency = () => {
    setIsActive(true);
    toast.error('🚨 Emergency alert sent to nearby hospitals', {
      duration: 3000,
    });
    
    setTimeout(() => setIsActive(false), 3000);
  };

  return (
    <button
      onClick={handleEmergency}
      className={`fixed bottom-6 right-6 rounded-full p-4 shadow-lg transition-all ${
        isActive
          ? 'bg-red-600 scale-110 animate-pulse'
          : 'bg-red-500 hover:bg-red-600'
      } text-white flex items-center gap-2 z-40`}
      disabled={isActive}
    >
      <AlertCircle className="w-5 h-5" />
      <span className="text-sm font-bold">SOS</span>
    </button>
  );
}
