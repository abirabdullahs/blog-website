'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid credentials. Access denied.');
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] p-6">
      <div className="w-full max-w-md border-2 border-black p-10 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-10 text-center">
          <span className="text-[0.6rem] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2 block">Restricted Access</span>
          <h1 className="text-4xl font-bold tracking-tighter italic font-serif">Chronicle<span className="not-italic text-sm ml-2 uppercase font-mono bg-black text-white px-2 py-0.5 tracking-normal">Admin</span></h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[0.65rem] uppercase font-black tracking-widest block">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full p-4 border border-black outline-none focus:bg-black/5 transition-colors text-sm font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] uppercase font-black tracking-widest block">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 border border-black outline-none focus:bg-black/5 transition-colors text-sm font-medium"
            />
          </div>

          {error && (
            <p className="text-[0.65rem] uppercase font-bold text-red-600 tracking-tighter">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white p-4 text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Enter System'}
          </button>
        </form>
      </div>
    </div>
  );
}
