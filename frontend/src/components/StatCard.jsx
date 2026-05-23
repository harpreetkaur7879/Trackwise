const StatCard = ({ label, value, change, icon }) => {
  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-4xl font-bold text-white mb-2">{value}</div>
      {change && (
        <div className={`text-sm ${change > 0 ? 'text-danger' : 'text-success'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
        </div>
      )}
    </div>
  );
};

export default StatCard;