import React from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = ({ id, checked, onChange, disabled }) => {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="toggle-switch-slider"></span>
      {id && <span className="toggle-switch-label"></span>}
    </label>
  );
};

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ToggleSwitch;