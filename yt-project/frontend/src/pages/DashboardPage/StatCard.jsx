function StatCard({ label, value, icon: Icon, color = "text-text-primary" }) {
  return (
    <div className="bg-bg-elevated rounded-xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-bg-border ${color}`}>
        <Icon size={20} aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
