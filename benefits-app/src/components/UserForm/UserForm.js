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
  const [showBenefits, setShowBenefits] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      // First, attempt login with dummy credentials
      const loginPayload = {
        email: 'random@example.com',
        password: 'randomPassword123'
      };

      // Perform login
      await axios.post('/api/users/login', loginPayload);

      // After successful login, fetch quizzes
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      if (error.response) {
        // Handle specific error cases
        if (error.response.status === 401) {
          setErrorMessage('Authentication failed. Please try again later.');
        } else if (error.response.status === 500) {
          setErrorMessage('Server error. Please try again later.');
        }
      } else {
        setErrorMessage('Failed to load quizzes. Please try again later.');
      }
    }
  };

  // Also update useEffect to handle any cleanup
  useEffect(() => {
    fetchQuizzes();

    // Cleanup function
    return () => {
      // Clear any states if needed when component unmounts
      setQuizzes([]);
      setSelectedQuiz(null);
      setResponses({});
      setEligibilityResults(null);
    };
  }, []);

  const fetchQuestions = async (quizId) => {
    try {
      const response = await axios.get(`/api/quizzes/${quizId}`);
      const orderedQuestions = response.data.questionIds.map(id =>
        response.data.questions.find(q => q.id === id)
      );
      setQuestions(orderedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    fetchQuestions(quiz.id);
    setResponses({});
    setEligibilityResults(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponses(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (questionId, option, checked) => {
    setResponses(prev => {
      const currentValues = prev[questionId] ? prev[questionId].split(',') : [];
      let newValues;

      if (checked) {
        newValues = [...currentValues, option];
      } else {
        newValues = currentValues.filter(val => val !== option);
      }

      return {
        ...prev,
        [questionId]: newValues.join(',')
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(responses).length === 0) {
      setErrorMessage('Please answer at least one question to check eligibility.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post('/api/eligibility/check', responses);
      setEligibilityResults(response.data);
      setSuccessMessage('Eligibility check completed successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setErrorMessage('Failed to check eligibility.');
      setSuccessMessage('');
    }
  };

  const renderInputField = (question) => {
    switch (question.questionType) {
      case 'MULTI_CHOICE':
        const options = question.options.split(',');
        const selectedOptions = responses[question.id] ? responses[question.id].split(',') : [];

        return (
          <div className="checkbox-group">
            {options.map((option, index) => (
              <div key={index} className="checkbox-option">
                <input
                  type="checkbox"
                  id={`${question.id}-${index}`}
                  checked={selectedOptions.includes(option.trim())}
                  onChange={(e) => handleCheckboxChange(question.id, option.trim(), e.target.checked)}
                />
                <label htmlFor={`${question.id}-${index}`}>{option.trim()}</label>
              </div>
            ))}
          </div>
        );

      case 'NUMERICAL':
        return (
          <input
            type="number"
            id={question.id}
            name={question.id}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={handleInputChange}
          />
        );

      case 'DATE':
        return (
          <input
            type="date"
            id={question.id}
            name={question.id}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={handleInputChange}
          />
        );

      case 'EMAIL':
        return (
          <input
            type="email"
            id={question.id}
            name={question.id}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={handleInputChange}
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
          />
        );
    }
  };

  const handleBackToDashboard = () => {
    if (selectedQuiz) {
      setSelectedQuiz(null);
      setQuestions([]);
      setResponses({});
      setEligibilityResults(null);
      setSuccessMessage('');
      setErrorMessage('');
    } else {
      window.location.href = '/user-dashboard';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/user-login';
  };

  const renderEligibilityResults = () => {
    if (!eligibilityResults) return null;

    return (
      <div className="eligibility-results">
        <h3>Eligibility Results</h3>
        {eligibilityResults.length > 0 ? (
          <>
            <h4>You may be eligible for the following benefits:</h4>
            <div className="benefits-grid">
              {eligibilityResults.map((benefit) => (
                <div key={benefit.id} className="benefit-card">
                  <div className="benefit-image">
                    {benefit.imageUrl ? (
                      <img
                        src={benefit.imageUrl}
                        alt={benefit.benefitName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/api/placeholder/300/200';
                        }}
                      />
                    ) : (
                      <div className="image-placeholder" />
                    )}
                  </div>
                  <div className="benefit-content">
                    <h4>{benefit.benefitName}</h4>
                    <p className="benefit-type">{benefit.federal ? 'Federal Benefit' : `State Benefit - ${benefit.state}`}</p>
                    <div className="benefit-description">
                      {benefit.description}
                    </div>
                    <div className="benefit-actions">
                      <a
                        href={benefit.benefitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="benefit-link"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-benefits-message">
            <p>Based on your responses, we couldn't identify any benefits you're eligible for at this time.</p>
            <p>Consider answering more questions or try another quiz to discover additional benefits.</p>
          </div>
        )}
      </div>
    );
  };

  const renderAllBenefits = () => {
    if (!selectedQuiz || !selectedQuiz.benefits) return null;

    return (
      <>
        <hr className="divider" />
        <h4>All Available Benefits in this Quiz:</h4>
        <div className="button-group">
          <button
            onClick={() => setShowBenefits(!showBenefits)}
            className="btn btn-info"
          >
            {showBenefits ? 'Hide Benefits' : 'Show Benefits'}
          </button>
        </div>
        {showBenefits && (
          <div className="benefits-dropdown">
            <div className="benefits-grid">
              {selectedQuiz.benefits.map((benefit) => (
                <div key={benefit.id} className="benefit-card">
                  <div className="benefit-image">
                    {benefit.imageUrl ? (
                      <img
                        src={benefit.imageUrl}
                        alt={benefit.benefitName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/api/placeholder/300/200';
                        }}
                      />
                    ) : (
                      <div className="image-placeholder" />
                    )}
                  </div>
                  <div className="benefit-content">
                    <h4>{benefit.benefitName}</h4>
                    <p className="benefit-type">{benefit.federal ? 'Federal Benefit' : `State Benefit - ${benefit.state}`}</p>
                    <div className="benefit-description">
                      {benefit.description}
                    </div>
                    <div className="benefit-actions">
                      <a
                        href={benefit.benefitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="benefit-link"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="user-form">
      <div className="top-buttons">
        <button onClick={handleBackToDashboard} className="btn btn-secondary">
          {selectedQuiz ? 'Back to Quizzes' : 'Back to Dashboard'}
        </button>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      {selectedQuiz ? (
        <>
          <h2 className="main-title">{selectedQuiz.quizName}</h2>
          <p className="subtitle">Complete this simple quiz below to discover what resources may be available for you.</p>
          <div className="completion-notice">
            <p>The more questions you answer, the more accurate your results will be.</p>
          </div>

          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div className="form-group" key={question.id}>
                <label htmlFor={question.id}>{question.questionText}</label>
                {renderInputField(question)}
              </div>
            ))}
            <div className="button-group">
              <button type="submit" className="btn btn-primary">Check Eligibility</button>
            </div>
          </form>

          {renderEligibilityResults()}
          {renderAllBenefits()}
        </>
      ) : (
        <>
          <h2 className="main-title">Available Quizzes</h2>
          <p className="subtitle">Select one of these simple quizzes below to discover what resources may be available for you.</p>
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