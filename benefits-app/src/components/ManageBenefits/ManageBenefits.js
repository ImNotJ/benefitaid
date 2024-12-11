import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './ManageBenefits.css';

function ManageBenefits() {

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];
  
  // State declarations
  const [benefits, setBenefits] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [benefitName, setBenefitName] = useState('');
  const [federal, setFederal] = useState(false);
  const [state, setState] = useState('');
  const [benefitUrl, setBenefitUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Requirement states
  const [requirements, setRequirements] = useState([]);
  const [requirementName, setRequirementName] = useState('');
  const [requirementType, setRequirementType] = useState('');
  const [currentConditions, setCurrentConditions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState('');
  const [currentOperator, setCurrentOperator] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  
  // Editing states
  const [editingBenefitIndex, setEditingBenefitIndex] = useState(null);
  const [editingRequirementIndex, setEditingRequirementIndex] = useState(null);
  const [editingConditionIndex, setEditingConditionIndex] = useState(null);
  
  // Message states
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

    if (!benefitName || (!federal && !state) || !benefitUrl || !description) {
      setErrorMessage('All fields are required except image URL.');
      setSuccessMessage('');
      return;
    }

    const newBenefit = {
      benefitName,
      federal,
      state: federal ? null : state,
      benefitUrl,
      description,
      imageUrl,
      requirements
    };

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
    setDescription(benefit.description || '');
    setImageUrl(benefit.imageUrl || '');
    setRequirements(benefit.requirements || []);
    setEditingBenefitIndex(index);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleAddCondition = () => {
    if (!currentQuestionId || !currentOperator || !currentValue) {
      setErrorMessage('All fields are required for the condition.');
      setSuccessMessage('');
      return;
    }

    const question = questions.find(q => q.id === currentQuestionId);
    if (!question) {
      setErrorMessage('Invalid question selected.');
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

    handleClearConditionFields();
    setSuccessMessage('Condition added successfully!');
    setErrorMessage('');
  };

  const handleAddRequirement = () => {
    if (!requirementName || !requirementType || currentConditions.length === 0) {
      setErrorMessage('Requirement name, type, and at least one condition are required.');
      setSuccessMessage('');
      return;
    }

    const newRequirement = {
      name: requirementName,
      type: requirementType,
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

    handleClearRequirementFields();
    setSuccessMessage('Requirement added successfully!');
    setErrorMessage('');
  };

  const handleEditRequirement = (index) => {
    const requirement = requirements[index];
    setRequirementName(requirement.name);
    setRequirementType(requirement.type);
    setCurrentConditions(requirement.conditions);
    setEditingRequirementIndex(index);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleDeleteRequirement = (index) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(updatedRequirements);
    setSuccessMessage('Requirement deleted successfully!');
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
    setDescription('');
    setImageUrl('');
    setRequirements([]);
    handleClearRequirementFields();
    setEditingBenefitIndex(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleClearRequirementFields = () => {
    setRequirementName('');
    setRequirementType('');
    setCurrentConditions([]);
    handleClearConditionFields();
    setEditingRequirementIndex(null);
  };

  const handleClearConditionFields = () => {
    setCurrentQuestionId('');
    setCurrentOperator('');
    setCurrentValue('');
    setEditingConditionIndex(null);
  };

  const getQuestionById = (questionId) => {
    return questions.find(q => q.id === parseInt(questionId)) || null;
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
      
      {/* Benefit Form */}
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
            checked={federal}
            onChange={(e) => setFederal(e.target.checked)}
          />
        </div>
        {!federal && (
          <div className="form-group">
            <label htmlFor="state">State</label>
            <select
              id="state"
              className="form-control"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select a state</option>
              {states.map((stateName) => (
                <option key={stateName} value={stateName}>{stateName}</option>
              ))}
            </select>
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
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            className="form-control"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {imageUrl && (
            <div className="img-preview">
              <img
                src={imageUrl}
                alt="Benefit preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/api/placeholder/100/100';
                }}
              />
            </div>
          )}
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingBenefitIndex !== null ? 'Update Benefit' : 'Add Benefit'}
          </button>
          <button type="button" onClick={handleClearFields} className="btn btn-secondary">
            Clear
          </button>
        </div>
      </form>

      {/* Requirements Section */}
      <div className="requirement-section">
        <h3>Requirements</h3>
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
          <label htmlFor="requirementType">Requirement Type</label>
          <select
            id="requirementType"
            className="form-control"
            value={requirementType}
            onChange={(e) => setRequirementType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="GENERAL">General</option>
            <option value="NECESSARY">Necessary</option>
            <option value="INVALID">Invalid</option>
            <option value="GENERAL_NECESSARY">General + Necessary</option>
          </select>
        </div>
        <div className="form-buttons">
          <button type="button" onClick={handleAddRequirement} className="btn btn-secondary">
            {editingRequirementIndex !== null ? 'Update Requirement' : 'Add Requirement'}
          </button>
          <button type="button" onClick={handleClearRequirementFields} className="btn btn-secondary">
            Clear
          </button>
        </div>
        <ul className="requirement-list">
          {requirements.map((requirement, index) => (
            <li key={index}>
              <div className="requirement-header">
                <span>{requirement.name} - {requirement.type}</span>
                <div className="requirement-buttons">
                  <button onClick={() => handleEditRequirement(index)} className="btn btn-secondary">Edit</button>
                  <button onClick={() => handleDeleteRequirement(index)} className="btn btn-danger">Delete</button>
                </div>
              </div>
              <ul className="condition-sublist">
                {requirement.conditions.map((condition, i) => {
                  const question = getQuestionById(condition.questionId);
                  return (
                    <li key={i}>
                      {question ? `${question.questionName} ${condition.operator} ${condition.value}` : 'Invalid Question'}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Conditions Section */}
      <div className="condition-section">
        <h3>Conditions</h3>
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
            <option value="">Select operator</option>
            <option value="=">=</option>
            <option value="!=">!=</option>
            <option value=">">&gt;</option>
            <option value=">=">&gt;=</option>
            <option value="<">&lt;</option>
            <option value="<=">&lt;=</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="currentValue">Value</label>
          <input
            type="text"
            id="currentValue"
            className="form-control"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
          {getQuestionById(currentQuestionId)?.questionType === 'MULTI_CHOICE' && (
            <small className="form-text text-muted">
              For multiple choice questions, enter options separated by commas
            </small>
          )}
        </div>
        <div className="form-buttons">
          <button type="button" onClick={handleAddCondition} className="btn btn-secondary">
            {editingConditionIndex !== null ? 'Update Condition' : 'Add Condition'}
          </button>
          <button type="button" onClick={handleClearConditionFields} className="btn btn-secondary">
            Clear
          </button>
        </div>
        <ul className="condition-list">
          {currentConditions.map((condition, index) => {
            const question = getQuestionById(condition.questionId);
            return (
              <li key={index}>
                <span>{question ? `${question.questionName} ${condition.operator} ${condition.value}` : 'Invalid Question'}</span>
                <div className="condition-buttons">
                  <button onClick={() => handleEditCondition(index)} className="btn btn-secondary">Edit</button>
                  <button onClick={() => handleDeleteCondition(index)} className="btn btn-danger">Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Existing Benefits List */}
      <h3>Existing Benefits</h3>
      <ul className="benefit-list">
        {benefits.map((benefit, index) => (
          <li key={benefit.id}>
            <span>{benefit.benefitName} - {benefit.federal ? 'Federal' : benefit.state}</span>
            <div className="form-buttons">
              <button onClick={() => handleEditBenefit(index)} className="btn btn-secondary">Edit</button>
              <button onClick={() => handleDeleteBenefit(benefit.id)} className="btn btn-danger">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageBenefits;