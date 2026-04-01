'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';
import { mockHospitals } from '@/lib/mock-data';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Super Admin check
    if (email === 'admin@hospital.com' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'admin');
      toast.success('Super Admin login successful!');
      router.push('/admin/dashboard');
      setIsLoading(false);
      return;
    }

    // Individual Hospital check (e.g., admin@h1.com)
    const emailRegex = /^admin@(.+)\.com$/;
    const match = email.match(emailRegex);

    if (match && password === 'admin123') {
      const hospitalId = match[1];
      const isValidHospital = mockHospitals.some(h => h.id === hospitalId);

      if (isValidHospital) {
        localStorage.setItem('adminAuth', hospitalId);
        toast.success(`Logged in to Hospital: ${hospitalId}`);
        router.push('/admin/dashboard');
      } else {
        toast.error('Hospital ID not found.');
      }
    } else {
      toast.error('Invalid credentials.');
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
              <CardTitle className="text-2xl">Hospital Login</CardTitle>
              <p className="text-sm text-gray-600">Update your hospital's capacity</p>
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
                    placeholder="admin@h1.com"
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2 text-sm">
                <p className="font-medium text-blue-900">Demo Credentials:</p>
                <div>
                  <p className="text-blue-800 font-medium">Specific Hospital:</p>
                  <p className="text-blue-800">Email: <span className="font-mono">admin@h1.com</span> (or h2, h3, etc.)</p>
                  <p className="text-blue-800">Password: <span className="font-mono">admin123</span></p>
                </div>
                <div className="pt-1 border-t border-blue-200">
                  <p className="text-blue-800 font-medium">Super Admin (Sees All):</p>
                  <p className="text-blue-800">Email: <span className="font-mono">admin@hospital.com</span></p>
                  <p className="text-blue-800">Password: <span className="font-mono">admin123</span></p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}