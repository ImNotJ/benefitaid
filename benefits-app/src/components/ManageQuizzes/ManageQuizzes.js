import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './ManageQuizzes.css';

function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [quizName, setQuizName] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [editingQuizIndex, setEditingQuizIndex] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
    fetchQuestions();
    fetchBenefits();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchBenefits = async () => {
    try {
      const response = await axios.get('/api/benefits');
      setBenefits(response.data);
    } catch (error) {
      console.error('Error fetching benefits:', error);
    }
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
  
    if (!quizName || selectedQuestions.length === 0 || selectedBenefits.length === 0) {
      setErrorMessage('Quiz Name, Questions, and Benefits are required.');
      setSuccessMessage('');
      return;
    }
  
    const newQuiz = { quizName, questionIds: selectedQuestions, benefitIds: selectedBenefits };
    try {
      if (editingQuizIndex !== null) {
        const quizId = quizzes[editingQuizIndex].id;
        await axios.put(`/api/quizzes/${quizId}`, newQuiz);
        setEditingQuizIndex(null);
      } else {
        await axios.post('/api/quizzes', newQuiz);
      }
      fetchQuizzes();
      handleClearFields();
      setSuccessMessage('Quiz saved successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error saving quiz:', error);
      setErrorMessage('Failed to save quiz.');
      setSuccessMessage('');
    }
  };

  const handleDeleteQuiz = async (id) => {
    try {
      await axios.delete(`/api/quizzes/${id}`);
      fetchQuizzes();
      setSuccessMessage('Quiz deleted successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      setErrorMessage('Failed to delete quiz.');
      setSuccessMessage('');
    }
  };

  const handleEditQuiz = (index) => {
    const quiz = quizzes[index];
    setQuizName(quiz.quizName);
    setSelectedQuestions(quiz.questionIds);
    setSelectedBenefits(quiz.benefitIds);
    setEditingQuizIndex(index);
  };

  const handleClearFields = () => {
    setQuizName('');
    setSelectedQuestions([]);
    setSelectedBenefits([]);
    setEditingQuizIndex(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleBackToDashboard = () => {
    navigate('/admin-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin-login');
  };

  const handleMoveQuestion = (id, from, to) => {
    if (from === 'available') {
      setSelectedQuestions((prevSelectedQuestions) => [...prevSelectedQuestions, id]);
    } else {
      setSelectedQuestions((prevSelectedQuestions) => prevSelectedQuestions.filter((qId) => qId !== id));
    }
  };

  const handleMoveBenefit = (id, from, to) => {
    if (from === 'available') {
      setSelectedBenefits((prevSelectedBenefits) => [...prevSelectedBenefits, id]);
    } else {
      setSelectedBenefits((prevSelectedBenefits) => prevSelectedBenefits.filter((bId) => bId !== id));
    }
  };

  const handleReorderQuestion = (id, direction) => {
    setSelectedQuestions((prevSelectedQuestions) => {
      const index = prevSelectedQuestions.indexOf(id);
      if (index === -1) return prevSelectedQuestions;

      const newSelectedQuestions = [...prevSelectedQuestions];
      const [removed] = newSelectedQuestions.splice(index, 1);

      if (direction === 'up' && index > 0) {
        newSelectedQuestions.splice(index - 1, 0, removed);
      } else if (direction === 'down' && index < newSelectedQuestions.length - 1) {
        newSelectedQuestions.splice(index + 1, 0, removed);
      }

      return newSelectedQuestions;
    });
  };

  return (
    <div className="manage-quizzes">
      <div className="top-buttons">
        <button onClick={handleBackToDashboard} className="btn btn-secondary">
          Back to Dashboard
        </button>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>
      <h2>Manage Quizzes</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
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
          <label>Questions</label>
          <div className="dual-list-box">
            <div className="list-box">
              <h3>Available Questions</h3>
              <ul>
                {questions.filter(q => !selectedQuestions.includes(q.id)).map((question) => (
                  <li key={question.id}>
                    {question.questionName}
                    <button type="button" onClick={() => handleMoveQuestion(question.id, 'available', 'selected')}>+</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="list-box">
              <h3>Selected Questions</h3>
              <ul>
                {selectedQuestions.map((id, index) => (
                  <li key={id}>
                    {questions.find((q) => q.id === id)?.questionName}
                    <div className="question-buttons">
                      <button type="button" onClick={() => handleMoveQuestion(id, 'selected', 'available')}>-</button>
                      {index > 0 && <button type="button" onClick={() => handleReorderQuestion(id, 'up')}>↑</button>}
                      {index < selectedQuestions.length - 1 && <button type="button" onClick={() => handleReorderQuestion(id, 'down')}>↓</button>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Benefits</label>
          <div className="dual-list-box">
            <div className="list-box">
              <h3>Available Benefits</h3>
              <ul>
                {benefits.filter(b => !selectedBenefits.includes(b.id)).map((benefit) => (
                  <li key={benefit.id}>
                    {benefit.benefitName}
                    <button type="button" onClick={() => handleMoveBenefit(benefit.id, 'available', 'selected')}>+</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="list-box">
              <h3>Selected Benefits</h3>
              <ul>
                {selectedBenefits.map((id) => (
                  <li key={id}>
                    {benefits.find((b) => b.id === id)?.benefitName}
                    <button type="button" onClick={() => handleMoveBenefit(id, 'selected', 'available')}>-</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">{editingQuizIndex !== null ? 'Update Quiz' : 'Add Quiz'}</button>
          <button type="button" onClick={handleClearFields} className="btn btn-secondary">Clear</button>
        </div>
      </form>
      <ul className="quiz-list">
        {quizzes.map((quiz, index) => (
          <li key={quiz.id}>
            <span>{quiz.quizName}</span>
            <div className="form-buttons">
              <button onClick={() => handleEditQuiz(index)} className="btn btn-secondary">Edit</button>
              <button onClick={() => handleDeleteQuiz(quiz.id)} className="btn btn-danger">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageQuizzes;