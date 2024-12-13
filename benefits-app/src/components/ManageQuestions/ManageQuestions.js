import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './ManageQuestions.css';

function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [questionName, setQuestionName] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(''); // New state for multi-choice options
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAddOrUpdateQuestion = async (e) => {
    e.preventDefault();

    if (!questionName || !questionType || !questionText) {
      setErrorMessage('All fields are required.');
      setSuccessMessage('');
      return;
    }

    // Validate that options are provided for multi-choice questions
    if (questionType === 'MULTI_CHOICE' && !options) {
      setErrorMessage('Options are required for multi-choice questions.');
      setSuccessMessage('');
      return;
    }

    const newQuestion = {
      questionName,
      questionType,
      questionText,
      options: questionType === 'MULTI_CHOICE' ? options : null
    };

    try {
      if (editingQuestionId) {
        await axios.put(`/api/questions/${editingQuestionId}`, newQuestion);
        setSuccessMessage('Question updated successfully!');
      } else {
        await axios.post('/api/questions', newQuestion);
        setSuccessMessage('Question added successfully!');
      }
      fetchQuestions();
      handleClearFields();
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to add or update question.');
      setSuccessMessage('');
    }
  };

  const handleEditQuestion = (question) => {
    setQuestionName(question.questionName);
    setQuestionType(question.questionType);
    setQuestionText(question.questionText);
    setOptions(question.options || '');
    setEditingQuestionId(question.id);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`/api/questions/${id}`);
      fetchQuestions();
      setSuccessMessage('Question deleted successfully!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to delete question.');
      setSuccessMessage('');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin-login');
  };

  const handleClearFields = () => {
    setQuestionName('');
    setQuestionType('');
    setQuestionText('');
    setOptions('');
    setEditingQuestionId(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="manage-questions">
      <div className="top-buttons">
        <button onClick={handleBackToDashboard} className="btn btn-secondary">
          Back to Dashboard
        </button>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>
      <h2>Manage Questions</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleAddOrUpdateQuestion}>
        <div className="form-group">
          <label htmlFor="questionName">Question Name</label>
          <input
            type="text"
            id="questionName"
            className="form-control"
            value={questionName}
            onChange={(e) => setQuestionName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="questionType">Question Type</label>
          <select
            id="questionType"
            className="form-control"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="TEXT">Text</option>
            <option value="NUMERICAL">Numerical</option>
            <option value="DATE">Date (MM/DD/YYYY)</option>
            <option value="EMAIL">Email</option>
            <option value="MULTI_CHOICE">Multiple Choice</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="questionText">Question Text</label>
          <input
            type="text"
            id="questionText"
            className="form-control"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>
        {questionType === 'MULTI_CHOICE' && (
          <div className="form-group">
            <label htmlFor="options">Options (comma-separated)</label>
            <input
              type="text"
              id="options"
              className="form-control"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              placeholder="Option1,Option2,Option3"
            />
            <small className="form-text text-muted">
              Enter options separated by commas. Example: Yes,No,Maybe
            </small>
          </div>
        )}
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingQuestionId ? 'Update Question' : 'Add Question'}
          </button>
          <button type="button" onClick={handleClearFields} className="btn btn-secondary">
            Clear
          </button>
        </div>
      </form>
      <ul className="question-list">
        {questions.map((question) => (
          <li key={question.id}>
            <div className="question-info">
              <span>{question.id}: {question.questionName}</span>
              {question.questionType === 'MULTI_CHOICE' && (
                <small className="options-display">
                  Options: {question.options}
                </small>
              )}
            </div>
            <div className="question-buttons">
              <button onClick={() => handleEditQuestion(question)} className="btn btn-secondary">Edit</button>
              <button onClick={() => handleDeleteQuestion(question.id)} className="btn btn-danger">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageQuestions;