import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import './ManageBenefits.css';

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

/**
 * ManageBenefits component for handling the management of benefits.
 *
 * @returns {React.ReactNode} The rendered component.
 */
function ManageBenefits() {
  const [benefits, setBenefits] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [benefitName, setBenefitName] = useState('');
  const [federal, setFederal] = useState(false);
  const [state, setState] = useState('');
  const [benefitUrl, setBenefitUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [requirements, setRequirements] = useState([]);

  // Requirement form state
  const [requirementName, setRequirementName] = useState('');
  const [requirementType, setRequirementType] = useState('GENERAL');
  const [currentConditions, setCurrentConditions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState('');
  const [currentOperator, setCurrentOperator] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  // Editing states
  const [editingBenefitIndex, setEditingBenefitIndex] = useState(null);
  const [editingRequirementIndex, setEditingRequirementIndex] = useState(null);
  const [editingConditionIndex, setEditingConditionIndex] = useState(null);

  // Messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const requirementTypes = [
    {
      value: 'GENERAL',
      label: 'General (Must Meet At Least One General Requirement)',
      description: 'If user meets any one General requirement, they may be eligible based on other requirement types.'
    },
    {
      value: 'NECESSARY',
      label: 'Necessary (Must Meet All)',
      description: 'User must meet all Necessary requirements to be eligible.'
    },
    {
      value: 'INVALID',
      label: 'Invalid (Disqualifying)',
      description: 'If user meets any Invalid requirement, they are not eligible.'
    },
    {
      value: 'GENERAL_NECESSARY',
      label: 'General + Necessary (Must Meet All)',
      description: 'User must meet all General + Necessary requirements. If met, user is eligible regardless of General requirements.'
    }
  ];

  useEffect(() => {
    fetchBenefits();
    fetchQuestions();
  }, []);

  const handleOperatorOptions = (questionType) => {
    const question = questions.find(q => q.id === parseInt(currentQuestionId));
    if (!question) return [];

    switch (question.questionType) {
      case 'Numerical':
      case 'Date':
        return ['=', '!=', '>', '<', '>=', '<='];
      case 'MultiChoiceSingle':
      case 'MultiChoiceMulti':
      case 'Text':
      case 'Email':
        return ['=', '!='];
      default:
        return ['=', '!='];
    }
  };

  const getValueInput = (questionType) => {
    const question = questions.find(q => q.id === parseInt(currentQuestionId));
    if (!question) return null;

    switch (question.questionType) {
      case 'MultiChoiceSingle':
      case 'MultiChoiceMulti':
        return (
          <select
            className="form-control"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          >
            <option value="">Select Value</option>
            {question.options.split(',').map(option => (
              <option key={option} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </select>
        );
      case 'Date':
        return (
          <input
            type="date"
            className="form-control"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        );
      case 'Numerical':
        return (
          <input
            type="number"
            className="form-control"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            step="any"
          />
        );
      default:
        return (
          <input
            type="text"
            className="form-control"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        );
    }
  };

  const validateBenefit = () => {
    if (!benefitName || (!federal && !state) || !benefitUrl || !description) {
      setErrorMessage('Please fill in all required benefit fields');
      return false;
    }

    // Validate all requirements and their conditions
    for (const requirement of requirements) {
      if (!requirement.name || !requirement.type) {
        setErrorMessage('All requirements must have a name and type');
        return false;
      }

      if (!requirement.conditions || requirement.conditions.length === 0) {
        setErrorMessage('Each requirement must have at least one condition');
        return false;
      }

      if (!validateConditions(requirement.conditions)) {
        setErrorMessage('Invalid conditions found in requirements');
        return false;
      }
    }

    return true;
  };

  const validateRequirement = () => {
    if (!requirementName || currentConditions.length === 0) {
      setErrorMessage('Please provide a requirement name and at least one condition');
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchBenefits();
    fetchQuestions();
  }, []);

  /**
   * Fetches the benefits from the API.
   */
  const fetchBenefits = async () => {
    try {
      const response = await axios.get('/api/benefits');
      setBenefits(response.data);
    } catch (error) {
      console.error('Error fetching benefits:', error);
    }
  };

  /**
   * Fetches the questions from the API.
   */
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  /**
   * Handles the addition of a new benefit.
   *
   * @param {Event} e - The form submit event.
   */
  const handleAddBenefit = async (e) => {
    e.preventDefault();
    if (!validateBenefit()) return;

    // Ensure requirements have the correct structure
    const formattedRequirements = requirements.map(req => ({
      ...req,
      conditions: req.conditions.map(cond => ({
        ...cond,
        questionId: parseInt(cond.questionId) // Ensure questionId is a number
      }))
    }));

    const benefitData = {
      benefitName,
      federal,
      state: federal ? null : state,
      benefitUrl,
      description,
      imageUrl,
      requirements: formattedRequirements
    };

    try {
      console.log('Sending benefit data:', benefitData); // Debug log

      if (editingBenefitIndex !== null) {
        const benefitId = benefits[editingBenefitIndex].id;
        const response = await axios.put(`/api/benefits/${benefitId}`, benefitData);
        console.log('Update response:', response); // Debug log
      } else {
        const response = await axios.post('/api/benefits', benefitData);
        console.log('Create response:', response); // Debug log
      }

      await fetchBenefits();
      handleClearBenefitFields();
      setSuccessMessage('Benefit saved successfully!');
    } catch (error) {
      console.error('Error saving benefit:', error);
      console.error('Error response:', error.response); // Debug log
      setErrorMessage(
        'Failed to save benefit: ' +
        (error.response?.data?.message || error.response?.data || error.message)
      );
    }
  };

  /**
   * Handles the deletion of a benefit.
   *
   * @param {string} id - The ID of the benefit to delete.
   */
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

  /**
   * Handles the editing of a benefit.
   *
   * @param {number} index - The index of the benefit to edit.
   */
  const handleEditBenefit = (index) => {
    const benefit = benefits[index];
    setBenefitName(benefit.benefitName);
    setFederal(benefit.federal);
    setState(benefit.state || '');
    setBenefitUrl(benefit.benefitUrl);
    setDescription(benefit.description || '');
    setImageUrl(benefit.imageUrl || '');
    setRequirements(benefit.requirements);
    setEditingBenefitIndex(index);
  };

  /**
   * Handles the addition of a new condition.
   */
  const handleAddCondition = () => {
    if (!currentQuestionId || !currentOperator || !currentValue) {
      setErrorMessage('Please fill in all condition fields');
      return;
    }

    const question = questions.find(q => q.id === parseInt(currentQuestionId));
    if (!question) {
      setErrorMessage('Invalid question selected');
      return;
    }

    // For multi-choice questions, validate that the value is one of the options
    if (['MultiChoiceSingle', 'MultiChoiceMulti'].includes(question.questionType)) {
      const options = question.options?.split(',').map(opt => opt.trim()) || [];
      if (!options.includes(currentValue)) {
        setErrorMessage('Selected value must be one of the question options');
        return;
      }
    }

    const newCondition = {
      questionId: parseInt(currentQuestionId),
      operator: currentOperator,
      value: currentValue
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

  const validateConditions = (conditions) => {
    return conditions.every(condition => {
      const question = questions.find(q => q.id === condition.questionId);
      if (!question) return false;

      if (['MultiChoiceSingle', 'MultiChoiceMulti'].includes(question.questionType)) {
        const options = question.options?.split(',').map(opt => opt.trim()) || [];
        return options.includes(condition.value);
      }
      return true;
    });
  };

  /**
   * Handles the addition of a new requirement.
   */
  const handleAddRequirement = () => {
    if (!validateRequirement()) return;

    const newRequirement = {
      name: requirementName,
      type: requirementType,
      conditions: currentConditions
    };

    if (editingRequirementIndex !== null) {
      const updatedRequirements = [...requirements];
      updatedRequirements[editingRequirementIndex] = newRequirement;
      setRequirements(updatedRequirements);
    } else {
      setRequirements([...requirements, newRequirement]);
    }

    handleClearRequirementFields();
  };

  /**
   * Handles the editing of a requirement.
   *
   * @param {number} index - The index of the requirement to edit.
   */
  const handleEditRequirement = (index) => {
    const requirement = requirements[index];
    setRequirementName(requirement.name);
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

  const handleClearBenefitFields = () => {
    setBenefitName('');
    setFederal(false);
    setState('');
    setBenefitUrl('');
    setDescription('');
    setImageUrl('');
    setRequirements([]);
    setEditingBenefitIndex(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleClearRequirementFields = () => {
    setRequirementName('');
    setRequirementType('GENERAL');
    setCurrentConditions([]);
    setEditingRequirementIndex(null);
    setErrorMessage('');
  };

  const handleClearConditionFields = () => {
    setCurrentQuestionId('');
    setCurrentOperator('');
    setCurrentValue('');
    setEditingConditionIndex(null);
    setErrorMessage('');
  };

  return (
    <div className="manage-benefits">
      {/* Navigation buttons */}
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
      <div className="section benefit-form">
        <h3>{editingBenefitIndex !== null ? 'Edit Benefit' : 'Add New Benefit'}</h3>
        <form onSubmit={handleAddBenefit}>
          {/* Existing benefit fields */}
          <div className="form-group">
            <label>Benefit Name *</label>
            <input
              type="text"
              className="form-control"
              value={benefitName}
              onChange={(e) => setBenefitName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Federal Benefit</label>
            <input
              type="checkbox"
              checked={federal}
              onChange={(e) => {
                setFederal(e.target.checked);
                if (e.target.checked) setState('');
              }}
            />
          </div>

          {!federal && (
            <div className="form-group">
              <label>State *</label>
              <select
                className="form-control"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Benefit URL *</label>
            <input
              type="url"
              className="form-control"
              value={benefitUrl}
              onChange={(e) => setBenefitUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              className="form-control"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div className="image-preview">
                <img
                  src={imageUrl}
                  alt="Preview"
                  onError={(e) => e.target.src = '/placeholder-image.png'}
                />
              </div>
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              {editingBenefitIndex !== null ? 'Update Benefit' : 'Add Benefit'}
            </button>
            <button type="button" onClick={handleClearBenefitFields} className="btn btn-secondary">
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Requirements Section */}
      <div className="section requirements-section">
        <h3>Requirements</h3>
        <div className="requirement-form">
          <div className="form-group">
            <label>Requirement Name *</label>
            <input
              type="text"
              className="form-control"
              value={requirementName}
              onChange={(e) => setRequirementName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Requirement Type *</label>
            <select
              className="form-control"
              value={requirementType}
              onChange={(e) => setRequirementType(e.target.value)}
            >
              {requirementTypes.map(type => (
                <option
                  key={type.value}
                  value={type.value}
                  title={type.description}
                >
                  {type.label}
                </option>
              ))}
            </select>
            <small className="form-text text-muted">
              {requirementTypes.find(t => t.value === requirementType)?.description}
            </small>
          </div>

          {/* Conditions */}
          <div className="conditions-section">
            <h4>Conditions</h4>
            <div className="condition-form">
              <div className="form-group">
                <label>Question *</label>
                <select
                  className="form-control"
                  value={currentQuestionId}
                  onChange={(e) => {
                    setCurrentQuestionId(e.target.value);
                    setCurrentOperator('');
                    setCurrentValue('');
                  }}
                >
                  <option value="">Select Question</option>
                  {questions.map(question => (
                    <option key={question.id} value={question.id}>
                      {question.questionName}
                    </option>
                  ))}
                </select>
              </div>

              {currentQuestionId && (
                <>
                  <div className="form-group">
                    <label>Operator *</label>
                    <select
                      className="form-control"
                      value={currentOperator}
                      onChange={(e) => setCurrentOperator(e.target.value)}
                    >
                      <option value="">Select Operator</option>
                      {handleOperatorOptions().map(op => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Value *</label>
                    {getValueInput()}
                  </div>
                </>
              )}

              <div className="form-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddCondition}
                >
                  {editingConditionIndex !== null ? 'Update Condition' : 'Add Condition'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClearConditionFields}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Current Conditions List */}
            <div className="conditions-list">
              {currentConditions.map((condition, index) => (
                <div key={index} className="condition-item">
                  <span>
                    {questions.find(q => q.id === condition.questionId)?.questionName}
                    {' '}{condition.operator}{' '}
                    {condition.value}
                  </span>
                  <div className="condition-actions">
                    <button
                      onClick={() => handleEditCondition(index)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCondition(index)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddRequirement}
            >
              {editingRequirementIndex !== null ? 'Update Requirement' : 'Add Requirement'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClearRequirementFields}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Requirements List */}
        <div className="requirements-list">
          {requirements.map((requirement, index) => (
            <div key={index} className="requirement-item">
              <div className="requirement-header">
                <h4>{requirement.name}</h4>
                <span className="requirement-type">{requirement.type}</span>
              </div>
              <div className="requirement-conditions">
                {requirement.conditions.map((condition, condIndex) => (
                  <div key={condIndex} className="condition-display">
                    {questions.find(q => q.id === condition.questionId)?.questionName}
                    {' '}{condition.operator}{' '}
                    {condition.value}
                  </div>
                ))}
              </div>

              <div className="requirement-actions">
                <button
                  onClick={() => handleEditRequirement(index)}
                  className="btn btn-sm btn-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRequirement(index)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Benefits List */}
      <div className="section existing-benefits">
        <h3>Existing Benefits</h3>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={benefit.id} className="benefit-card">
              {benefit.imageUrl && (
                <div className="benefit-image">
                  <img
                    src={benefit.imageUrl}
                    alt={benefit.benefitName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                </div>
              )}
              <div className="benefit-content">
                <h4>{benefit.benefitName}</h4>
                <p className="benefit-scope">{benefit.federal ? 'Federal' : benefit.state}</p>
                <div className="benefit-description">
                  {benefit.description}
                </div>
                <div className="requirements-summary">
                  <h5>Requirements:</h5>
                  {benefit.requirements.map((req, reqIndex) => (
                    <div key={reqIndex} className="requirement-summary">
                      <span className={`requirement-type ${req.type ? req.type.toLowerCase() : ''}`}>
                        {req.type}
                      </span>
                      {req.name}
                    </div>
                  ))}
                </div>
                <div className="benefit-actions">
                  <a
                    href={benefit.benefitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-link"
                  >
                    View Benefit
                  </a>
                  <button
                    onClick={() => handleEditBenefit(index)}
                    className="btn btn-sm btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBenefit(benefit.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageBenefits;