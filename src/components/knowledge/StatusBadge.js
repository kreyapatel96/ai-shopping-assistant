const STYLES = {
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
        STYLES[status] || STYLES.processing
      }`}
    >
      {status}
    </span>
  );
}
