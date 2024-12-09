import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import QuestionInput from '../UserForm/QuestionInput';

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

function HomePage() {
  const [commonQuiz, setCommonQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showBenefits, setShowBenefits] = useState(false); // State to manage dropdown visibility

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

  const fetchQuestions = async (quizId) => {
    try {
      const response = await axios.get(`/api/quizzes/${quizId}`);
      const orderedQuestions = response.data.questionIds.map(id => response.data.questions.find(q => q.id === id));
      setQuestions(orderedQuestions);
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

  const handleError = (questionId, error) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [questionId]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasAtLeastOneResponse = Object.keys(responses).length > 0;

    if (!hasAtLeastOneResponse) {
      setErrorMessage('Please answer at least one question to check eligibility.');
      setSuccessMessage('');
      return;
    }

    const email = 'random@example.com';
    const password = 'randomPassword123';

    const payload = {
      email,
      password,
      responses
    };

    console.log('Submitting:', payload);

    try {
      const response = await axios.post('/api/eligibility/check', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response data:', response.data);

      const eligibleBenefits = commonQuiz.benefits.filter(benefit => {
        if (!benefit.requirements || benefit.requirements.length === 0) {
          return false;
        }

        let isEligible = true;
        let hasRequired = false;

        for (const requirement of benefit.requirements) {
          console.log('Checking requirement:', requirement);

          const meetsRequirement = requirement.conditions.every(condition => {
            const userResponse = responses[condition.questionId];
            console.log('Checking condition:', condition);
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

      console.log('Eligible benefits:', eligibleBenefits);

      setEligibilityResults(eligibleBenefits);
      setSuccessMessage('Eligibility check completed successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error checking eligibility:', error);
      console.error('Error response data:', error.response?.data);
      setErrorMessage('Failed to check eligibility.');
      setSuccessMessage('');
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
          {(successMessage || errorMessage) && (
            <div className={`alert ${successMessage ? 'alert-success' : 'alert-danger'}`}>
              {successMessage || errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div className="form-group" key={question.id}>
                <label htmlFor={`question-${question.id}`}>
                  {question.questionText}
                </label>

                <QuestionInput
                  question={question}
                  value={responses[question.id]}
                  onChange={handleInputChange}
                  onError={handleError}
                />

                {errors[question.id] && (
                  <div className="error-message">{errors[question.id]}</div>
                )}
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
                            e.target.src = '/placeholder-image.png';
                          }}
                        />
                      ) : (
                        <div className="image-placeholder" />
                      )}
                    </div>
                    <div className="benefit-content">
                      <h4>{benefit.benefitName}</h4>
                      <p>{benefit.federal ? 'Federal' : benefit.state}</p>
                      <div className="benefit-description">
                        {benefit.description}
                      </div>
                      <a href={benefit.benefitUrl} target="_blank" rel="noopener noreferrer" className="benefit-link">
                        Learn More
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