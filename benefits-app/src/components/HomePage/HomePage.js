import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './HomePage.css';

/**
 * HomePage component for displaying the home page and handling the common quiz.
 *
 * @returns {React.ReactNode} The rendered component.
 */
function HomePage() {
  const [commonQuiz, setCommonQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showBenefits, setShowBenefits] = useState(false); // State to manage dropdown visibility

  /**
   * Fetches the common quiz from the API.
   */
  const fetchCommonQuiz = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCommonQuiz();
  }, [fetchCommonQuiz]);

  /**
   * Fetches the questions for the specified quiz.
   *
   * @param {string} quizId - The ID of the quiz.
   */
  const fetchQuestions = async (quizId) => {
    try {
      const response = await axios.get(`/api/quizzes/${quizId}`);
      const orderedQuestions = response.data.questionIds.map(id => response.data.questions.find(q => q.id === id));
      setQuestions(orderedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  /**
   * Handles input changes in the quiz form.
   *
   * @param {Event} e - The input change event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponses({
      ...responses,
      [name]: value,
    });
  };

  /**
   * Handles the form submission for checking eligibility.
   *
   * @param {Event} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = 'random@example.com'; // email
    const password = 'randomPassword123'; // Random password
  
    const payload = {
      email,
      password,
      responses
    };
  
    console.log('Submitting:', payload); // Log the payload
  
    try {
      const response = await axios.post('/api/eligibility/check', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Response data:', response.data); // Log the response data
  
      const eligibleBenefits = response.data.filter(benefit => {
        if (!benefit.requirements || benefit.requirements.length === 0) {
          return false;
        }
        return benefit.requirements.some(requirement => {
          console.log('Checking requirement:', requirement); // Log the requirement
          return requirement.conditions.every(condition => {
            const userResponse = responses[condition.questionId];
            console.log('Checking condition:', condition); // Log the condition
            console.log('User response:', userResponse); // Log the user response
            if (userResponse === undefined) {
              return false;
            }
            switch (condition.operator) {
              case '<=':
                return parseFloat(userResponse) <= parseFloat(condition.value);
              case '>=':
                return parseFloat(userResponse) >= parseFloat(condition.value);
              case '<':
                return parseFloat(userResponse) < parseFloat(condition.value);
              case '>':
                return parseFloat(userResponse) > parseFloat(condition.value);
              case '==':
                return userResponse === condition.value;
              default:
                return false;
            }
          });
        });
      });
  
      console.log('Eligible benefits:', eligibleBenefits); // Log the eligible benefits
  
      setEligibilityResults(eligibleBenefits);
      setSuccessMessage('Eligibility check completed successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error checking eligibility:', error);
      console.error('Error response data:', error.response?.data); // Log the error response data
      setErrorMessage('Failed to check eligibility.');
      setSuccessMessage('');
    }
  };

  /**
   * Renders the input field for a given question.
   *
   * @param {Object} question - The question object.
   * @returns {React.ReactNode} The rendered input field.
   */
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
          <h4>Answer this simple quiz below to discover what state and federal benefits you may be eligible for!</h4>
          <h5>Note: We don't require any personal or identifying information.</h5>
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
              <h4>You are eligibile for the following benefits:</h4>
              <h5>Select the respective link for more information about the benefits you're eligible for.</h5>
              <ul>
                {eligibilityResults.map((benefit) => (
                  <li key={benefit.id}>
                    <a href={benefit.benefitUrl} target="_blank" rel="noopener noreferrer">
                      {benefit.benefitName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <hr className="divider" />
          <h4>Full list of benefits you could be eligible for:</h4>
          <h5>Select the button below to toggle.</h5>
          <div className="button-group">
            <button onClick={() => setShowBenefits(!showBenefits)} className="btn btn-info">
              {showBenefits ? 'Hide Benefits' : 'Show Benefits'}
            </button>
          </div>
          {showBenefits && (
            <div className="benefits-dropdown">
              <ul>
                {commonQuiz.benefits.map((benefit) => (
                  <li key={benefit.id}>
                    <a href={benefit.benefitUrl} target="_blank" rel="noopener noreferrer">
                      {benefit.benefitName}
                    </a>
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