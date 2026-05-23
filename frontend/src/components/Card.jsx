const Card = ({ children, className = "", hover = false }) => {
  return (
    <div
      className={`
        bg-bg-card border border-border rounded-2xl p-6
        ${hover ? 'hover:bg-bg-hover hover:border-border-light transition-all cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;