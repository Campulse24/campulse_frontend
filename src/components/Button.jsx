import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    loading = false,
    disabled = false,
    icon,
    onClick,
    className = '',
    ...props
}) => {
    return (
        <button
            type={type}
            className={`btn btn-${variant} ${loading ? 'btn-loading' : ''} ${className}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <>
                    <span className="btn-spinner"></span>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {icon && <span className="btn-icon">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
