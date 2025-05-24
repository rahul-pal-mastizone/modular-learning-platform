import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function CoursePage() {
  const router = useRouter();
  const { id } = router.query;

  const [course, setCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const token = Cookies.get('token');

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    const res = await fetch(`http://localhost:5000/api/courses/${id}/full`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setCourse(data);
  };

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    selectedChapter.questions.forEach((q, i) => {
      if (answers[i] && answers[i].toLowerCase() === q.correctAnswer.toLowerCase()) {
        correct++;
      }
    });

    const finalScore = correct;
    setScore(finalScore);

    alert(`You got ${correct} out of ${selectedChapter.questions.length} correct.`);

    // Save progress to backend
    const res = await fetch(`http://localhost:5000/api/courses/${id}/progress/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        chapterId: selectedChapter._id,
        score: finalScore
      })
    });

    const data = await res.json();
    if (!res.ok) {
      alert('Error saving progress: ' + data.error);
    } else {
      alert('Progress saved!');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Course Viewer</h2>

      {!course ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>{course.title}</h3>
          <p>{course.description}</p>

          {course.sections.map((section, sIndex) => (
            <div key={sIndex}>
              <h4>Section: {section.title}</h4>
              {section.units.map((unit, uIndex) => (
                <div key={uIndex} style={{ marginLeft: 20 }}>
                  <h5>Unit: {unit.title}</h5>
                  {unit.chapters.map((chapter, cIndex) => (
                    <div key={cIndex} style={{ marginLeft: 20, marginBottom: 10 }}>
                      <button onClick={() => setSelectedChapter(chapter)}>
                        View Chapter: {chapter.title}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {selectedChapter && (
            <div style={{ marginTop: 30, padding: 20, border: '1px solid #ccc' }}>
              <h3>Chapter: {selectedChapter.title}</h3>
              <p>{selectedChapter.content}</p>

              {selectedChapter.questions.length === 0 ? (
                <p>No questions for this chapter.</p>
              ) : (
                <>
                  <h4>Questions:</h4>
                  {selectedChapter.questions.map((q, i) => (
                    <div key={i} style={{ marginBottom: 20 }}>
                      <strong>Q{i + 1}: {q.questionText}</strong>
                      {q.type === 'mcq' ? (
                        <div>
                          {q.options.map((opt, j) => (
                            <div key={j}>
                              <label>
                                <input
                                  type="radio"
                                  name={`q${i}`}
                                  value={opt}
                                  onChange={() => handleAnswerChange(i, opt)}
                                />
                                {opt}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="Your answer"
                          onChange={(e) => handleAnswerChange(i, e.target.value)}
                        />
                      )}
                    </div>
                  ))}

                  <button onClick={handleSubmit}>Submit Answers</button>

                  {score !== null && (
                    <p style={{ color: 'green', marginTop: 20 }}>
                      Your score: {score}/{selectedChapter.questions.length}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
