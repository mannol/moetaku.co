import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Input = ({ className, buttonName, onSubmit, ...inputProps }) => {
  const inputRef = useRef();

  const handleClick = useCallback(() => {
    if (inputRef.current) {
      onSubmit(inputRef.current.value);
    }
  }, [onSubmit]);

  const handleChange = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        onSubmit(e.target.value);
      }
    },
    [onSubmit],
  );

  return (
    <div className={classnames('input', className)}>
      <input ref={inputRef} onKeyPress={handleChange} {...inputProps} />
      <button className="btn btn__primary" onClick={handleClick}>
        {buttonName}
      </button>
    </div>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Input;
