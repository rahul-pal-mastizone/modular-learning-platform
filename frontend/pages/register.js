import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('learner');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role,
      });

      if (res.status === 201 || res.status === 200) {
        alert('✅ Registration successful!');
        router.push('/login');
      } else {
        alert('❌ Registration failed. Try again.');
      }

    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      alert('❌ Registration failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Register</h1>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
      >
        <option value="learner">Learner</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={handleRegister}
        style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Register
      </button>
    </div>
  );
}
