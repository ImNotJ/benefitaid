import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageQuestions.css';

function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [questionName, setQuestionName] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionText, setQuestionText] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const response = await axios.get('/api/questions');
    setQuestions(response.data);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const newQuestion = { questionName, questionType, questionText };
    await axios.post('/api/questions', newQuestion);
    fetchQuestions();
    setQuestionName('');
    setQuestionType('');
    setQuestionText('');
  };

  const handleDeleteQuestion = async (id) => {
    await axios.delete(`/api/questions/${id}`);
    fetchQuestions();
  };

  return (
    <div className="manage-questions">
      <h2>Manage Questions</h2>
      <form onSubmit={handleAddQuestion}>
        <div className="form-group">
          <label htmlFor="questionName">Question Name</label>
          <input
            type="text"
            id="questionName"
            className="form-control"
            value={questionName}
            onChange={(e) => setQuestionName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="questionType">Question Type</label>
          <input
            type="text"
            id="questionType"
            className="form-control"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="questionText">Question Text</label>
          <input
            type="text"
            id="questionText"
            className="form-control"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Question</button>
      </form>
      <ul className="question-list">
        {questions.map((question) => (
          <li key={question.id}>
            <span>{question.questionName} - {question.questionType} - {question.questionText}</span>
            <button onClick={() => handleDeleteQuestion(question.id)} className="btn btn-danger">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageQuestions;