const statusStyles = {
    PENDING: "bg-amber-100 text-amber-800 border border-amber-200",
    APPROVED: "bg-brand-50 text-brand-700 border border-brand-200",
    REJECTED: "bg-red-50 text-red-700 border border-red-200",
    IN_PROGRESS: "bg-violet-50 text-violet-700 border border-violet-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const StatusBadge = ({ status }) => {
    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || "bg-gray-100 text-gray-700"
                }`}
        >
            {status}
        </span>
    );
};

export default StatusBadge;
