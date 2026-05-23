const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white',
    secondary: 'bg-bg-card hover:bg-bg-hover text-white border border-border',
    ghost: 'bg-transparent hover:bg-bg-card text-text-secondary hover:text-white',
    danger: 'bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20',
  };

  return (
    <button
      className={`
        px-6 py-3 rounded-xl font-medium text-sm
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
