'use client';

import { useState } from 'react';

interface SeedResult {
  success: boolean;
  message: string;
  data?: {
    users: number;
    analyses: number;
    feedback: number;
  };
}

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);

  const seedDatabase = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: 'Error seeding database' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Seed Database</h1>
        <p className="text-zinc-400 mb-6">
          Click the button below to populate the database with dummy data.
        </p>
        
        <button
          onClick={seedDatabase}
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Seeding...' : 'Seed Database'}
        </button>

        {result && (
          <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-900/20 border border-green-500' : 'bg-red-900/20 border border-red-500'}`}>
            <p className={`font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {result.message}
            </p>
            {result.data && (
              <div className="mt-2 text-sm text-zinc-300">
                <p>Users: {result.data.users}</p>
                <p>Analyses: {result.data.analyses}</p>
                <p>Feedback: {result.data.feedback}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}