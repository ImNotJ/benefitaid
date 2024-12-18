import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './ManageQuestions.css';

function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [questionName, setQuestionName] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['']);
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
      console.log('Raw response:', response.data);

      const parsedQuestions = response.data.map(question => ({
        ...question,
        options: question.options || []
      }));

      console.log('Parsed questions:', parsedQuestions);
      setQuestions(parsedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setErrorMessage('Failed to fetch questions');
    }
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
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
        } else {
            await axios.post('/api/questions', questionData);
        }
        await fetchQuestions();
        handleClearFields();
    } catch (error) {
        console.error('Error saving question:', error);
        setErrorMessage('Failed to save question');
    }
};

  const handleEditQuestion = (question) => {
    console.log('Editing question:', question);
    setQuestionName(question.questionName);
    setQuestionType(question.questionType);
    setQuestionText(question.questionText);
    setOptions(question.options || ['']);
    setEditingQuestionId(question.id);
};

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`/api/questions/${id}`);
      fetchQuestions();
      setSuccessMessage('Question deleted successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Delete question error:', error);
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
    setOptions(['']);
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

      <form onSubmit={handleAddOrUpdateQuestion} className="question-form">
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
            onChange={(e) => {
              setQuestionType(e.target.value);
              if (!['MultiChoiceSingle', 'MultiChoiceMulti'].includes(e.target.value)) {
                setOptions(['']);
              }
            }}
          >
            <option value="">Select Type</option>
            <option value="Text">Text</option>
            <option value="Numerical">Numerical</option>
            <option value="Date">Date</option>
            <option value="Email">Email</option>
            <option value="Yes/No">Yes/No</option>
            <option value="State">State</option>
            <option value="MultiChoiceSingle">Multiple Choice (Single Select)</option>
            <option value="MultiChoiceMulti">Multiple Choice (Multi Select)</option>
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

        {['MultiChoiceSingle', 'MultiChoiceMulti'].includes(questionType) && (
          <div className="form-group">
            <label>Options</label>
            <div className="options-container">
              {options.map((option, index) => (
                <div key={index} className="option-row">
                  <input
                    type="text"
                    className="form-control"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder="Enter option"
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
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
          </div>
        )}{['MultiChoiceSingle', 'MultiChoiceMulti'].includes(questionType) && (
          <div className="form-group">
            <label>Options</label>
            <div className="options-container">
              {options.map((option, index) => (
                <div key={index} className="option-row">
                  <input
                    type="text"
                    className="form-control"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder="Enter option"
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
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

      <div className="questions-list">
        <h3>Existing Questions</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Question</th>
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
                  <td>
                    {['MultiChoiceSingle', 'MultiChoiceMulti'].includes(question.questionType)
                      ? (Array.isArray(question.options)
                        ? question.options.join(', ')
                        : question.options)
                      : ''}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageQuestions;