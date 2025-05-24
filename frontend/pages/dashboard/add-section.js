// FINAL FIXED FILE: frontend/pages/dashboard/add-section.js

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function AddSection() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('http://localhost:5000/api/courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        alert('Failed to load courses');
        console.error(err);
      }
    }
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get('token');

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Section added successfully!');
        setTitle('');
        setDescription('');
      } else {
        alert(`❌ Failed to add section: ${data.error || 'Unknown error'}`);
        console.error(data);
      }
    } catch (error) {
      alert('❌ Network or server error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Add Section to Course</h2>

      <form onSubmit={handleSubmit}>
        <label>Select Course:</label><br />
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
          <option value="">-- Choose course --</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>{course.title}</option>
          ))}
        </select><br /><br />

        <input
          placeholder="Section Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />

        <textarea
          placeholder="Section Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Section'}
        </button>
      </form>
    </div>
  );
}
