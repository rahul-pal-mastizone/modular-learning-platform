// FINAL FIXED FILE: frontend/pages/dashboard/add-question.js

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function AddQuestion() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState('');
  const [units, setUnits] = useState([]);
  const [unitId, setUnitId] = useState('');
  const [chapters, setChapters] = useState([]);
  const [chapterId, setChapterId] = useState('');

  const [questionText, setQuestionText] = useState('');
  const [type, setType] = useState('mcq');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [media, setMedia] = useState('');
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
    setChapterId('');
    setUnits([]);
    setChapters([]);
  };

  const handleSectionChange = (id) => {
    setSectionId(id);
    const section = sections.find(s => s._id === id);
    setUnits(section?.units || []);
    setUnitId('');
    setChapters([]);
    setChapterId('');
  };

  const handleUnitChange = (id) => {
    setUnitId(id);
    const unit = units.find(u => u._id === id);
    setChapters(unit?.chapters || []);
    setChapterId('');
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const course = courses.find(c => c._id === courseId);
    const sectionIndex = course.sections.findIndex(s => s._id === sectionId);
    const unitIndex = course.sections[sectionIndex].units.findIndex(u => u._id === unitId);
    const chapterIndex = course.sections[sectionIndex].units[unitIndex].chapters.findIndex(ch => ch._id === chapterId);

    const payload = { type, questionText, options, correctAnswer, media };
    const token = Cookies.get('token');

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}/sections/${sectionIndex}/units/${unitIndex}/chapters/${chapterIndex}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Question added successfully!');
        setQuestionText('');
        setOptions(['', '', '', '']);
        setCorrectAnswer('');
        setMedia('');
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
      <h2>Add Question</h2>
      <form onSubmit={handleSubmit}>
        <select value={courseId} onChange={(e) => handleCourseChange(e.target.value)} required>
          <option value="">-- Choose course --</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select><br /><br />

        <select value={sectionId} onChange={(e) => handleSectionChange(e.target.value)} required>
          <option value="">-- Choose section --</option>
          {sections.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
        </select><br /><br />

        <select value={unitId} onChange={(e) => handleUnitChange(e.target.value)} required>
          <option value="">-- Choose unit --</option>
          {units.map(u => <option key={u._id} value={u._id}>{u.title}</option>)}
        </select><br /><br />

        <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} required>
          <option value="">-- Choose chapter --</option>
          {chapters.map(ch => <option key={ch._id} value={ch._id}>{ch.title}</option>)}
        </select><br /><br />

        <input placeholder="Question Text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} required /><br /><br />

        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="mcq">MCQ</option>
          <option value="fill">Fill in the blank</option>
          <option value="text">Text</option>
          <option value="audio">Audio</option>
        </select><br /><br />

        {type === 'mcq' && options.map((opt, i) => (
          <div key={i}>
            <input
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              required
            /><br />
          </div>
        ))}

        <input placeholder="Correct Answer" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} required /><br /><br />
        <input placeholder="Media URL (optional)" value={media} onChange={(e) => setMedia(e.target.value)} /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Question'}
        </button>
      </form>
    </div>
  );
}
