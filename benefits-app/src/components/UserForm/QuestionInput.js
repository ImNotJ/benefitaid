// QuestionInput.js
import React from 'react';

const QuestionInput = ({ question, value, onChange }) => {
    const handleChange = (e) => {
      const newValue = e.target.value;
      onChange(question.id, newValue);
    };
  
    const handleMultiChoiceChange = (selected) => {
      onChange(question.id, selected.join(','));
    };
  
    switch (question.questionType) {
      case 'Numerical':
        return (
          <input
            type="number"
            className="form-control"
            value={value || ''}
            onChange={handleChange}
            placeholder="Enter a number"
          />
        );
  
      case 'Date':
        return (
          <input
            type="date"
            className="form-control"
            value={value || ''}
            onChange={handleChange}
          />
        );
  
      case 'Email':
        return (
          <input
            type="email"
            className="form-control"
            value={value || ''}
            onChange={handleChange}
            placeholder="Enter email address"
          />
        );
  
      case 'MultiChoiceSingle':
        return (
          <div className="radio-group">
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
          <div className="checkbox-group">
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
            placeholder="Enter your answer"
          />
        );
    }
  };

export default QuestionInput;