import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://modular-learning-backend.onrender.com/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;
      Cookies.set('token', token);
      Cookies.set('role', user.role);

      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/learner');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Login</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <button onClick={handleLogin}
      style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
      >Login</button>
    </div>
  );
}
