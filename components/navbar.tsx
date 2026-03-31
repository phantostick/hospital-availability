'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const router = useRouter();
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            H
          </div>
          <span className="font-bold text-lg text-gray-900">Hospital Portal</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <>
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button onClick={handleLogout} size="sm">
                Logout
              </Button>
            </>
          ) : (
            <Link href="/admin/login">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
