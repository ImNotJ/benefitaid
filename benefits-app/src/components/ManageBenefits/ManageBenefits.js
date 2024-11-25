import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './ManageBenefits.css';

/**
 * ManageBenefits component for handling the management of benefits.
 *
 * @returns {React.ReactNode} The rendered component.
 */
function ManageBenefits() {
  const [benefits, setBenefits] = useState([]);
  const [benefitName, setBenefitName] = useState('');
  const [requirements, setRequirements] = useState([]);
  const [requirementName, setRequirementName] = useState('');
  const [requirementType, setRequirementType] = useState('');
  const [currentConditions, setCurrentConditions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState('');
  const [currentOperator, setCurrentOperator] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [editingBenefitId, setEditingBenefitId] = useState(null);
  const [editingRequirementIndex, setEditingRequirementIndex] = useState(null);
  const [editingConditionIndex, setEditingConditionIndex] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBenefits();
  }, []);

  /**
   * Fetches the benefits from the API.
   */
  const fetchBenefits = async () => {
    try {
      const response = await axios.get('/api/benefits');
      console.log('Fetch benefits response:', response); // Debug log
      setBenefits(response.data);
    } catch (error) {
      console.error('Fetch benefits error:', error); // Debug log
    }
  };

  /**
   * Handles the addition or update of a benefit.
   *
   * @param {Event} e - The form submit event.
   */
  const handleAddOrUpdateBenefit = async (e) => {
    e.preventDefault();

    // Custom validation
    if (!benefitName || requirements.length === 0) {
      setErrorMessage('Benefit name and at least one requirement are required.');
      setSuccessMessage('');
      return;
    }

    const newBenefit = {
      name: benefitName,
      requirements: requirements,
    };

    try {
      let response;
      if (editingBenefitId) {
        response = await axios.put(`/api/benefits/${editingBenefitId}`, newBenefit);
        console.log('Update benefit response:', response); // Debug log
        setSuccessMessage('Benefit updated successfully!');
      } else {
        response = await axios.post('/api/benefits', newBenefit);
        console.log('Add benefit response:', response); // Debug log
        setSuccessMessage('Benefit added successfully!');
      }
      fetchBenefits();
      setBenefitName('');
      setRequirements([]);
      setEditingBenefitId(null);
      setErrorMessage('');
    } catch (error) {
      console.error('Add or update benefit error:', error); // Debug log
      setErrorMessage('Failed to add or update benefit.');
      setSuccessMessage('');
    }
  };

  /**
   * Handles the editing of a benefit.
   *
   * @param {Object} benefit - The benefit object to edit.
   */
  const handleEditBenefit = (benefit) => {
    setBenefitName(benefit.name);
    setRequirements(benefit.requirements || []);
    setEditingBenefitId(benefit.id);
    setSuccessMessage('');
    setErrorMessage('');
  };

  /**
   * Handles the deletion of a benefit.
   *
   * @param {string} id - The ID of the benefit to delete.
   */
  const handleDeleteBenefit = async (id) => {
    try {
      const response = await axios.delete(`/api/benefits/${id}`);
      console.log('Delete benefit response:', response); // Debug log
      fetchBenefits();
      setSuccessMessage('Benefit deleted successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Delete benefit error:', error); // Debug log
      setErrorMessage('Failed to delete benefit.');
      setSuccessMessage('');
    }
  };

  /**
   * Handles the addition of a new requirement.
   */
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

    setRequirementName('');
    setRequirementType('');
    setCurrentConditions([]);
    setErrorMessage('');
  };

  /**
   * Handles the editing of a requirement.
   *
   * @param {number} index - The index of the requirement to edit.
   */
  const handleEditRequirement = (index) => {
    const requirement = requirements[index];
    setRequirementName(requirement.name);
    setRequirementType(requirement.type);
    setCurrentConditions(requirement.conditions);
    setEditingRequirementIndex(index);
  };

  /**
   * Handles the deletion of a requirement.
   *
   * @param {number} index - The index of the requirement to delete.
   */
  const handleDeleteRequirement = (index) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(updatedRequirements);
  };

  /**
   * Handles the addition of a new condition.
   */
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

  /**
   * Handles the editing of a condition.
   *
   * @param {number} index - The index of the condition to edit.
   */
  const handleEditCondition = (index) => {
    const condition = currentConditions[index];
    setCurrentQuestionId(condition.questionId);
    setCurrentOperator(condition.operator);
    setCurrentValue(condition.value);
    setEditingConditionIndex(index);
  };

  /**
   * Handles the deletion of a condition.
   *
   * @param {number} index - The index of the condition to delete.
   */
  const handleDeleteCondition = (index) => {
    const updatedConditions = currentConditions.filter((_, i) => i !== index);
    setCurrentConditions(updatedConditions);
  };

  /**
   * Handles navigation back to the admin dashboard.
   */
  const handleBackToDashboard = () => {
    navigate('/admin-dashboard');
  };

  /**
   * Handles the logout process.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin-login');
  };

  /**
   * Clears all input fields.
   */
  const handleClearFields = () => {
    setBenefitName('');
    setRequirements([]);
    setRequirementName('');
    setRequirementType('');
    setCurrentConditions([]);
    setCurrentQuestionId('');
    setCurrentOperator('');
    setCurrentValue('');
    setEditingBenefitId(null);
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
      <form onSubmit={handleAddOrUpdateBenefit}>
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
            <option value="">Select</option>
            <option value="Invalid">Invalid</option>
            <option value="Auto">Auto</option>
            <option value="Necessary">Necessary</option>
            <option value="General + Necessary">General + Necessary</option>
            <option value="General">General</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="currentQuestionId">Question ID</label>
          <input
            type="text"
            id="currentQuestionId"
            className="form-control"
            value={currentQuestionId}
            onChange={(e) => setCurrentQuestionId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="currentOperator">Operator</label>
          <select
            id="currentOperator"
            className="form-control"
            value={currentOperator}
            onChange={(e) => setCurrentOperator(e.target.value)}
          >
            <option value="">Select</option>
            <option value="==">==</option>
            <option value="!=">!=</option>
            <option value="<">&lt;</option>
            <option value="<=">&lt;=</option>
            <option value=">">&gt;</option>
            <option value=">=">&gt;=</option>
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
        </div>
        <div className="form-buttons">
          <button type="button" onClick={handleAddCondition} className="btn btn-primary">
            {editingConditionIndex !== null ? 'Update Condition' : 'Add Condition'}
          </button>
          <button type="button" onClick={handleAddRequirement} className="btn btn-primary">
            {editingRequirementIndex !== null ? 'Update Requirement' : 'Add Requirement'}
          </button>
          <button type="submit" className="btn btn-primary">
            {editingBenefitId ? 'Update Benefit' : 'Add Benefit'}
          </button>
          <button type="button" onClick={handleClearFields} className="btn btn-secondary">
            Clear
          </button>
        </div>
      </form>
      <ul className="requirement-list">
        {requirements.map((requirement, index) => (
          <li key={index}>
            <span>{requirement.name} ({requirement.type})</span>
            <ul>
              {requirement.conditions.map((condition, i) => (
                <li key={i}>
                  {condition.questionId} {condition.operator} {condition.value}
                  <button onClick={() => handleEditCondition(i)} className="btn btn-secondary btn-sm">Edit</button>
                  <button onClick={() => handleDeleteCondition(i)} className="btn btn-danger btn-sm">Delete</button>
                </li>
              ))}
            </ul>
            <div className="form-buttons">
              <button onClick={() => handleEditRequirement(index)} className="btn btn-secondary">Edit</button>
              <button onClick={() => handleDeleteRequirement(index)} className="btn btn-danger">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <ul className="benefit-list">
        {benefits.map((benefit) => (
          <li key={benefit.id}>
            <span>{benefit.id}: {benefit.name}</span>
            <div className="benefit-buttons">
              <button onClick={() => handleEditBenefit(benefit)} className="btn btn-secondary">Edit</button>
              <button onClick={() => handleDeleteBenefit(benefit.id)} className="btn btn-danger">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageBenefits;