"use client"
import './style.css'

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'

import { apiUrl } from '@/constant/env';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter()
 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.data))
      localStorage.setItem('access_token', data.accessToken)
      toast('Success Login')
      router.push('/', { scroll: false })
      setLoading(false)
    } catch (error: any) {
      toast(error?.message ?? 'Some error')
      setLoading(false)
    }
  };

  return (
    <div className='container'>
      <div className="form">
        <div className='title'>
          <h1>Book Store</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label className='label-text'>Email:</label>
            <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='inp-text'
            />
          </div>
          <br />
          <div>
            <label className='label-text'>Password:</label>
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='inp-text'
            />
          </div>
          <br />
          <button disabled={loading} className='btn' type="submit">{loading ? 'Loading...' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
