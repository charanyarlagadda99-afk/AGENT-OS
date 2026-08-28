import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';

export const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn({ email, password });
    if (!error) navigate('/dashboard');
    else alert(error.message);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center mb-4">
        <Bot size={48} className="text-cyan-500" />
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field w-full" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field w-full" required />
        </div>
        <button type="submit" className="btn-primary w-full py-2">Log In</button>
      </form>
      <p className="text-center text-zinc-400 mt-4 text-sm">
        Don't have an account? <Link to="/signup" className="text-cyan-500 hover:underline">Sign up</Link>
      </p>
    </div>
  );
};
