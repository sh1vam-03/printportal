const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/20",
    IN_PROGRESS: "bg-indigo-50 text-indigo-700 border-indigo-100 ring-indigo-500/20",
    COMPLETED: "bg-teal-50 text-teal-700 border-teal-100 ring-teal-500/20",
};

const dotStyles = {
    PENDING: "bg-amber-400",
    APPROVED: "bg-emerald-400",
    REJECTED: "bg-rose-400",
    IN_PROGRESS: "bg-indigo-400 animate-pulse",
    COMPLETED: "bg-teal-400",
};

const StatusBadge = ({ status }) => {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border shadow-sm ring-1 ring-inset whitespace-nowrap ${statusStyles[status] || "bg-gray-50 text-gray-700 border-gray-100"}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status] || "bg-gray-400"}`} />
            {status ? status.replace(/_/g, " ") : "UNKNOWN"}
        </span>
    );
};

export default StatusBadge;
