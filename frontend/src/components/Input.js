import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Component = ({ className, buttonName, onSubmit, ...inputProps }) => {
  const inputRef = useRef();

  const handleClick = () => {
    if (inputRef.current) {
      onSubmit(inputRef.current.value);
    }
  };
  const handleChange = (e) => {
    if (e.key === 'Enter') {
      onSubmit(e.target.value);
    }
  };

  return (
    <div className={classnames('input', className)}>
      <input
        ref={inputRef}
        onKeyPress={useCallback(handleChange, [onSubmit])}
        {...inputProps}
      />
      <button onClick={useCallback(handleClick, [inputRef])}>
        {buttonName}
      </button>
    </div>
  );
};

Component.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Component;
