import React, { useState } from 'react';
import './CreateCoursePage.css';

const CreateCoursePage = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState(''); // <-- ADD NEW STATE FOR THE OUTLINE

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setOutline(''); // Clear previous outline
    console.log('Sending topic to backend:', topic);

    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      console.log('Response from backend:', data);
      setOutline(data.outline); // <-- SET THE OUTLINE STATE
    } catch (error) {
      console.error('Error sending topic to backend:', error);
      alert('Failed to start course generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-container">
      <h1>Create a New Course</h1>
      <p>Enter a topic you want to learn about, and our AI will generate a course for you.</p>
      
      <form onSubmit={handleSubmit} className="course-form">
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'The History of Ancient Rome'" 
          className="topic-input"
          disabled={loading}
        />
        <button type="submit" className="generate-button" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Course'}
        </button>
      </form>

      {/* --- ADD THIS SECTION TO DISPLAY THE OUTLINE --- */}
      {outline && (
        <div className="outline-container">
          <h2>Generated Course Outline</h2>
          <pre className="outline-content">{outline}</pre>
        </div>
      )}
      {/* --- END OF SECTION --- */}

    </div>
  );
};

export default CreateCoursePage;