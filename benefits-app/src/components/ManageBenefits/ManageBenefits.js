import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { isValidUrl } from '../../utils/validation';
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
  const [description, setDescription] = useState('');
  const [displayLinkText, setDisplayLinkText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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
  
    // Validation checks
    if (!isValidUrl(benefitUrl)) {
      setErrorMessage('Please enter a valid URL');
      return;
    }
  
    if (!benefitName || (!federal && !state) || !benefitUrl) {
      setErrorMessage('Benefit Name, Federal/State, and Benefit URL are required.');
      setSuccessMessage('');
      return;
    }
  
    try {
      if (editingBenefitIndex !== null) {
        // Handling edit case
        const benefitId = benefits[editingBenefitIndex].id;
        const formData = new FormData();
        formData.append('benefitName', benefitName);
        formData.append('federal', federal);
        formData.append('state', federal ? null : state);
        formData.append('benefitUrl', benefitUrl);
        formData.append('displayLinkText', displayLinkText);
        formData.append('description', description);
        formData.append('requirements', JSON.stringify(requirements));
  
        await axios.put(`/api/benefits/${benefitId}`, formData);
        
        // Handle image update if there's a new image
        if (selectedImage) {
          const imageFormData = new FormData();
          imageFormData.append('image', selectedImage);
          await axios.post(`/api/benefits/${benefitId}/image`, imageFormData);
        }
        
        setEditingBenefitIndex(null);
      } else {
        // Handling new benefit case
        const formData = new FormData();
        formData.append('benefitName', benefitName);
        formData.append('federal', federal);
        formData.append('state', federal ? null : state);
        formData.append('benefitUrl', benefitUrl);
        formData.append('displayLinkText', displayLinkText);
        formData.append('description', description);
        formData.append('requirements', JSON.stringify(requirements));
  
        const response = await axios.post('/api/benefits', formData);
        
        // Handle image upload for new benefit
        if (selectedImage) {
          const imageFormData = new FormData();
          imageFormData.append('image', selectedImage);
          await axios.post(`/api/benefits/${response.data.id}/image`, imageFormData);
        }
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
  const handleEditBenefit = (benefit, benefitIndex) => { // Added benefitIndex parameter
    setBenefitName(benefit.benefitName);
    setFederal(benefit.federal);
    setState(benefit.state || '');
    setBenefitUrl(benefit.benefitUrl);
    setDisplayLinkText(benefit.displayLinkText || 'Learn More');
    setDescription(benefit.description || '');
    if (benefit.hasImage) {
      setPreviewImage(`/api/benefits/${benefit.id}/image`);
    } else {
      setPreviewImage(null);
    }
    setRequirements(benefit.requirements);
    setEditingBenefitIndex(index);
  };


  // Add warning for legacy benefits
  const renderLegacyWarning = (benefit) => {
    const missingFields = [];
    if (!benefit.hasImage) missingFields.push('image');
    if (!benefit.description) missingFields.push('description');
    if (!benefit.displayLinkText) missingFields.push('display link text');

    if (missingFields.length > 0) {
      return (
        <div className="legacy-warning">
          Missing: {missingFields.join(', ')}. Please update this benefit.
        </div>
      );
    }
    return null;
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
   * Handles the addition of a new requirement.
   */
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

  /**
   * Clears all input fields.
   */
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

  /**
   * Clears the requirement input fields.
   */
  const handleClearRequirementFields = () => {
    setRequirementName('');
    setCurrentConditions([]);
    setEditingRequirementIndex(null);
    setErrorMessage('');
  };

  /**
   * Clears the condition input fields.
   */
  const handleClearConditionFields = () => {
    setCurrentQuestionId('');
    setCurrentOperator('');
    setCurrentValue('');
    setEditingConditionIndex(null);
    setErrorMessage('');
  };

  /**
   * Gets the question name for a given question ID.
   *
   * @param {string} questionId - The ID of the question.
   * @returns {string} The name of the question.
   */
  const getQuestionName = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    return question ? question.questionName : '';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        if (img.width !== 300 || img.height !== 200) {
          alert('Image must be 300x200 pixels');
          return;
        }
        setSelectedImage(file);
        setPreviewImage(URL.createObjectURL(file));
      };
      img.src = URL.createObjectURL(file);
    }
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
            <select
              id="state"
              className="form-control"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
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
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">{editingBenefitIndex !== null ? 'Update Benefit' : 'Add Benefit'}</button>
          <button type="button" onClick={handleClearFields} className="btn btn-secondary">Clear</button>
        </div>

        <div className="form-group">
          <label htmlFor="displayLinkText">Link Display Text</label>
          <input
            type="text"
            id="displayLinkText"
            className="form-control"
            value={displayLinkText}
            onChange={(e) => setDisplayLinkText(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            style={{ minHeight: '150px' }}
          />

          {showPreview && (
            <div
              className="description-preview"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image">Benefit Image (300x200 pixels)</label>
          <input
            type="file"
            id="image"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          <small className="text-muted">
            Please upload an image that is exactly 300x200 pixels
          </small>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="img-preview mt-2"
            />
          )}
        </div>
      </form>

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
        <div className="form-buttons">
          <button type="button" onClick={handleAddRequirement} className="btn btn-secondary">
            {editingRequirementIndex !== null ? 'Update Requirement' : 'Add Requirement'}
          </button>
          <button type="button" onClick={handleClearRequirementFields} className="btn btn-secondary">Clear</button>
        </div>
        <ul className="requirement-list">
          {requirements.map((requirement, index) => (
            <li key={index}>
              <span>{requirement.name}</span>
              <ul>
                {requirement.conditions.map((condition, i) => (
                  <li key={i}>
                    {getQuestionName(condition.questionId)} {condition.operator} {condition.value}
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
      </div>

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
            <option value="">Select an operator</option>
            <option value="<">&lt;</option>
            <option value="<=">&lt;=</option>
            <option value="=">=</option>
            <option value=">">&gt;</option>
            <option value=">=">&gt;=</option>
            <option value="!=">!=</option>
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
          <button type="button" onClick={handleAddCondition} className="btn btn-secondary">
            {editingConditionIndex !== null ? 'Update Condition' : 'Add Condition'}
          </button>
          <button type="button" onClick={handleClearConditionFields} className="btn btn-secondary">Clear</button>
        </div>
        <ul className="condition-list">
          {currentConditions.map((condition, index) => (
            <li key={index}>
              {getQuestionName(condition.questionId)} {condition.operator} {condition.value}
              <div className="form-buttons">
                <button onClick={() => handleEditCondition(index)} className="btn btn-secondary">Edit</button>
                <button onClick={() => handleDeleteCondition(index)} className="btn btn-danger">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <h3>Existing Benefits</h3>
      <ul className="benefit-list">
        {benefits.map((benefit, index) => (
          <li key={benefit.id}>
            <span>{benefit.benefitName} - {benefit.federal ? 'Federal' : benefit.state}</span>
            {renderLegacyWarning(benefit)}
            <div className="form-buttons">
              <button onClick={() => handleEditBenefit(benefit, index)} className="btn btn-secondary">
                Edit
              </button>
              <button onClick={() => handleDeleteBenefit(benefit.id)} className="btn btn-danger">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageBenefits;