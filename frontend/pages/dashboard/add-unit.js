// FINAL FIXED FILE: frontend/pages/dashboard/add-unit.js

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function AddUnit() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(setCourses)
      .catch(() => alert('Failed to load courses'));
  }, []);

  const handleCourseChange = (id) => {
    setCourseId(id);
    const course = courses.find(c => c._id === id);
    setSections(course?.sections || []);
    setSectionId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const course = courses.find(c => c._id === courseId);
    const sectionIndex = course.sections.findIndex(s => s._id === sectionId);
    const token = Cookies.get('token');

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}/sections/${sectionIndex}/units`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Unit added successfully!');
        setTitle('');
      } else {
        alert(`❌ Error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('❌ Server/network error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Add Unit</h2>

      <form onSubmit={handleSubmit}>
        <label>Select Course:</label><br />
        <select value={courseId} onChange={(e) => handleCourseChange(e.target.value)} required>
          <option value="">-- Choose course --</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select><br /><br />

        <label>Select Section:</label><br />
        <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} required>
          <option value="">-- Choose section --</option>
          {sections.map(s => (
            <option key={s._id} value={s._id}>{s.title}</option>
          ))}
        </select><br /><br />

        <input
          placeholder="Unit Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Unit'}
        </button>
      </form>
    </div>
  );
}
