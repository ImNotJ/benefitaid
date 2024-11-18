import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './HomePage.css';

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

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
  const [expandedBenefit, setExpandedBenefit] = useState(null);


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

    // Check if at least one question is answered
    const hasAtLeastOneResponse = Object.keys(responses).length > 0;

    if (!hasAtLeastOneResponse) {
      setErrorMessage('Please answer at least one question to check eligibility.');
      setSuccessMessage('');
      return;
    }

    const email = 'random@example.com'; // Dummy email
    const password = 'randomPassword123'; // Dummy password

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

      const eligibleBenefits = commonQuiz.benefits.filter(benefit => {
        if (!benefit.requirements || benefit.requirements.length === 0) {
          return false;
        }

        let isEligible = true;
        let hasRequired = false;

        for (const requirement of benefit.requirements) {
          console.log('Checking requirement:', requirement); // Log the requirement

          const meetsRequirement = requirement.conditions.every(condition => {
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

          if (requirement.type === 'DISQUALIFIER' && meetsRequirement) {
            isEligible = false;
            break;
          }

          if (requirement.type === 'REQUIREMENT' && !meetsRequirement) {
            isEligible = false;
            break;
          }

          if (requirement.type === 'REQUIREMENT' && meetsRequirement) {
            hasRequired = true;
          }
        }

        return isEligible && (!benefit.requirements.some(req => req.type === 'REQUIREMENT') || hasRequired);
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
      case 'Numerical':
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
      case 'Text':
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
      case 'YesNo':
        return (
          <select
            id={question.id}
            name={question.id}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={handleInputChange}

          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        );
      case 'Date':
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
      case 'Email':
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
      case 'State':
        return (
          <select
            id={question.id}
            name={question.id}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={handleInputChange}

          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
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

  return (
    <div className="home-page">
      <h1 className="main-title">Welcome to Fair Benefits!</h1>
      <h2 className="subtitle">Complete this simple quiz below to discover what resources may be available for you.</h2>

      <div className="links">
        <Link to="/user-login" className="btn btn-primary">User Login</Link>
        <Link to="/create-account" className="btn btn-secondary">Create Account</Link>
        <Link to="/user-dashboard" className="btn btn-primary">User Dashboard</Link>
        <Link to="/user-form" className="btn btn-primary">Other Quizzes</Link>
      </div>

      {commonQuiz && (
        <div className="common-quiz">
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
            <div className="form-group button-group">
              <button type="submit" className="btn btn-primary">Check Eligibility</button>
            </div>
          </form>
          {eligibilityResults && (
            <div className="eligibility-results">
              <h3>Eligibility Results</h3>
              <h4>You are eligible for the following benefits:</h4>
              <div className="benefits-grid">
                {benefits.map((benefit) => (
                  <div key={benefit.id} className="benefit-card">
                    <div className="benefit-image">
                      {/* Will fall back to default image if none exists */}
                      <img
                        src={`/api/benefits/${benefit.id}/image`}
                        alt={benefit.benefitName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/static/default-benefit-image.jpg';
                        }}
                      />
                    </div>
                    <div className="benefit-content">
                      <h5>{benefit.benefitName}</h5>
                      <div className={`benefit-description ${expandedBenefit === benefit.id ? 'expanded' : ''
                        }`}>
                        <div dangerouslySetInnerHTML={{
                          __html: benefit.description || 'No description available.'
                        }} />
                      </div>
                      {benefit.description && benefit.description.length > 200 && (
                        <button
                          className="btn btn-link"
                          onClick={() => setExpandedBenefit(
                            expandedBenefit === benefit.id ? null : benefit.id
                          )}
                        >
                          {expandedBenefit === benefit.id ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                      <a
                        href={benefit.benefitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="benefit-link"
                      >
                        {benefit.displayLinkText || 'Learn More'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
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