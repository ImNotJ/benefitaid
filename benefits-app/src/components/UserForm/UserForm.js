import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import './UserForm.css';

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

/**
 * UserForm component for handling the user form and eligibility check.
 *
 * @returns {React.ReactNode} The rendered component.
 */
function UserForm() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showBenefits, setShowBenefits] = useState(false); // State to manage dropdown visibility
  const [expandedBenefit, setExpandedBenefit] = useState(null);


  useEffect(() => {
    fetchQuizzes();
  }, []);

  /**
   * Fetches the quizzes from the API.
   */
  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  /**
   * Fetches the questions for a selected quiz from the API.
   *
   * @param {string} quizId - The ID of the selected quiz.
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
   * Handles the selection of a quiz.
   *
   * @param {Object} quiz - The selected quiz object.
   */
  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    fetchQuestions(quiz.id);
  };

  /**
   * Handles input changes for the form fields.
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
   * Handles the form submission for eligibility check.
   *
   * @param {Event} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(responses).length === 0) {
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

    console.log('Submitting payload:', payload); // Log the payload

    try {
      const response = await axios.post('/api/eligibility/check', payload);

      console.log('Response data:', response.data); // Log the response data

      const eligibleBenefits = selectedQuiz.benefits.filter(benefit => {
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
   * Handles navigation back to the dashboard or quizzes list.
   */
  const handleBackToDashboard = () => {
    if (selectedQuiz) {
      // If a quiz is selected, go back to the list of quizzes
      setSelectedQuiz(null);
      setQuestions([]);
      setResponses({});
      setEligibilityResults(null);
      setSuccessMessage('');
      setErrorMessage('');
    } else {
      // If no quiz is selected, go back to the dashboard
      window.location.href = '/user-dashboard'; // Redirect to user dashboard page
    }
  };

  /**
   * Handles the logout process.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/user-login'; // Redirect to user login page
  };

  /**
   * Renders the appropriate input field based on the question type.
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
            <div className="form-group button-group">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
          {eligibilityResults && (
            <div className="eligibility-results">
              <h3>Eligibility Results</h3>
              <h4>You are eligible for the following benefits:</h4>
              <div className="benefits-grid">
                {eligibilityResults.map((benefit) => (
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
          <h4>Benefits you could be eligible for based on this quiz:</h4>
          <h5>Select the button below to toggle.</h5>
          <div className="button-group">
            <button onClick={() => setShowBenefits(!showBenefits)} className="btn btn-info">
              {showBenefits ? 'Hide Benefits' : 'Show Benefits'}
            </button>
          </div>
          {showBenefits && (
            <div className="benefits-dropdown">
              <ul className="benefits-list">
                {selectedQuiz.benefits.map((benefit) => (
                  <li key={benefit.id}>
                    <a href={benefit.benefitUrl} target="_blank" rel="noopener noreferrer">
                      {benefit.benefitName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
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