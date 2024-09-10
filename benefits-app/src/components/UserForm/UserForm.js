import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserForm.css';

function UserForm() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [email, setEmail] = useState('');
  const [eligibilityResults, setEligibilityResults] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const response = await axios.get('/api/questions');
    setQuestions(response.data);
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
    const user = { email, responses };
    const response = await axios.post('/api/eligibility/check', user);
    setEligibilityResults(response.data);
  };

  return (
    <div className="user-form">
      <h2>User Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {questions.map((question) => (
          <div className="form-group" key={question.id}>
            <label htmlFor={question.id}>{question.questionText}</label>
            <input
              type={question.questionType === 'numerical' ? 'number' : 'text'}
              id={question.id}
              name={question.id}
              className="form-control"
              value={responses[question.id] || ''}
              onChange={handleInputChange}
              required
            />
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
    </div>
  );
}

export default UserForm;