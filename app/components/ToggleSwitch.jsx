import React from 'react';
import PropTypes from 'prop-types';
import './styles/ToggleSwitch.css';

const ToggleSwitch = ({ id, checked, onChange, disabled }) => {
  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        className="toggle-switch-checkbox"
        id={id}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />
      {id ? (
        <label className="toggle-switch-label" htmlFor={id}>
          <span className="toggle-switch-inner" />
          <span className="toggle-switch-switch" />
        </label>
      ) : null}
    </div>
  );
};

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ToggleSwitch;