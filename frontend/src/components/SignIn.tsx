import { useState } from 'react';
import NavigationBar from './NavigationBar';
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.reload(); // or route change
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen"> 
    <NavigationBar />
      <div className='h-[calc(100vh-80px)]  flex items-center justify-center bg-gray-100 dark:bg-zinc-900 relative'>
      <form
        onSubmit={handleSubmit}
        className="bg-white self-center dark:bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md space-y-5 border border-gray-200 dark:border-zinc-700"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Sign In</h2>
        
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded border bg-white dark:bg-zinc-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded border bg-white dark:bg-zinc-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-zinc-800 transition font-semibold"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      </div>
    </div>
  );
}
