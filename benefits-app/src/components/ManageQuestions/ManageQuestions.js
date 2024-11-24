// benefits-app/src/components/ManageQuestions/ManageQuestions.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [options, setOptions] = useState(''); // New state for options
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  /**
   * Fetches all questions from the API.
   */
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
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

    // Include options only for MultiChoice questions
    const newQuestion = {
      questionName,
      questionType,
      questionText,
      options: questionType === 'MultiChoice' ? options : null,
    };

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

      // Reset form fields
      setQuestionName('');
      setQuestionType('');
      setQuestionText('');
      setOptions('');
      setEditingQuestionId(null);
      setErrorMessage('');

      // Refresh the question list
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      setErrorMessage('Failed to save question.');
      setSuccessMessage('');
    }
  };

  /**
   * Handles the edit action for a question.
   *
   * @param {Object} question - The question to edit.
   */
  const handleEditQuestion = (question) => {
    setQuestionName(question.questionName);
    setQuestionType(question.questionType);
    setQuestionText(question.questionText);
    setOptions(question.options || ''); // Populate options if available
    setEditingQuestionId(question.id);
  };

  /**
   * Handles the delete action for a question.
   *
   * @param {number} id - The ID of the question to delete.
   */
  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`/api/questions/${id}`);
      setSuccessMessage('Question deleted successfully!');
      setErrorMessage('');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      setErrorMessage('Failed to delete question.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="manage-questions">
      <h2>{editingQuestionId ? 'Edit Question' : 'Add Question'}</h2>
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
            <option value="Email">Email</option>
            <option value="Date">Date</option>
            <option value="State">State</option>
            <option value="MultiChoice">MultiChoice</option>
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
        {questionType === 'MultiChoice' && (
          <div className="form-group">
            <label htmlFor="options">Options (comma-separated)</label>
            <input
              type="text"
              id="options"
              className="form-control"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
            />
          </div>
        )}
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingQuestionId ? 'Update Question' : 'Add Question'}
          </button>
          {editingQuestionId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setQuestionName('');
                setQuestionType('');
                setQuestionText('');
                setOptions('');
                setEditingQuestionId(null);
                setErrorMessage('');
                setSuccessMessage('');
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Existing Questions</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Text</th>
            <th>Options</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>{question.questionName}</td>
              <td>{question.questionType}</td>
              <td>{question.questionText}</td>
              <td>{question.options || 'N/A'}</td>
              <td>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => handleEditQuestion(question)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageQuestions;