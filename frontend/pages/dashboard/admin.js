// FIXED ADMIN DASHBOARD FILE WITH ERROR LOGS: frontend/pages/dashboard/admin.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(setCourses)
      .catch(console.error);
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');

    if (!token) {
      alert('❌ You are not logged in. Please login first.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Course created successfully!');
        setTitle('');
        setDescription('');
        setCourses([...courses, { ...data, createdBy: data.createdBy || { name: 'Admin' } }]);
      } else {
        console.error('❌ Server responded with error:', data);
        alert('❌ Error creating course: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('❌ CREATE COURSE ERROR:', err);
      alert('❌ Network/server error while creating course.');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Admin Dashboard</h2>

      <h3>Add New Course</h3>
      <form onSubmit={handleCreateCourse}>
        <input
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />

        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /><br />

        <button type="submit">Create Course</button>

        <br /><br />
      </form>

      <hr />
      <h3>Manage Content</h3>
      <button onClick={() => router.push('/dashboard/add-section')}>➕ Add Section</button><br /><br />
      <button onClick={() => router.push('/dashboard/add-unit')}>➕ Add Unit</button><br /><br />
      <button onClick={() => router.push('/dashboard/add-chapter')}>➕ Add Chapter</button><br /><br />
      <button onClick={() => router.push('/dashboard/add-question')}>📝 Add Question</button><br /><br />

      <hr />
      <h3>Existing Courses</h3>
      {courses.map(course => (
        <div key={course._id} style={{ border: '1px solid #ccc', padding: 10, margin: 10 }}>
          <strong>{course.title}</strong><br />
          <em>{course.description}</em><br />
          <small>Created by: {(typeof course.createdBy === 'object' && course.createdBy?.name) || 'Admin'}</small>
        </div>
      ))}
    </div>
  );
}
