import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageQuestions.css';

function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [questionName, setQuestionName] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [options, setOptions] = useState(['']);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      console.log('Fetched questions:', response.data);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setErrorMessage('Failed to fetch questions');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleEditQuestion = (question) => {
    console.log('Editing question:', question);
    setQuestionName(question.questionName);
    setQuestionType(question.questionType);
    setQuestionText(question.questionText);
    
    if (['MultiChoiceSingle', 'MultiChoiceMulti'].includes(question.questionType)) {
      setOptions(question.options?.length ? question.options : ['']);
    } else {
      setOptions(['']);
    }
    
    setEditingQuestionId(question.id);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleAddOrUpdateQuestion = async (e) => {
    e.preventDefault();

    const questionData = {
      questionName,
      questionType,
      questionText,
      options: ['MultiChoiceSingle', 'MultiChoiceMulti'].includes(questionType)
        ? options.filter(opt => opt.trim() !== '')
        : []
    };

    console.log('Saving question data:', questionData);

    try {
      if (editingQuestionId) {
        await axios.put(`/api/questions/${editingQuestionId}`, questionData);
        setSuccessMessage('Question updated successfully!');
      } else {
        await axios.post('/api/questions', questionData);
        setSuccessMessage('Question added successfully!');
      }
      
      setQuestionName('');
      setQuestionType('');
      setQuestionText('');
      setOptions(['']);
      setEditingQuestionId(null);
      setErrorMessage('');
      await fetchQuestions();
    } catch (error) {
      console.error('Save error:', error);
      setErrorMessage('Failed to save question');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`/api/questions/${id}`);
      await fetchQuestions();
      setSuccessMessage('Question deleted successfully!');
    } catch (error) {
      setErrorMessage('Failed to delete question');
    }
  };

  return (
    <div className="container mt-4">
      <h2>{editingQuestionId ? 'Edit Question' : 'Add New Question'}</h2>
      
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleAddOrUpdateQuestion}>
        <div className="mb-3">
          <label className="form-label">Question Name</label>
          <input
            type="text"
            className="form-control"
            value={questionName}
            onChange={(e) => setQuestionName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Question Type</label>
          <select
            className="form-control"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="Text">Text</option>
            <option value="Numerical">Numerical</option>
            <option value="MultiChoiceSingle">Multiple Choice (Single)</option>
            <option value="MultiChoiceMulti">Multiple Choice (Multiple)</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Question Text</label>
          <input
            type="text"
            className="form-control"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>

        {['MultiChoiceSingle', 'MultiChoiceMulti'].includes(questionType) && (
          <div className="mb-3">
            <label className="form-label">Options</label>
            {options.map((option, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveOption(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddOption}
            >
              Add Option
            </button>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          {editingQuestionId ? 'Update' : 'Add'} Question
        </button>
      </form>

      <h2 className="mt-4">Questions List</h2>
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
              <td>{question.options?.join(', ')}</td>
              <td>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => handleEditQuestion(question)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
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