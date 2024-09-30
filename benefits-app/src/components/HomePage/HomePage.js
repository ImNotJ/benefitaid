import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './HomePage.css'; // New CSS file for HomePage

function HomePage() {
  const [commonQuiz, setCommonQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCommonQuiz();
  }, []);

  const fetchCommonQuiz = async () => {
    try {
      const response = await axios.get('/api/quizzes');
      const commonQuiz = response.data.find(quiz => quiz.quizName === 'Common Quiz');
      if (commonQuiz) {
        setCommonQuiz(commonQuiz);
        fetchQuestions(commonQuiz.id);
      }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponses({
      ...responses,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = 'random@example.com'; // Random email
    const password = 'randomPassword123'; // Random password

    const payload = {
      email,
      password,
      responses
    };

    console.log('Submitting:', payload); // Log the payload

    try {
      const response = await axios.post('/api/eligibility/check', payload);
      setEligibilityResults(response.data);
      setSuccessMessage('Eligibility check completed successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error checking eligibility:', error);
      console.error('Error response data:', error.response.data); // Log the error response data
      setErrorMessage('Failed to check eligibility.');
      setSuccessMessage('');
    }
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
    <div className="home-page">
      <h1>Welcome to Fair Benefits!</h1>
      <div className="links">
        <Link to="/user-login" className="btn btn-primary">User Login</Link>
        <Link to="/create-account" className="btn btn-secondary">Create Account</Link>
        <Link to="/user-dashboard" className="btn btn-primary">User Dashboard</Link>
      </div>
      {commonQuiz && (
        <div className="common-quiz">
          <h2>{commonQuiz.quizName}</h2>
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div className="form-group" key={question.id}>
                <label htmlFor={question.id}>{question.questionText}</label>
                {renderInputField(question)}
              </div>
            ))}
            <div className="form-group button-group">
              <button type="submit" className="btn btn-primary">Check Eligibility</button>
            </div>
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
        </div>
      )}
    </div>
  );
}

export default HomePage;