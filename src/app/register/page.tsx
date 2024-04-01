"use client"
import './style.css'

import { useState } from 'react';
import { toast } from 'react-toastify';

import { apiUrl } from '@/constant/env';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      toast('Success Register')
    } catch (error: any) {
      toast(error?.message ?? 'Some error')
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
            <label className='label-text'>Name:</label>
            <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setName(e.target.value)}
              required
              className='inp-text'
            />
          </div>
          <br />
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
          <button className='btn' type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
