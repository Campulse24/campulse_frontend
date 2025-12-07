import { useState } from 'react';
import './Input.css';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    icon,
    required = false,
    placeholder = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;

    return (
        <div className="input-wrapper">
            <div className={`input-container ${error ? 'input-error' : ''} ${isFocused ? 'input-focused' : ''}`}>
                {icon && <span className="input-icon">{icon}</span>}
                <div className="input-field">
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        required={required}
                        {...props}
                    />
                    <label className={`input-label ${hasValue || isFocused ? 'input-label-float' : ''}`}>
                        {label} {required && <span className="input-required">*</span>}
                    </label>
                </div>
            </div>
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default Input;
