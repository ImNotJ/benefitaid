import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './ManageBenefits.css';

function ManageBenefits() {
  const [benefits, setBenefits] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [benefitName, setBenefitName] = useState('');
  const [federal, setFederal] = useState(false);
  const [state, setState] = useState('');
  const [benefitUrl, setBenefitUrl] = useState('');
  const [requirements, setRequirements] = useState([]);
  const [requirementName, setRequirementName] = useState('');
  const [currentConditions, setCurrentConditions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState('');
  const [currentOperator, setCurrentOperator] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [editingBenefitIndex, setEditingBenefitIndex] = useState(null);
  const [editingRequirementIndex, setEditingRequirementIndex] = useState(null);
  const [editingConditionIndex, setEditingConditionIndex] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBenefits();
    fetchQuestions();
  }, []);

  const fetchBenefits = async () => {
    try {
      const response = await axios.get('/api/benefits');
      setBenefits(response.data);
    } catch (error) {
      console.error('Error fetching benefits:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  
  const handleAddBenefit = async (e) => {
    e.preventDefault();

    // Custom validation
    if (!benefitName || (!federal && !state) || !benefitUrl) {
      setErrorMessage('Benefit Name, Federal/State, and Benefit URL are required.');
      setSuccessMessage('');
      return;
    }

    const newBenefit = { benefitName, federal, state: federal ? null : state, benefitUrl, requirements };
    try {
      if (editingBenefitIndex !== null) {
        const benefitId = benefits[editingBenefitIndex].id;
        await axios.put(`/api/benefits/${benefitId}`, newBenefit);
        setEditingBenefitIndex(null);
      } else {
        await axios.post('/api/benefits', newBenefit);
      }
      fetchBenefits();
      handleClearFields();
      setSuccessMessage('Benefit saved successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error saving benefit:', error);
      setErrorMessage('Failed to save benefit.');
      setSuccessMessage('');
    }
  };

  const handleDeleteBenefit = async (id) => {
    try {
      await axios.delete(`/api/benefits/${id}`);
      fetchBenefits();
      setSuccessMessage('Benefit deleted successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting benefit:', error);
      setErrorMessage('Failed to delete benefit.');
      setSuccessMessage('');
    }
  };

  const handleEditBenefit = (index) => {
    const benefit = benefits[index];
    setBenefitName(benefit.benefitName);
    setFederal(benefit.federal);
    setState(benefit.state || '');
    setBenefitUrl(benefit.benefitUrl);
    setRequirements(benefit.requirements);
    setEditingBenefitIndex(index);
  };

  const handleAddCondition = () => {
    if (!currentQuestionId || !currentOperator || !currentValue) {
      setErrorMessage('All fields are required for the condition.');
      setSuccessMessage('');
      return;
    }

    const newCondition = {
      questionId: currentQuestionId,
      operator: currentOperator,
      value: currentValue,
    };

    if (editingConditionIndex !== null) {
      const updatedConditions = [...currentConditions];
      updatedConditions[editingConditionIndex] = newCondition;
      setCurrentConditions(updatedConditions);
      setEditingConditionIndex(null);
    } else {
      setCurrentConditions([...currentConditions, newCondition]);
    }

    setCurrentQuestionId('');
    setCurrentOperator('');
    setCurrentValue('');
    setErrorMessage('');
  };

  const handleEditCondition = (index) => {
    const condition = currentConditions[index];
    setCurrentQuestionId(condition.questionId);
    setCurrentOperator(condition.operator);
    setCurrentValue(condition.value);
    setEditingConditionIndex(index);
  };

  const handleDeleteCondition = (index) => {
    const updatedConditions = currentConditions.filter((_, i) => i !== index);
    setCurrentConditions(updatedConditions);
  };

  const handleAddRequirement = () => {
    if (!requirementName || currentConditions.length === 0) {
      setErrorMessage('Requirement name and at least one condition are required.');
      setSuccessMessage('');
      return;
    }

    const newRequirement = {
      name: requirementName,
      conditions: currentConditions,
    };

    if (editingRequirementIndex !== null) {
      const updatedRequirements = [...requirements];
      updatedRequirements[editingRequirementIndex] = newRequirement;
      setRequirements(updatedRequirements);
      setEditingRequirementIndex(null);
    } else {
      setRequirements([...requirements, newRequirement]);
    }

    setRequirementName('');
    setCurrentConditions([]);
    setErrorMessage('');
  };

  const handleEditRequirement = (index) => {
    const requirement = requirements[index];
    setRequirementName(requirement.name);
    setCurrentConditions(requirement.conditions);
    setEditingRequirementIndex(index);
  };

  const handleDeleteRequirement = (index) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(updatedRequirements);
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
    setBenefitName('');
    setFederal(false);
    setState('');
    setBenefitUrl('');
    setRequirements([]);
    setRequirementName('');
    setCurrentConditions([]);
    setCurrentQuestionId('');
    setCurrentOperator('');
    setCurrentValue('');
    setEditingBenefitIndex(null);
    setEditingRequirementIndex(null);
    setEditingConditionIndex(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="manage-benefits">
      <div className="top-buttons">
        <button onClick={handleBackToDashboard} className="btn btn-secondary">
          Back to Dashboard
        </button>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>
      <h2>Manage Benefits</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleAddBenefit}>
        <div className="form-group">
          <label htmlFor="benefitName">Benefit Name</label>
          <input
            type="text"
            id="benefitName"
            className="form-control"
            value={benefitName}
            onChange={(e) => setBenefitName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="federal">Federal</label>
          <input
            type="checkbox"
            id="federal"
            className="form-control"
            checked={federal}
            onChange={(e) => setFederal(e.target.checked)}
          />
        </div>
        {!federal && (
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              className="form-control"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="benefitUrl">Benefit URL</label>
          <input
            type="text"
            id="benefitUrl"
            className="form-control"
            value={benefitUrl}
            onChange={(e) => setBenefitUrl(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="requirementName">Requirement Name</label>
          <input
            type="text"
            id="requirementName"
            className="form-control"
            value={requirementName}
            onChange={(e) => setRequirementName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="currentQuestionId">Question</label>
          <select
            id="currentQuestionId"
            className="form-control"
            value={currentQuestionId}
            onChange={(e) => setCurrentQuestionId(e.target.value)}
          >
            <option value="">Select a question</option>
            {questions.map((question) => (
              <option key={question.id} value={question.id}>
                {question.questionName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="currentOperator">Operator</label>
          <select
            id="currentOperator"
            className="form-control"
            value={currentOperator}
            onChange={(e) => setCurrentOperator(e.target.value)}
          >
            <option value="">Select an operator</option>
            <option value="<">&lt;</option>
            <option value="<=">&lt;=</option>
            <option value="=">=</option>
            <option value=">">&gt;</option>
            <option value=">=">&gt;=</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="currentValue">Value</label>
          <input
            type="number"
            id="currentValue"
            className="form-control"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        </div>
        <div className="form-buttons">
          <button type="button" onClick={handleAddCondition} className="btn btn-secondary">
            {editingConditionIndex !== null ? 'Update Condition' : 'Add Condition'}
          </button>
        </div>
        <ul className="condition-list">
          {currentConditions.map((condition, index) => (
            <li key={index}>
              {questions.find(q => q.id === condition.questionId)?.questionName} {condition.operator} {condition.value}
              <button onClick={() => handleEditCondition(index)} className="btn btn-secondary">Edit</button>
              <button onClick={() => handleDeleteCondition(index)} className="btn btn-danger">Delete</button>
            </li>
          ))}
        </ul>
        <div className="form-buttons">
          <button type="button" onClick={handleAddRequirement} className="btn btn-secondary">
            {editingRequirementIndex !== null ? 'Update Requirement' : 'Add Requirement'}
          </button>
        </div>
        <ul className="requirement-list">
          {requirements.map((requirement, index) => (
            <li key={index}>
              <span>{requirement.name}</span>
              <ul>
                {requirement.conditions.map((condition, i) => (
                  <li key={i}>
                    {questions.find(q => q.id === condition.questionId)?.questionName} {condition.operator} {condition.value}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleEditRequirement(index)} className="btn btn-secondary">Edit</button>
              <button onClick={() => handleDeleteRequirement(index)} className="btn btn-danger">Delete</button>
            </li>
          ))}
        </ul>
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">{editingBenefitIndex !== null ? 'Update Benefit' : 'Add Benefit'}</button>
          <button type="button" onClick={handleClearFields} className="btn btn-secondary">Clear</button>
        </div>
      </form>
      <ul className="benefit-list">
        {benefits.map((benefit, index) => (
          <li key={benefit.id}>
            <span>{benefit.benefitName} - {benefit.federal ? 'Federal' : `State: ${benefit.state}`} <a href={benefit.benefitUrl} target="_blank" rel="noopener noreferrer">Link</a></span>
            <button onClick={() => handleEditBenefit(index)} className="btn btn-secondary">Edit</button>
            <button onClick={() => handleDeleteBenefit(benefit.id)} className="btn btn-danger">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageBenefits;