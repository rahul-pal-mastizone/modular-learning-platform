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
      const res = await axios.post('https://modular-learning-platform.onrender.com/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      // ✅ Save token and role in cookies
      Cookies.set('token', token);
      Cookies.set('role', user.role);

      // ✅ Redirect based on role
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/learner');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert('❌ Login failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Login</h1>

      <input
        placeholder="Email"
        type="email"
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

      <button
        onClick={handleLogin}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Login
      </button>
    </div>
  );
}
