import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function LearnerDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const token = Cookies.get('token');
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
    fetchEnrolled();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch('http://localhost:5000/api/courses');
    const data = await res.json();
    setCourses(data);
  };

  const fetchEnrolled = async () => {
    const res = await fetch('http://localhost:5000/api/courses/enrolled/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    const enrolledIds = data.map(item => item.course._id);
    setEnrolled(enrolledIds);

    const map = {};
    data.forEach(item => {
      map[item.course._id] = {
        completed: item.completedChapters?.length || 0,
        score: item.score || 0
      };
    });
    setProgressMap(map);
  };

  const handleEnroll = async (courseId) => {
    const res = await fetch(`http://localhost:5000/api/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      alert('Enrolled successfully!');
      fetchEnrolled(); // Refresh
    } else {
      alert('Error: ' + data.error);
    }
  };

  const handleContinue = (courseId) => {
    router.push(`/learner/course/${courseId}`);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Learner Dashboard</h2>
      <h3>Your Courses:</h3>
      {courses.map(course => (
        <div key={course._id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
          <h4>{course.title}</h4>
          <p>{course.description}</p>

          {enrolled.includes(course._id) ? (
            <>
              <p style={{ color: 'green' }}>✅ Enrolled</p>
              <p>Completed Chapters: {progressMap[course._id]?.completed || 0}</p>
              <p>Score: {progressMap[course._id]?.score || 0}</p>
              <button onClick={() => handleContinue(course._id)}>Continue Learning</button>
            </>
          ) : (
            <button onClick={() => handleEnroll(course._id)}>Enroll</button>
          )}
        </div>
      ))}
    </div>
  );
}
