// FINAL FIXED FILE: frontend/pages/dashboard/add-chapter.js

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function AddChapter() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [sections, setSections] = useState([]);
  const [units, setUnits] = useState([]);
  const [sectionId, setSectionId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
    setUnitId('');
    setUnits([]);
  };

  const handleSectionChange = (id) => {
    setSectionId(id);
    const section = sections.find(s => s._id === id);
    setUnits(section?.units || []);
    setUnitId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const course = courses.find(c => c._id === courseId);
    const sectionIndex = course.sections.findIndex(s => s._id === sectionId);
    const unitIndex = course.sections[sectionIndex].units.findIndex(u => u._id === unitId);
    const token = Cookies.get('token');

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}/sections/${sectionIndex}/units/${unitIndex}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Chapter added successfully!');
        setTitle('');
        setContent('');
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
      <h2>Add Chapter</h2>

      <form onSubmit={handleSubmit}>
        <label>Select Course:</label><br />
        <select value={courseId} onChange={(e) => handleCourseChange(e.target.value)} required>
          <option value="">-- Choose course --</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select><br /><br />

        <label>Select Section:</label><br />
        <select value={sectionId} onChange={(e) => handleSectionChange(e.target.value)} required>
          <option value="">-- Choose section --</option>
          {sections.map(s => (
            <option key={s._id} value={s._id}>{s.title}</option>
          ))}
        </select><br /><br />

        <label>Select Unit:</label><br />
        <select value={unitId} onChange={(e) => setUnitId(e.target.value)} required>
          <option value="">-- Choose unit --</option>
          {units.map(u => (
            <option key={u._id} value={u._id}>{u.title}</option>
          ))}
        </select><br /><br />

        <input
          placeholder="Chapter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />

        <textarea
          placeholder="Chapter Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Chapter'}
        </button>
      </form>
    </div>
  );
}
