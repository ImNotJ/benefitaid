import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './ManageQuestions.css';

/**
 * ManageQuestions component for handling the management of questions.
 *
 * @returns {React.ReactNode} The rendered component.
 */
function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [questionName, setQuestionName] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  /**
   * Fetches the questions from the API.
   */
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      console.log('Fetch questions response:', response); // Debug log
      setQuestions(response.data);
    } catch (error) {
      console.error('Fetch questions error:', error); // Debug log
    }
  };

  /**
   * Handles the addition or update of a question.
   *
   * @param {Event} e - The form submit event.
   */
  const handleAddOrUpdateQuestion = async (e) => {
    e.preventDefault();

    // Custom validation
    if (!questionName || !questionType || !questionText) {
      setErrorMessage('All fields are required.');
      setSuccessMessage('');
      return;
    }

    const newQuestion = { questionName, questionType, questionText };
    try {
      let response;
      if (editingQuestionId) {
        response = await axios.put(`/api/questions/${editingQuestionId}`, newQuestion);
        console.log('Update question response:', response); // Debug log
        setSuccessMessage('Question updated successfully!');
      } else {
        response = await axios.post('/api/questions', newQuestion);
        console.log('Add question response:', response); // Debug log
        setSuccessMessage('Question added successfully!');
      }
      fetchQuestions();
      setQuestionName('');
      setQuestionType('');
      setQuestionText('');
      setEditingQuestionId(null);
      setErrorMessage('');
    } catch (error) {
      console.error('Add or update question error:', error); // Debug log
      setErrorMessage('Failed to add or update question.');
      setSuccessMessage('');
    }
  };

  /**
   * Handles the editing of a question.
   *
   * @param {Object} question - The question object to edit.
   */
  const handleEditQuestion = (question) => {
    setQuestionName(question.questionName);
    setQuestionType(question.questionType);
    setQuestionText(question.questionText);
    setEditingQuestionId(question.id);
    setSuccessMessage('');
    setErrorMessage('');
  };

  /**
   * Handles the deletion of a question.
   *
   * @param {string} id - The ID of the question to delete.
   */
  const handleDeleteQuestion = async (id) => {
    try {
      const response = await axios.delete(`/api/questions/${id}`);
      console.log('Delete question response:', response); // Debug log
      fetchQuestions();
      setSuccessMessage('Question deleted successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Delete question error:', error); // Debug log
      setErrorMessage('Failed to delete question.');
      setSuccessMessage('');
    }
  };

  /**
   * Handles navigation back to the admin dashboard.
   */
  const handleBackToDashboard = () => {
    navigate('/admin-dashboard');
  };

  /**
   * Handles the logout process.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin-login');
  };

  /**
   * Clears all input fields.
   */
  const handleClearFields = () => {
    setQuestionName('');
    setQuestionType('');
    setQuestionText('');
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
            <option value="Numerical">Numerical</option>
            <option value="Text">Text</option>
            <option value="YesNo">Yes/No</option>
            <option value="Date">Date (MM/DD/YYYY)</option>
            <option value="Email">Email (text@domain)</option>
            <option value="State">State</option>
            <option value="ExistingBenefits">Existing Benefits</option>
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
            <span>{question.id}: {question.questionName}</span>
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