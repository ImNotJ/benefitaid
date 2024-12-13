import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import QuestionInput from './QuestionInput';
import { isValidEmail, formatDate } from '../../utils/validation';
import { useNavigate } from 'react-router-dom';
import './UserForm.css';

function UserForm() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showBenefits, setShowBenefits] = useState(false);



  const handleBackToDashboard = () => {
    if (selectedQuiz) {
      setSelectedQuiz(null);
      setQuestions([]);
      setResponses({});
      setErrors({});
      setEligibilityResults(null);
      setSuccessMessage('');
      setErrorMessage('');
    } else {
      navigate('/user-dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/user-login');
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setErrorMessage('Failed to load quizzes. Please try again.');
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleError = (questionId, error) => {
    setErrors(prev => ({
      ...prev,
      [questionId]: error
    }));
  };

  const validateResponses = () => {
    const newErrors = {};
    let isValid = true;

    questions.forEach(question => {
      const response = responses[question.id];

      // Only proceed with validation if there's a response
      if (response && response.trim() !== '') {
        switch (question.questionType) {
          case 'Email':
            if (!isValidEmail(response)) {
              newErrors[question.id] = 'Please enter a valid email address';
              isValid = false;
            }
            break;
          case 'Date':
            if (!formatDate(response)) {
              newErrors[question.id] = 'Please enter a valid date in MM/DD/YYYY format';
              isValid = false;
            }
            break;
          case 'Numerical':
            if (isNaN(Number(response))) {
              newErrors[question.id] = 'Please enter a valid number';
              isValid = false;
            }
            break;
          // For multiple choice questions, no additional validation needed
          // as the input is controlled by radio buttons or checkboxes
          case 'MultiChoiceSingle':
          case 'MultiChoiceMulti':
          default:
            break;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateResponses()) {
      setErrorMessage('Please correct the errors before submitting');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('/api/eligibility/check', {
        responses,
        quizId: selectedQuiz.id
      });

      const eligibleBenefits = response.data;
      setEligibilityResults(eligibleBenefits);
      setSuccessMessage('Eligibility check completed successfully!');

      // Scroll to results
      document.getElementById('eligibility-results')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setErrorMessage('Failed to check eligibility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = async (quiz) => {
    setSelectedQuiz(quiz);
    try {
      const response = await axios.get(`/api/quizzes/${quiz.id}`);
      const orderedQuestions = response.data.questionIds
        .map(id => response.data.questions.find(q => q.id === id))
        .filter(Boolean);
      setQuestions(orderedQuestions);
      setResponses({});
      setErrors({});
      setEligibilityResults(null);
      setSuccessMessage('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      setErrorMessage('Failed to load quiz questions. Please try again.');
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
          <h2 className="main-title">{selectedQuiz.quizName}</h2>
          <div className="completion-notice">
            <p>Please answer all questions accurately to get the most relevant results.</p>
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
                  {/* Only show required indicator if the question is explicitly marked as required */}
                  {question.required === true && <span className="required">*</span>}
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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Checking Eligibility...' : 'Check Eligibility'}
              </button>
            </div>
          </form>

          {eligibilityResults && (
            <div id="eligibility-results" className="eligibility-results">
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