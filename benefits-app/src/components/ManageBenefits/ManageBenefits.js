import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import './ManageBenefits.css';

function ManageBenefits() {
  const [benefits, setBenefits] = useState([]);
  const [benefitName, setBenefitName] = useState('');
  const [federal, setFederal] = useState(false);
  const [state, setState] = useState('');
  const [benefitUrl, setBenefitUrl] = useState('');
  const [benefitRequirements, setBenefitRequirements] = useState('');

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      const response = await axios.get('/api/benefits');
      setBenefits(response.data);
    } catch (error) {
      console.error('Error fetching benefits:', error);
    }
  };

  const handleAddBenefit = async (e) => {
    e.preventDefault();
    const newBenefit = { benefitName, federal, state: federal ? null : state, benefitUrl, benefitRequirements: JSON.parse(benefitRequirements) };
    try {
      await axios.post('/api/benefits', newBenefit);
      fetchBenefits();
      setBenefitName('');
      setFederal(false);
      setState('');
      setBenefitUrl('');
      setBenefitRequirements('');
    } catch (error) {
      console.error('Error adding benefit:', error);
    }
  };

  const handleDeleteBenefit = async (id) => {
    try {
      await axios.delete(`/api/benefits/${id}`);
      fetchBenefits();
    } catch (error) {
      console.error('Error deleting benefit:', error);
    }
  };

  return (
    <div className="manage-benefits">
      <h2>Manage Benefits</h2>
      <form onSubmit={handleAddBenefit}>
        <div className="form-group">
          <label htmlFor="benefitName">Benefit Name</label>
          <input
            type="text"
            id="benefitName"
            className="form-control"
            value={benefitName}
            onChange={(e) => setBenefitName(e.target.value)}
            required
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
              required
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
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="benefitRequirements">Benefit Requirements (JSON format)</label>
          <textarea
            id="benefitRequirements"
            className="form-control"
            value={benefitRequirements}
            onChange={(e) => setBenefitRequirements(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Benefit</button>
      </form>
      <ul className="benefit-list">
        {benefits.map((benefit) => (
          <li key={benefit.id}>
            <span>{benefit.benefitName} - {benefit.federal ? 'Federal' : `State: ${benefit.state}`} - <a href={benefit.benefitUrl} target="_blank" rel="noopener noreferrer">Link</a></span>
            <button onClick={() => handleDeleteBenefit(benefit.id)} className="btn btn-danger">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageBenefits;