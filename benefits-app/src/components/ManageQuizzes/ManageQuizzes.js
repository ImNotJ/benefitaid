import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageQuizzes.css';

function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [quizName, setQuizName] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedBenefit, setSelectedBenefit] = useState('');

  useEffect(() => {
    fetchQuizzes();
    fetchQuestions();
    fetchBenefits();
  }, []);

  const fetchQuizzes = async () => {
    const response = await axios.get('/api/quizzes');
    setQuizzes(response.data);
  };

  const fetchQuestions = async () => {
    const response = await axios.get('/api/questions');
    setQuestions(response.data);
  };

  const fetchBenefits = async () => {
    const response = await axios.get('/api/benefits');
    setBenefits(response.data);
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    const newQuiz = { quizName, questions: selectedQuestions, benefit: selectedBenefit };
    await axios.post('/api/quizzes', newQuiz);
    fetchQuizzes();
    setQuizName('');
    setSelectedQuestions([]);
    setSelectedBenefit('');
  };

  const handleDeleteQuiz = async (id) => {
    await axios.delete(`/api/quizzes/${id}`);
    fetchQuizzes();
  };

  const handleQuestionChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedQuestions(value);
  };

  return (
    <div className="manage-quizzes">
      <h2>Manage Quizzes</h2>
      <form onSubmit={handleAddQuiz}>
        <div className="form-group">
          <label htmlFor="quizName">Quiz Name</label>
          <input
            type="text"
            id="quizName"
            className="form-control"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="questions">Questions</label>
          <select
            id="questions"
            className="form-control"
            multiple
            value={selectedQuestions}
            onChange={handleQuestionChange}
            required
          >
            {questions.map((question) => (
              <option key={question.id} value={question.id}>
                {question.questionName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="benefit">Benefit</label>
          <select
            id="benefit"
            className="form-control"
            value={selectedBenefit}
            onChange={(e) => setSelectedBenefit(e.target.value)}
            required
          >
            <option value="">Select a Benefit</option>
            {benefits.map((benefit) => (
              <option key={benefit.id} value={benefit.id}>
                {benefit.benefitName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add Quiz</button>
      </form>
      <ul className="quiz-list">
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <span>{quiz.quizName}</span>
            <button onClick={() => handleDeleteQuiz(quiz.id)} className="btn btn-danger">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageQuizzes;