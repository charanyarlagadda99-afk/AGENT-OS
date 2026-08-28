import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';

export const Signup = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    const { error } = await signUp({ email, password });
    if (!error) navigate('/dashboard');
    else alert(error.message);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center mb-4">
        <Bot size={48} className="text-cyan-500" />
      </div>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field w-full" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field w-full" required />
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field w-full" required />
        </div>
        <button type="submit" className="btn-primary w-full py-2">Sign Up</button>
      </form>
      <p className="text-center text-zinc-400 mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-cyan-500 hover:underline">Log in</Link>
      </p>
    </div>
  );
};
