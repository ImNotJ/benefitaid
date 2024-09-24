import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import './UserForm.css';

function UserForm() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchQuestions = async (quizId) => {
    try {
      const response = await axios.get(`/api/quizzes/${quizId}`);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    fetchQuestions(quiz.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponses({
      ...responses,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/eligibility/check', { responses });
      setEligibilityResults(response.data);
      setSuccessMessage('Eligibility check completed successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setErrorMessage('Failed to check eligibility.');
      setSuccessMessage('');
    }
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setQuestions([]);
    setResponses({});
    setEligibilityResults(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const renderInputField = (question) => {
    switch (question.questionType) {
      case 'numerical':
        return (
          <input
            type="number"
            id={question.id}
            name={question.id}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={handleInputChange}
            required
          />
        );
      case 'text':
        return (
          <input
            type="text"
            id={question.id}
            name={question.id}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={handleInputChange}
            required
          />
        );
      case 'yesno':
        return (
          <select
            id={question.id}
            name={question.id}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        );
      case 'date':
        return (
          <input
            type="date"
            id={question.id}
            name={question.id}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={handleInputChange}
            required
          />
        );
      case 'email':
        return (
          <input
            type="email"
            id={question.id}
            name={question.id}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={handleInputChange}
            required
          />
        );
      default:
        return (
          <input
            type="text"
            id={question.id}
            name={question.id}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={handleInputChange}
            required
          />
        );
    }
  };

  return (
    <div className="user-form">
      {selectedQuiz ? (
        <>
          <div className="top-buttons">
            <button onClick={handleBackToQuizzes} className="btn btn-secondary">
              Back to Quizzes
            </button>
            <button onClick={() => window.location.href = '/'} className="btn btn-secondary">
              Back to Homepage
            </button>
          </div>
          <h2>{selectedQuiz.quizName}</h2>
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div className="form-group" key={question.id}>
                <label htmlFor={question.id}>{question.questionText}</label>
                {renderInputField(question)}
              </div>
            ))}
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          {eligibilityResults && (
            <div className="eligibility-results">
              <h3>Eligibility Results</h3>
              <ul>
                {eligibilityResults.map((benefit) => (
                  <li key={benefit.id}>
                    {benefit.benefitName} - <a href={benefit.benefitUrl} target="_blank" rel="noopener noreferrer">Link</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="top-buttons">
            <button onClick={() => window.location.href = '/'} className="btn btn-secondary">
              Back to Homepage
            </button>
          </div>
          <h2>Available Quizzes</h2>
          <ul className="quiz-list">
            {quizzes.map((quiz) => (
              <li key={quiz.id}>
                <button onClick={() => handleQuizSelect(quiz)} className="btn btn-link">
                  {quiz.quizName}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default UserForm;