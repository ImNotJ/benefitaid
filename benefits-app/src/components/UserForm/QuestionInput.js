import React from 'react';
import { isValidEmail, formatDate } from '../../utils/validation';

const QuestionInput = ({ question, value, onChange, onError }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    let error = null;

    // Only validate format if there's a value
    if (newValue && newValue.trim() !== '') {
      switch (question.questionType) {
        case 'Email':
          if (!isValidEmail(newValue)) {
            error = 'Please enter a valid email address';
          }
          break;
        case 'Date':
          if (!formatDate(newValue)) {
            error = 'Please enter a date in MM/DD/YYYY format';
          }
          break;
        case 'Numerical':
          if (isNaN(Number(newValue))) {
            error = 'Please enter a valid number';
          }
          break;
        default:
          break;
      }
    }

    onChange(question.id, newValue);
    if (onError) {
      onError(question.id, error);
    }
  };

  const handleMultiChoiceChange = (selected) => {
    // If no options are selected, pass empty string instead of empty array join
    const value = selected.length > 0 ? selected.join(',') : '';
    onChange(question.id, value);
  };

  switch (question.questionType) {
    case 'Numerical':
      return (
        <input
          type="number"
          className="form-control"
          value={value || ''}
          onChange={handleChange}
          step="any"
        />
      );

    case 'Date':
      return (
        <input
          type="date"
          className="form-control"
          value={value || ''}
          onChange={handleChange}
          placeholder="MM/DD/YYYY"
        />
      );

    case 'Email':
      return (
        <input
          type="email"
          className="form-control"
          value={value || ''}
          onChange={handleChange}
        />
      );

    case 'MultiChoiceSingle':
      return (
        <div className="form-control radio-group">
          {/* Add skip option first */}
          <div className="radio-option">
            <input
              type="radio"
              id={`${question.id}-skip`}
              name={`question-${question.id}`}
              value=""
              checked={!value}
              onChange={(e) => onChange(question.id, '')}
            />
            <label htmlFor={`${question.id}-skip`}>Skip this question</label>
          </div>
          {question.options?.split(',').map((option) => (
            <div key={option} className="radio-option">
              <input
                type="radio"
                id={`${question.id}-${option}`}
                name={`question-${question.id}`}
                value={option.trim()}
                checked={value === option.trim()}
                onChange={handleChange}
              />
              <label htmlFor={`${question.id}-${option}`}>{option.trim()}</label>
            </div>
          ))}
        </div>
      );

    case 'MultiChoiceMulti':
      const selectedOptions = value ? value.split(',') : [];
      return (
        <div className="form-control checkbox-group">
          <div className="checkbox-notice">
            Select all that apply, or leave blank to skip
          </div>
          {question.options?.split(',').map((option) => (
            <div key={option} className="checkbox-option">
              <input
                type="checkbox"
                id={`${question.id}-${option}`}
                value={option.trim()}
                checked={selectedOptions.includes(option.trim())}
                onChange={(e) => {
                  const option = e.target.value;
                  const newSelected = e.target.checked
                    ? [...selectedOptions, option]
                    : selectedOptions.filter(item => item !== option);
                  handleMultiChoiceChange(newSelected);
                }}
              />
              <label htmlFor={`${question.id}-${option}`}>{option.trim()}</label>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <input
          type="text"
          className="form-control"
          value={value || ''}
          onChange={handleChange}
        />
      );
  }
};

export default QuestionInput;