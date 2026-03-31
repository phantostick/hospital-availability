'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated auth - dummy credentials for demo
    if (email === 'admin@hospital.com' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      toast.success('Login successful!');
      router.push('/admin/dashboard');
    } else {
      toast.error('Invalid credentials. Try admin@hospital.com / admin123');
    }

    setIsLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                H
              </div>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <p className="text-sm text-gray-600">Hospital Management Portal</p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="admin@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Demo Credentials */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1 text-sm">
                <p className="font-medium text-blue-900">Demo Credentials:</p>
                <p className="text-blue-800">Email: <span className="font-mono">admin@hospital.com</span></p>
                <p className="text-blue-800">Password: <span className="font-mono">admin123</span></p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
