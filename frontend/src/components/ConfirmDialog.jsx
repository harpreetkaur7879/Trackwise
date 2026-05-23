import Button from "./Button";

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
  confirmText = "Delete",
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-bg-card border border-border rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-text-secondary mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Working..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;